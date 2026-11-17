import type { AppThemeId } from '../core/theme/app-themes';
import type { CategoryColorMap } from '../core/theme/category-colors';

export interface User {
  uid: string;
  name: string;
  email: string;
  eventFavorites: BabyEventFavorites[];
  babiesUids: string[];
  /** Absent on documents created before themes existed; ThemeService backfills it. */
  theme?: AppThemeId;
  /**
   * Custom colours per category id. Absent until the user picks one, and
   * never backfilled: a category without an entry follows the theme.
   */
  categoryColors?: CategoryColorMap;
}

export interface BabyEventFavorites {
  categoryId: string;
  commonComments: string[];
}
