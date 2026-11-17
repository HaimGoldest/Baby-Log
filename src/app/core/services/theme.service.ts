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
  AppThemeId,
  DEFAULT_APP_THEME,
  isAppThemeId,
} from '../theme/app-themes';

/**
 * Owns the theme on screen and keeps it apart from the saved one.
 *
 * The saved theme has three copies kept in step here: the `data-theme`
 * attribute on <html> that `styles.scss` keys on, a localStorage cache that
 * lets the next launch open in the right theme, and the `theme` field on the
 * signed-in user's profile, which is the source of truth across devices.
 *
 * A preview (the preferences page's unsaved choice) changes only `data-theme`:
 * nothing is cached or written until the page saves it with the rest of the
 * user's preferences and calls `confirmSaved`.
 *
 * An inline script in `src/index.html` applies the cached theme before the
 * first paint. This service, created by an app initializer, then takes over:
 * it validates that value and keeps the copies in sync from then on.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Also read by the pre-paint script in `src/index.html`; keep the two in sync. */
  private static readonly STORAGE_KEY = 'baby-log.theme';

  private readonly document = inject(DOCUMENT);
  private readonly sessionStore = inject(SessionStore);

  private readonly _savedTheme = signal<AppThemeId>(this.readCachedTheme());
  private readonly _previewTheme = signal<AppThemeId | null>(null);

  /** The user's stored theme: the profile's when signed in, else the cache. */
  public readonly savedTheme = this._savedTheme.asReadonly();

  /** The theme on screen: the preview while there is one, else the saved theme. */
  public readonly theme = computed(
    () => this._previewTheme() ?? this._savedTheme(),
  );

  // Narrowed so the profile effect re-runs when the user or their theme
  // changes, not on every snapshot of the user document.
  private readonly uid = computed(() => this.sessionStore.user()?.uid);
  private readonly profileTheme = computed(
    () => this.sessionStore.user()?.theme,
  );

  constructor() {
    // Applied here rather than from an effect: effects first run during change
    // detection, after the shell has already rendered once.
    this.render();

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
   * Shows a theme on screen without saving it, until `confirmSaved` or
   * `cancelPreview`. Previewing the saved theme simply ends the preview.
   */
  public preview(theme: AppThemeId): void {
    this._previewTheme.set(theme === this._savedTheme() ? null : theme);
    this.render();
  }

  /** Ends any preview, returning the screen to the saved theme. */
  public cancelPreview(): void {
    if (this._previewTheme() === null) return;

    this._previewTheme.set(null);
    this.render();
  }

  /**
   * Records a theme that is now stored on the user's profile: it becomes the
   * saved theme, is cached for the next launch, and a preview of it ends. A
   * preview of a different theme stays on screen, so a profile change from
   * another device does not discard a choice the user has not saved yet.
   */
  public confirmSaved(theme: AppThemeId): void {
    this._savedTheme.set(theme);
    if (this._previewTheme() === theme) this._previewTheme.set(null);

    this.writeCache(theme);
    this.render();
  }

  private adoptProfileTheme(stored: unknown): void {
    if (isAppThemeId(stored)) {
      this.confirmSaved(stored);
      return;
    }

    this.confirmSaved(DEFAULT_APP_THEME);

    // Only a missing field is backfilled. A value this build does not
    // recognise was most likely written by a newer one, and overwriting it
    // would discard that choice on every device.
    if (stored === undefined) this.persist(DEFAULT_APP_THEME);
  }

  private persist(theme: AppThemeId): void {
    this.sessionStore.updateTheme(theme).catch((error: unknown) => {
      // No rollback needed here: a rejected write reverts the watched profile,
      // and the effect above re-applies the stored theme.
      console.error('Failed to save the theme:', error);
    });
  }

  private render(): void {
    this.document.documentElement.dataset['theme'] = this.theme();
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
