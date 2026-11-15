import type { AppThemeId } from '../core/theme/app-themes';

export interface User {
  uid: string;
  name: string;
  email: string;
  eventFavorites: BabyEventFavorites[];
  babiesUids: string[];
  /** Absent on documents created before themes existed; ThemeService backfills it. */
  theme?: AppThemeId;
}

export interface BabyEventFavorites {
  categoryId: string;
  commonComments: string[];
}
