import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { BabyEventsPanelItemComponent } from './baby-events-panel-item/baby-events-panel-item.component';
import { BabyEventCategory } from '../../../../models/baby.model';
import { SessionStore } from '../../../../core/stores/session/session.store';
import BABY_EVENT_CATEGORIES_DATA from '../../../../core/default-data/baby-event-categories-data';
import { BabyEventCategoryView } from '../../pages/baby-events.vm';

@Component({
  selector: 'app-baby-events-panel',
  templateUrl: './baby-events-panel.component.html',
  styleUrl: './baby-events-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [BabyEventsPanelItemComponent],
})
export class BabyEventsPanelComponent {
  private sessionStore = inject(SessionStore);

  /**
   * Sparse join driven by the favorites list: a category is listed only if the
   * user has a favorite for it, and the order is the user's own saved order
   * rather than the order of the static catalogue.
   *
   * Built here rather than in SessionStore so the category catalogue stays a
   * feature concern and core does not import from a feature.
   */
  public activeBabyEventCategories = computed<BabyEventCategoryView[]>(() =>
    this.sessionStore
      .eventFavorites()
      .map((favorite) => ({
        category: BABY_EVENT_CATEGORIES_DATA.find(
          (c) => c.id === favorite.categoryId,
        ),
        favorite,
      }))
      .filter((item) => !!item.category),
  );

  /** Id of the category the list is currently filtered by, if any. */
  public activeCategoryId = input<string | null>(null);

  public filter = output<BabyEventCategory>();

  public onFilter(category: BabyEventCategory): void {
    this.filter.emit(category);
  }
}
