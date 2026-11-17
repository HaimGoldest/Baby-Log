import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { APP_THEMES, AppThemeId } from '../../../core/theme/app-themes';
import ThemePickerStrings from './theme-picker.strings';

/**
 * Lists every theme as a tile with a swatch preview. Presentational: it shows
 * `selected` and emits a new choice; the caller decides whether to preview,
 * save or discard it (the preferences page previews it at once and saves it
 * with the rest of the preferences).
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
  public readonly selected = input.required<AppThemeId>();
  public readonly selectedChange = output<AppThemeId>();

  public readonly themes = APP_THEMES;
  public readonly strings = ThemePickerStrings;

  public select(theme: AppThemeId): void {
    this.selectedChange.emit(theme);
  }
}
