import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, from, of, pipe, switchMap, tap } from 'rxjs';
import { User as FirebaseUser } from 'firebase/auth';
import { BabyEventFavorites, User } from '../../../models/user.model';
import { Baby } from '../../../models/baby.model';
import { reconcileUser } from '../../user/user-reconciler';
import { AppService } from '../../services/app.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { BabiesStore } from '../babies/babies.store';
import { initialSessionState } from './session.state';
import { NewBabyData } from '../babies/babies.state';

export const SessionStore = signalStore(
  { providedIn: 'root' },
  withState(initialSessionState),
  withProps(() => ({
    _authService: inject(AuthService),
    _userService: inject(UserService),
    _babiesStore: inject(BabiesStore),
    _appService: inject(AppService),
  })),
  withComputed(({ user }) => ({
    isLoggedIn: computed(() => !!user()),
    userHaveBabies: computed(() => (user()?.babiesUids.length ?? 0) > 0),
    eventFavorites: computed(() => user()?.eventFavorites ?? []),
  })),
  withMethods((store) => {
    const watchUser = rxMethod<string | null>(
      pipe(
        switchMap((uid: string | null) =>
          uid ? store._userService.watch(uid) : of<User | null>(null),
        ),
        tap((user: User | null) => {
          if (user) patchState(store, { user });
        }),
      ),
    );

    const attachBabyToUser = (user: User, babyUid: string): Promise<void> =>
      store._userService.update(user.uid, {
        babiesUids: [...(user.babiesUids ?? []), babyUid],
      });

    const handleSignedIn = async (
      firebaseUser: FirebaseUser,
    ): Promise<void> => {
      const existing = await store._userService.get(firebaseUser.uid);
      const { user, needSaving } = reconcileUser(existing, firebaseUser);

      // Persist before attaching the watcher: the first snapshot would
      // otherwise overwrite the reconciled user with the stale document.
      if (needSaving) await store._userService.save(user);

      patchState(store, {
        user,
        userimageUrl: firebaseUser.photoURL ?? null,
        loginError: null,
      });
      watchUser(user.uid);

      if (user.babiesUids.length > 0) {
        await store._babiesStore.select(user.babiesUids[0], user);
      }

      // Flipped last, deliberately: `status` is what the app shell navigates
      // on, so it must not read 'ready' until the user and their baby are both
      // loaded. Patching it earlier would route to the events page before the
      // baby arrived, rendering an empty list for a frame.
      patchState(store, { status: 'ready' });
    };

    const handleSignedOut = (): void => {
      watchUser(null);
      store._babiesStore.clear();
      patchState(store, { ...initialSessionState, status: 'signed-out' });
    };

    const handleAuthChange = async (
      firebaseUser: FirebaseUser | null,
    ): Promise<void> => {
      store._appService.isLoading.set(false);
      console.log('Auth state changed, Firebase User:', firebaseUser);

      if (firebaseUser) {
        await handleSignedIn(firebaseUser);
      } else {
        handleSignedOut();
      }
    };

    return {
      // concatMap, not switchMap: an in-flight sign-in cannot be cancelled, so
      // transitions are serialized to guarantee the last emission wins.
      connectAuth: rxMethod<FirebaseUser | null>(
        pipe(concatMap((firebaseUser) => from(handleAuthChange(firebaseUser)))),
      ),

      /**
       * Initiates the sign-in process using Google authentication.
       * Resets any previous login errors and sets the loading state.
       * Handles errors that may occur during the sign-in process.
       */
      async signIn(): Promise<void> {
        patchState(store, { loginError: null });
        store._appService.isLoading.set(true);

        try {
          await store._authService.signInWithGoogle();
        } catch (err: any) {
          store._appService.isLoading.set(false);
          patchState(store, { loginError: err?.message ?? 'Login failed' });
          console.error('Google sign-in error:', err);
        }
      },

      /**
       * Signs the user out of the application.
       */
      async signOut(): Promise<void> {
        try {
          await store._authService.signOut();
        } catch (err) {
          console.error('Error manually signing out:', err);
        }
      },

      /**
       * Updates the list of event favorites for the currently signed-in user.
       * @param favorites The updated list of event favorites for the user.
       * @returns A promise that resolves when the update is complete.
       */
      async updateEventFavorites(
        favorites: BabyEventFavorites[],
      ): Promise<void> {
        const user = store.user();
        if (!user) {
          throw new Error('No user is signed in, cannot save event favorites.');
        }

        await store._userService.update(user.uid, {
          eventFavorites: favorites,
        });

        // Patched locally after the write, not before: the watcher only
        // re-emits on a server round trip, so the panel would otherwise keep
        // rendering the previous order, while a failed write must not leave
        // the local state claiming a success that never happened.
        patchState(store, { user: { ...user, eventFavorites: favorites } });
      },

      /**
       * Adds a new baby for the currently signed-in user.
       *
       * A data operation only: it resolves once the baby exists and is linked,
       * and rejects otherwise. The caller decides where to navigate.
       * @param babyData The data for the new baby to be added.
       */
      async addNewBaby(babyData: NewBabyData): Promise<void> {
        const user = store.user();
        if (!user) {
          throw new Error('No user is signed in, cannot add a baby.');
        }

        try {
          const baby = await store._babiesStore.createBaby(user.uid, babyData);
          await attachBabyToUser(user, baby.uid);
        } catch (error) {
          console.error('Failed to add new baby to user:', error);
          throw error;
        }
      },

      /**
       * Adds an existing baby to the currently signed-in user.
       *
       * Rejects when no baby carries that uid, so a mistyped key surfaces to
       * the caller instead of resolving as a silent no-op.
       * @param babyUid The UID of the existing baby to be added.
       */
      async addExistingBaby(babyUid: string): Promise<void> {
        const user = store.user();
        if (!user) {
          throw new Error('No user is signed in, cannot add a baby.');
        }

        try {
          const baby = await store._babiesStore.select(babyUid, user);
          if (!baby) {
            throw new Error(`No baby exists with the uid ${babyUid}.`);
          }

          await attachBabyToUser(user, babyUid);
        } catch (error) {
          console.error('Failed to add existing baby:', error);
          throw error;
        }
      },

      /**
       * Removes a baby from the currently signed-in user.
       * @param baby The baby to be removed.
       * @returns A promise that resolves when the baby is successfully removed.
       */
      async removeBaby(baby: Baby): Promise<void> {
        const user = store.user();
        if (!user) {
          throw new Error('No user is signed in, cannot remove a baby.');
        }

        try {
          await store._babiesStore.deleteBaby(user.uid);
          await store._userService.update(user.uid, {
            babiesUids: user.babiesUids.filter((uid) => uid !== baby.uid),
          });
        } catch (error) {
          console.error('Failed to delete baby from user:', error);
          throw error;
        }
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.connectAuth(store._authService.authState$);
    },
  }),
);
