import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { BabyEventCategory, BabyEvent } from '../../../../../models/baby.model';
import { BabyEventsService } from '../../../services/baby-events.service';
import { SessionStore } from '../../../../../core/stores/session/session.store';
import { NotificationService } from '../../../../../core/services/notification.service';
import NotificationStrings from '../../../../../shared/strings/notification.strings';
import { LongPressDirective } from '../../../../../shared/directives/long-press.directive';
import { BabyEventCategoryView } from '../../../pages/baby-events.vm';
import BabyEventsPanelItemStrings from './baby-events-panel-item.strings';

@Component({
  selector: 'app-baby-events-panel-item',
  templateUrl: './baby-events-panel-item.component.html',
  styleUrl: './baby-events-panel-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LongPressDirective,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class BabyEventsPanelItemComponent {
  private babyEventsService = inject(BabyEventsService);
  private sessionStore = inject(SessionStore);
  private notificationService = inject(NotificationService);

  /** Guards a rapid double tap from writing the same event twice. */
  private saving = false;

  private readonly menuTrigger = viewChild.required(MatMenuTrigger);

  public babyEventCategory = input.required<BabyEventCategoryView>();
  public activeCategoryId = input<string | null>(null);
  public filter = output<BabyEventCategory>();

  public readonly strings = BabyEventsPanelItemStrings;

  public readonly comments = computed(
    () => this.babyEventCategory().favorite.commonComments ?? [],
  );

  public readonly isFiltered = computed(
    () => this.activeCategoryId() === this.babyEventCategory().category.id,
  );

  // Resolved here rather than branched in the template: a control-flow block
  // around the icon would stop MatMenuItem projecting it into its icon slot.
  public readonly filterIcon = computed(() =>
    this.isFiltered() ? 'filter_none' : 'filter',
  );

  public readonly filterLabel = computed(() =>
    this.isFiltered() ? this.strings.UNFILTER : this.strings.FILTER,
  );

  /** A plain tap saves with no comment; the menu passes the chosen one. */
  public async addBabyEvent(comment: string): Promise<void> {
    if (this.saving) return;
    this.saving = true;

    const newEvent: BabyEvent = {
      uid: 'new',
      category: this.babyEventCategory().category,
      comment,
      time: new Date(),
      createdBy: this.sessionStore.user().name,
      lastEditedBy: null,
    };

    try {
      await this.babyEventsService.addEvent(newEvent);
    } catch (error) {
      this.notificationService.error(NotificationStrings.ADD_EVENT_FAILED);
    } finally {
      this.saving = false;
    }
  }

  public openMenu(): void {
    const trigger = this.menuTrigger();
    if (!trigger.menuOpen) trigger.openMenu();
  }

  public filterEvent(): void {
    this.filter.emit(this.babyEventCategory().category);
  }
}
