import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { BabyEventCategory } from '../../../models/baby.model';
import { SessionStore } from '../../../core/stores/session/session.store';
import {
  CategoryColorId,
  resolveCategoryColor,
} from '../../../core/theme/category-colors';

/**
 * An event category's icon on its coloured tile.
 *
 * The tile takes the colour the signed-in user chose for the category, or the
 * theme default when there is none: the host carries `data-category-color`,
 * which `src/styles.scss` turns into `--app-cat-bg` / `--app-cat-fg`. Size it
 * from the parent with `--category-icon-size` (default 48px).
 *
 * The icon is decorative: callers show the category name next to it.
 */
@Component({
  selector: 'app-category-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './category-icon.component.html',
  styleUrl: './category-icon.component.scss',
  host: {
    '[attr.data-category-color]': 'color()',
  },
})
export class CategoryIconComponent {
  private readonly sessionStore = inject(SessionStore);

  public readonly category = input.required<BabyEventCategory>();

  /**
   * Shown instead of the saved colour, such as an unsaved choice previewed on
   * the preferences page.
   */
  public readonly colorOverride = input<CategoryColorId>();

  protected readonly color = computed<CategoryColorId>(
    () =>
      this.colorOverride() ??
      resolveCategoryColor(
        this.sessionStore.categoryColors(),
        this.category().id,
      ),
  );
}
