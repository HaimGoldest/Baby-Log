import { PartialStateUpdater } from '@ngrx/signals';
import { SettingsSlice } from './settings.slice';

export function toggleBusy(): PartialStateUpdater<SettingsSlice> {
  return (state) => ({ isBusy: !state.isBusy });
}
