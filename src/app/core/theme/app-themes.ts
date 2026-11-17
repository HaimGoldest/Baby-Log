import AppThemesStrings from './app-themes.strings';

/**
 * The theme registry: the single source of truth for which themes exist.
 *
 * Each id needs, in `src/styles.scss`, a matching `:root[data-theme='<id>']`
 * block and an entry in `$_theme-key-colors` (which also feeds the picker's
 * swatch). That is all a new theme needs besides its entry here. Array order is
 * the order the theme picker lists them in.
 */
export const APP_THEMES = [
  { id: 'nordic', label: AppThemesStrings.NORDIC },
  { id: 'mint', label: AppThemesStrings.MINT },
  { id: 'terracotta', label: AppThemesStrings.TERRACOTTA },
  { id: 'boy', label: AppThemesStrings.BOY },
  { id: 'girl', label: AppThemesStrings.GIRL },
  { id: 'dark', label: AppThemesStrings.DARK },
] as const;

export type AppThemeId = (typeof APP_THEMES)[number]['id'];

export type AppTheme = (typeof APP_THEMES)[number];

/** Applied when nothing valid is cached or stored, and backfilled on profiles without one. */
export const DEFAULT_APP_THEME: AppThemeId = 'nordic';

export function isAppThemeId(value: unknown): value is AppThemeId {
  return APP_THEMES.some((theme) => theme.id === value);
}
