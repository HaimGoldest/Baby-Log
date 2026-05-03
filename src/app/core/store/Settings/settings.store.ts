import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { initialSettingsSlice } from './settings.slice';

export const SettingsStore = signalStore(
  withState(initialSettingsSlice),
  withComputed(() => ({})),
  withMethods(() => ({})),
  withHooks({}),
);
