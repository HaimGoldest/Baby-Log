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
import { MatDividerModule } from '@angular/material/divider';
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
import { CommentDraft, FavoriteDraft } from './baby-event-preferences.vm';

/**
 * Comparable projection of a draft: category order plus comment text, which is
 * exactly what gets persisted. Comment ids are local and deliberately excluded.
 */
function serializeDraft(favorites: FavoriteDraft[]): string {
  return JSON.stringify(
    favorites.map((item) => [
      item.category.id,
      item.comments.map((comment) => comment.text),
    ]),
  );
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
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
  ],
})
export class BabyEventsPreferencesPage {
  private sessionStore = inject(SessionStore);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  /** Purely local and monotonic: only ever used as an `@for` key. */
  private nextCommentId = 0;

  private readonly draft = signal<FavoriteDraft[]>([]);
  private readonly baseline = signal<string>('');

  public readonly strings = BabyEventsPreferencesStrings;
  public readonly favorites = this.draft.asReadonly();

  /**
   * Compared against the snapshot taken when the draft was seeded, so an edit
   * that is typed and then undone correctly disables saving again.
   */
  public readonly isDirty = computed(
    () => serializeDraft(this.draft()) !== this.baseline(),
  );

  public readonly availableCategories = computed(() =>
    BABY_EVENT_CATEGORIES_DATA.filter(
      (category) =>
        !this.draft().some((item) => item.category.id === category.id),
    ),
  );

  public constructor() {
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
    if (!this.isDirty()) return;

    const favorites: BabyEventFavorites[] = this.draft().map((item) => ({
      categoryId: item.category.id,
      // Blanks are dropped here rather than while typing: emptying the field
      // under the caret would delete the row the user is still editing.
      commonComments: item.comments
        .map((comment) => comment.text.trim())
        .filter((text) => !!text),
    }));

    try {
      await this.sessionStore.updateEventFavorites(favorites);
      this.navigateEventsPage();
    } catch (error) {
      this.notificationService.error(
        NotificationStrings.SAVE_PREFERENCES_FAILED,
      );
    }
  }

  public cancel(): void {
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

    this.draft.set(draft);
    this.baseline.set(serializeDraft(draft));
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
