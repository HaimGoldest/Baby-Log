/**
 * The theme registry: the single source of truth for which themes exist.
 *
 * Each id must have a matching `:root[data-theme='<id>']` block in
 * `src/styles.scss`, which is all a new theme needs besides its entry here.
 * Array order is the order `ThemeService.cycleTheme()` steps through.
 */
export const APP_THEMES = ['nordic', 'mint', 'terracotta', 'dark'] as const;

export type AppThemeId = (typeof APP_THEMES)[number];

/** Applied when nothing valid is cached or stored, and backfilled on profiles without one. */
export const DEFAULT_APP_THEME: AppThemeId = 'nordic';

export function isAppThemeId(value: unknown): value is AppThemeId {
  return (
    typeof value === 'string' &&
    (APP_THEMES as readonly string[]).includes(value)
  );
}
