import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { of, pipe, switchMap, tap } from 'rxjs';
import { Baby } from '../../../models/baby.model';
import { User } from '../../../models/user.model';
import { BabiesService } from '../../services/babies.service';
import { FireStoreHelperService } from '../../firebase/fire-store-helper.service';
import type { NewBabyData } from './babies.state';
import { initialBabiesState } from './babies.state';

export const BabiesStore = signalStore(
  { providedIn: 'root' },
  withState(initialBabiesState),
  withProps(() => ({
    _babiesService: inject(BabiesService),
    _firestoreHelper: inject(FireStoreHelperService),
  })),
  withMethods((store) => {
    // switchMap drops the previous document stream, so selecting another baby
    // or signing out never leaves a stale listener attached.
    const watchBaby = rxMethod<string | null>(
      pipe(
        switchMap((babyUid: string | null) =>
          babyUid ? store._babiesService.watch(babyUid) : of<Baby | null>(null),
        ),
        tap((baby: Baby | null) => {
          if (baby) patchState(store, { baby });
        }),
      ),
    );

    const updateBaby = async (changes: Partial<Baby>): Promise<void> => {
      const baby = store.baby();
      if (!baby) throw new Error('No baby selected.');

      const updatedBaby: Baby = { ...baby, ...changes };
      await store._babiesService.update(baby.uid, updatedBaby);
      patchState(store, { baby: updatedBaby });
    };

    return {
      /**
       * Selects a baby by its UID, optionally attaching the current user if needed.
       * @param babyUid The UID of the baby to select.
       * @param user The current user, used to attach to the baby if needed.
       * @returns The selected baby, or null if not found.
       */
      async select(
        babyUid: string,
        user: User | null = null,
      ): Promise<Baby | null> {
        watchBaby(null);

        try {
          const existing = await store._babiesService.get(babyUid);

          if (!existing) {
            patchState(store, { baby: null });
            console.error('No baby found with the given UID:', babyUid);
            return null;
          }

          if (user && !existing.usersUids.includes(user.uid)) {
            const usersUids = [...existing.usersUids, user.uid];
            await store._babiesService.update(babyUid, { usersUids });
            existing.usersUids = usersUids;
          }

          patchState(store, { baby: existing });
          watchBaby(babyUid);
          return existing;
        } catch (err) {
          console.error('Failed to get the baby from the DB:', err);
          return null;
        }
      },

      /**
       * Creates a new baby record and attaches it to the specified user.
       * @param userUid The UID of the user creating the baby.
       * @param babyData The data for the new baby.
       * @returns The newly created baby.
       */
      async createBaby(userUid: string, babyData: NewBabyData): Promise<Baby> {
        const baby: Baby = {
          ...babyData,
          uid: store._firestoreHelper.generateUid(),
          eventsData: [],
          measurementsData: [],
          usersUids: [userUid],
        };

        await store._babiesService.create(baby);
        patchState(store, { baby });
        watchBaby(baby.uid);
        return baby;
      },

      /**
       * Updates the current baby with the specified changes.
       * @param changes The changes to apply to the current baby.
       * @returns A promise that resolves when the update is complete.
       */
      updateBaby,

      /**
       * Deletes the baby record and its image only when no other user is
       * attached to it; otherwise just detaches the current user.
       */
      async deleteBaby(userUid: string): Promise<void> {
        const baby = store.baby();
        if (!baby) return;

        watchBaby(null);

        try {
          if (baby.usersUids.length > 1) {
            await store._babiesService.update(baby.uid, {
              usersUids: baby.usersUids.filter((uid) => uid !== userUid),
            });
          } else {
            await store._babiesService.delete(baby.uid);
            try {
              await store._babiesService.deleteImage(baby.uid);
            } catch (err) {
              console.error('Error deleting baby image from storage:', err);
            }
          }

          patchState(store, { baby: null });
        } catch (err) {
          console.error('Error deleting baby:', err);
          throw err;
        }
      },

      async uploadImage(babyUid: string, image: File): Promise<void> {
        await store._babiesService.uploadImage(babyUid, image);
        const imageUrl = await store._babiesService.getImageUrl(babyUid);
        if (imageUrl) {
          await updateBaby({ imageUrl });
        }
      },

      /**
       * Clears the current baby selection and resets the store to its initial state.
       */
      clear(): void {
        watchBaby(null);
        patchState(store, initialBabiesState);
      },
    };
  }),
);
