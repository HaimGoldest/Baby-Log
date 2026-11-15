import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BabyEventCategory } from '../../../models/baby.model';

/**
 * An event category's icon on its pastel tile.
 *
 * The host carries `data-category`, which picks the category's colours from
 * the palette in `src/styles.scss` (falling back to the primary container for
 * unknown ids) and exposes them to the host's own styles. Size it from the
 * parent with `--category-icon-size` (default 48px).
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
    '[attr.data-category]': 'category().id',
  },
})
export class CategoryIconComponent {
  public readonly category = input.required<BabyEventCategory>();
}
