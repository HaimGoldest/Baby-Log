import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BabyEventFavoriteItemComponent } from '../components/baby-event-favorite-item/baby-event-favorite-item.component';
import { AppRoute } from '../../../enums/app-route.enum';
import BabyEventsPreferencesStrings from './baby-event-preferences.strings';
import { SessionStore } from '../../../core/stores/session/session.store';
import { NotificationService } from '../../../core/services/notification.service';
import NotificationStrings from '../../../shared/strings/notification.strings';
import BABY_EVENT_CATEGORIES_DATA from '../../../core/default-data/baby-event-categories-data';
import { BabyEventCategory } from '../../../models/baby.model';
import { BabyEventFavorites } from '../../../models/user.model';
import { AlertMessageComponent } from '../../../shared/components/alert-message/alert-message.component';
import { CategoryIconComponent } from '../../../shared/components/category-icon/category-icon.component';
import { ThemePickerComponent } from '../../../shared/components/theme-picker/theme-picker.component';
import {
  CategoryColorId,
  CategoryColorMap,
  resolveCategoryColor,
  withCategoryColor,
} from '../../../core/theme/category-colors';
import { CommentDraft, FavoriteDraft } from './baby-event-preferences.vm';

/**
 * Comparable projection of a draft: category order, comment text and custom
 * colours, which is exactly what gets persisted. Comment ids are local and
 * deliberately excluded, and colours are sorted by category id so the order
 * they were picked in does not count as a change.
 */
function serializeDraft(
  favorites: FavoriteDraft[],
  colors: CategoryColorMap,
): string {
  return JSON.stringify({
    favorites: favorites.map((item) => [
      item.category.id,
      item.comments.map((comment) => comment.text),
    ]),
    colors: Object.entries(colors).sort(([a], [b]) => a.localeCompare(b)),
  });
}

@Component({
  selector: 'app-baby-event-preferences',
  templateUrl: './baby-event-preferences.page.html',
  styleUrls: ['./baby-event-preferences.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AlertMessageComponent,
    BabyEventFavoriteItemComponent,
    CategoryIconComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ThemePickerComponent,
  ],
})
export class BabyEventsPreferencesPage {
  private sessionStore = inject(SessionStore);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  /** Purely local and monotonic: only ever used as an `@for` key. */
  private nextCommentId = 0;

  private readonly draft = signal<FavoriteDraft[]>([]);

  /**
   * Keyed by category, not held on each favorite: a colour outlives removing
   * the category from the favorites, since its past events in the feed keep
   * showing it.
   */
  private readonly colorDraft = signal<CategoryColorMap>({});
  private readonly baseline = signal<string>('');

  public readonly strings = BabyEventsPreferencesStrings;
  public readonly favorites = this.draft.asReadonly();

  /**
   * Compared against the snapshot taken when the draft was seeded, so an edit
   * that is typed and then undone correctly disables saving again.
   */
  public readonly isDirty = computed(
    () => serializeDraft(this.draft(), this.colorDraft()) !== this.baseline(),
  );

  /**
   * At least one favorite is mandatory: with none, the events panel is empty
   * and no event can be created, so saving that state is never allowed.
   */
  public readonly canSave = computed(
    () => this.isDirty() && this.draft().length > 0,
  );

  /**
   * Persisted favorites, not the draft: with none saved, the events page
   * bounces straight back here through the route guard, so cancelling would
   * appear to do nothing. Disabled instead of silently looping.
   */
  public readonly canCancel = computed(
    () => this.sessionStore.eventFavorites().length > 0,
  );

  public readonly availableCategories = computed(() =>
    BABY_EVENT_CATEGORIES_DATA.filter(
      (category) =>
        !this.draft().some((item) => item.category.id === category.id),
    ),
  );

  constructor() {
    this.seedDraft();
  }

  public moveUp(index: number): void {
    this.swap(index, index - 1);
  }

  public moveDown(index: number): void {
    this.swap(index, index + 1);
  }

  public removeFavorite(index: number): void {
    this.draft.update((items) => items.filter((_, i) => i !== index));
  }

  public addFavorite(category: BabyEventCategory): void {
    this.draft.update((items) => [...items, { category, comments: [] }]);
  }

  /** The category's colour in the draft, for the previews on this page. */
  public colorOf(categoryId: string): CategoryColorId {
    return resolveCategoryColor(this.colorDraft(), categoryId);
  }

  public setColor(categoryId: string, color: CategoryColorId): void {
    this.colorDraft.update((colors) =>
      withCategoryColor(colors, categoryId, color),
    );
  }

  public addComment(index: number): void {
    this.updateComments(index, (comments) => [
      ...comments,
      { id: this.nextCommentId++, text: '' },
    ]);
  }

  public editComment(index: number, change: CommentDraft): void {
    this.updateComments(index, (comments) =>
      comments.map((comment) =>
        comment.id === change.id ? { ...comment, text: change.text } : comment,
      ),
    );
  }

  public removeComment(index: number, commentId: number): void {
    this.updateComments(index, (comments) =>
      comments.filter((comment) => comment.id !== commentId),
    );
  }

  public async save(): Promise<void> {
    if (!this.canSave()) return;

    const favorites: BabyEventFavorites[] = this.draft().map((item) => ({
      categoryId: item.category.id,
      // Blanks are dropped here rather than while typing: emptying the field
      // under the caret would delete the row the user is still editing.
      commonComments: item.comments
        .map((comment) => comment.text.trim())
        .filter((text) => !!text),
    }));

    try {
      await this.sessionStore.updatePreferences(favorites, this.colorDraft());
      this.navigateEventsPage();
    } catch {
      this.notificationService.error(
        NotificationStrings.SAVE_PREFERENCES_FAILED,
      );
    }
  }

  public cancel(): void {
    if (!this.canCancel()) return;

    this.seedDraft();
    this.navigateEventsPage();
  }

  /**
   * Seeded imperatively rather than through an effect: the user document is
   * watched, and a remote re-emission mid-edit would otherwise wipe the draft.
   */
  private seedDraft(): void {
    const draft: FavoriteDraft[] = this.sessionStore
      .eventFavorites()
      .map((favorite) => ({
        category: BABY_EVENT_CATEGORIES_DATA.find(
          (category) => category.id === favorite.categoryId,
        ),
        comments: favorite.commonComments.map((text) => ({
          id: this.nextCommentId++,
          text,
        })),
      }))
      .filter((item) => !!item.category);
    const colors = this.sessionStore.categoryColors();

    this.draft.set(draft);
    this.colorDraft.set(colors);
    this.baseline.set(serializeDraft(draft, colors));
  }

  private swap(from: number, to: number): void {
    this.draft.update((items) => {
      if (to < 0 || to >= items.length) return items;

      const next = [...items];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  }

  private updateComments(
    index: number,
    project: (comments: CommentDraft[]) => CommentDraft[],
  ): void {
    this.draft.update((items) =>
      items.map((item, i) =>
        i === index ? { ...item, comments: project(item.comments) } : item,
      ),
    );
  }

  private navigateEventsPage(): void {
    this.router.navigate(['/', AppRoute.BabyEvents]);
  }
}
