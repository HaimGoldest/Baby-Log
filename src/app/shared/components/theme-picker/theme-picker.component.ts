import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../../core/services/theme.service';
import { APP_THEMES, AppThemeId } from '../../../core/theme/app-themes';
import ThemePickerStrings from './theme-picker.strings';

/**
 * Lists every theme as a tile with a swatch preview; choosing one applies and
 * saves it at once.
 *
 * Built on native radio inputs (visually hidden inside each tile), so arrow
 * keys move between themes and assistive tech announces a single-choice group.
 */
@Component({
  selector: 'app-theme-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: './theme-picker.component.html',
  styleUrl: './theme-picker.component.scss',
})
export class ThemePickerComponent {
  private readonly themeService = inject(ThemeService);

  public readonly themes = APP_THEMES;
  public readonly activeTheme = this.themeService.theme;
  public readonly strings = ThemePickerStrings;

  public select(theme: AppThemeId): void {
    this.themeService.setTheme(theme);
  }
}
