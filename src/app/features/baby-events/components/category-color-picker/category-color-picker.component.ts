import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  viewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuItem, MatMenuModule } from '@angular/material/menu';
import {
  CATEGORY_COLOR_PALETTE,
  CategoryColorId,
} from '../../../../core/theme/category-colors';
import CategoryColorPickerStrings from './category-color-picker.strings';

/**
 * A compact button showing a category's colour, which opens a scrollable menu
 * of every CATEGORY_COLOR_PALETTE entry. Presentational: it shows `selected`
 * and emits a new choice, and the caller decides what to do with it.
 *
 * The menu items are radio items (`menuitemradio` with `aria-checked`), so
 * assistive tech announces which colour is current.
 */
@Component({
  selector: 'app-category-color-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './category-color-picker.component.html',
  styleUrl: './category-color-picker.component.scss',
})
export class CategoryColorPickerComponent {
  /** In palette order, which is also the order of `colors`. */
  private readonly items = viewChildren(MatMenuItem);

  public readonly selected = input.required<CategoryColorId>();
  public readonly selectedChange = output<CategoryColorId>();

  public readonly colors = CATEGORY_COLOR_PALETTE;
  public readonly strings = CategoryColorPickerStrings;

  public readonly selectedColor = computed(
    () =>
      this.colors.find((color) => color.id === this.selected()) ??
      this.colors[0],
  );

  public readonly buttonLabel = computed(
    () => `${this.strings.CHOOSE_COLOR} (${this.selectedColor().label})`,
  );

  public select(color: CategoryColorId): void {
    this.selectedChange.emit(color);
  }

  /**
   * Opens the list on the current colour rather than at the top, which can
   * be several screens of the menu away. Focusing it here, before the menu
   * focuses its first item, scrolls it into view and also moves the menu's
   * arrow-key position to it.
   */
  public onMenuOpened(): void {
    const index = this.colors.findIndex((color) => color.id === this.selected());
    this.items()[index]?.focus('program');
  }
}
