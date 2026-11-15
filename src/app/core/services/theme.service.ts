import {
  DOCUMENT,
  Injectable,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { SessionStore } from '../stores/session/session.store';
import {
  APP_THEMES,
  AppThemeId,
  DEFAULT_APP_THEME,
  isAppThemeId,
} from '../theme/app-themes';

/**
 * Owns the active theme and keeps its three copies in step: the `data-theme`
 * attribute on <html> that `styles.scss` keys on, a localStorage cache that
 * lets the next launch open in the right theme, and the `theme` field on the
 * signed-in user's profile, which is the source of truth across devices.
 *
 * An inline script in `src/index.html` applies the cached theme before the
 * first paint. This service, created by an app initializer, then takes over:
 * it validates that value and keeps the three copies in sync from then on.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Also read by the pre-paint script in `src/index.html`; keep the two in sync. */
  private static readonly STORAGE_KEY = 'baby-log.theme';

  private readonly document = inject(DOCUMENT);
  private readonly sessionStore = inject(SessionStore);

  private readonly _theme = signal<AppThemeId>(this.readCachedTheme());
  public readonly theme = this._theme.asReadonly();

  // Narrowed so the profile effect re-runs when the user or their theme
  // changes, not on every snapshot of the user document.
  private readonly uid = computed(() => this.sessionStore.user()?.uid);
  private readonly profileTheme = computed(
    () => this.sessionStore.user()?.theme,
  );

  constructor() {
    // Applied here rather than from an effect: effects first run during change
    // detection, after the shell has already rendered once.
    this.applyToDocument(this._theme());

    effect(() => {
      const uid = this.uid();
      const stored = this.profileTheme();

      // Signed out: keep the cached theme, so the login page matches the last
      // session. Untracked, so that the effect depends on the profile alone and
      // not on anything adopting a theme reads.
      if (uid) untracked(() => this.adoptProfileTheme(stored));
    });
  }

  /**
   * Advances to the next theme in APP_THEMES, wrapping from the last back to
   * the first, and saves it to the signed-in user's profile.
   */
  public cycleTheme(): void {
    const index = APP_THEMES.indexOf(this._theme());
    const next = APP_THEMES[(index + 1) % APP_THEMES.length];

    this.apply(next);
    if (this.uid()) this.persist(next);
  }

  private adoptProfileTheme(stored: unknown): void {
    if (isAppThemeId(stored)) {
      this.apply(stored);
      return;
    }

    this.apply(DEFAULT_APP_THEME);

    // Only a missing field is backfilled. A value this build does not
    // recognise was most likely written by a newer one, and overwriting it
    // would discard that choice on every device.
    if (stored === undefined) this.persist(DEFAULT_APP_THEME);
  }

  private apply(theme: AppThemeId): void {
    this._theme.set(theme);
    this.applyToDocument(theme);
    this.writeCache(theme);
  }

  private persist(theme: AppThemeId): void {
    this.sessionStore.updateTheme(theme).catch((error: unknown) => {
      // No rollback needed here: a rejected write reverts the watched profile,
      // and the effect above re-applies the stored theme.
      console.error('Failed to save the theme:', error);
    });
  }

  private applyToDocument(theme: AppThemeId): void {
    this.document.documentElement.dataset['theme'] = theme;
  }

  private readCachedTheme(): AppThemeId {
    try {
      const cached = this.document.defaultView?.localStorage.getItem(
        ThemeService.STORAGE_KEY,
      );
      return isAppThemeId(cached) ? cached : DEFAULT_APP_THEME;
    } catch {
      // Storage can throw outright (private browsing, blocked site data).
      return DEFAULT_APP_THEME;
    }
  }

  private writeCache(theme: AppThemeId): void {
    try {
      this.document.defaultView?.localStorage.setItem(
        ThemeService.STORAGE_KEY,
        theme,
      );
    } catch {
      // Best effort: without the cache, the next launch opens on the default
      // and the profile corrects it once the user loads.
    }
  }
}
