import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { User } from '../../../models/user.model';

export interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setUser(user: User): void {
      patchState(store, { user });
    },
    updateUser(changes: Partial<User>): void {
      patchState(store, (state) =>
        state.user ? { user: { ...state.user, ...changes } } : state,
      );
    },
    clearUser(): void {
      patchState(store, initialState);
    },
  })),
);
