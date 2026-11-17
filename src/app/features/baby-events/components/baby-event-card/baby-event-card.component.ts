import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BabyEventsService } from '../../services/baby-events.service';
import { BabyEvent, BabyEventCategory } from '../../../../models/baby.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SessionStore } from '../../../../core/stores/session/session.store';
import { NotificationService } from '../../../../core/services/notification.service';
import { OfflineError } from '../../../../core/firebase/fire-store-helper.service';
import NotificationStrings from '../../../../shared/strings/notification.strings';
import { BusyOverlayComponent } from '../../../../shared/components/busy-overlay/busy-overlay.component';
import { SyncPendingIconComponent } from '../../../../shared/components/sync-pending-icon/sync-pending-icon.component';
import { CategoryIconComponent } from '../../../../shared/components/category-icon/category-icon.component';
import {
  CategoryColorId,
  resolveCategoryColor,
} from '../../../../core/theme/category-colors';
import BabyEventCardStrings from './baby-event-card.strings';

/**
 * Height of one slot in the events feed: the card plus the gap beneath it.
 *
 * The feed's `cdk-virtual-scroll-viewport` positions items by exactly this
 * value, and the card's host height is bound to it, so it is the single place
 * to change the slot. The card must never grow with its content: every row in
 * it is one line or a fixed-size box, except the note, which is clamped to two
 * lines. The budget inside the 150px card: 2px border, 22px padding, 48px
 * header, 12px plus two 20px note lines, 16px attribution, leaving 10px spare.
 */
export const BABY_EVENT_CARD_ITEM_SIZE = 158;

@Component({
  selector: 'app-baby-event-card',
  templateUrl: './baby-event-card.component.html',
  styleUrls: ['./baby-event-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    '[style.height.px]': 'itemSize',
  },
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    BusyOverlayComponent,
    CategoryIconComponent,
    SyncPendingIconComponent,
  ],
})
export class BabyEventCardComponent {
  private babyEventsService = inject(BabyEventsService);
  private sessionStore = inject(SessionStore);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  public strings = BabyEventCardStrings;

  protected readonly itemSize = BABY_EVENT_CARD_ITEM_SIZE;

  public readonly event = input.required<BabyEvent>();
  public readonly filterMode = input.required<boolean>();
  public readonly filter = output<BabyEventCategory>();
  public readonly unfilter = output<void>();

  /**
   * Read from the service by uid rather than kept here: the virtual scroll
   * recycles this component for other events, and a moved event can leave the
   * rendered range mid-write.
   */
  public readonly pendingKind = computed(() =>
    this.babyEventsService.pendingKind(this.event().uid),
  );

  /** The pill's colour, matching the category icon beside it. */
  public readonly categoryColor = computed<CategoryColorId>(() =>
    resolveCategoryColor(
      this.sessionStore.categoryColors(),
      this.event().category.id,
    ),
  );

  /** Who created and last edited the event, joined onto one line. */
  public readonly attribution = computed(() => {
    const { createdBy, lastEditedBy } = this.event();

    if (createdBy === lastEditedBy) {
      return `${this.strings.CREATED_AND_EDITED_BY}: ${createdBy}`;
    }

    const created = `${this.strings.CREATED_BY}: ${createdBy}`;
    return lastEditedBy
      ? `${created} · ${this.strings.EDITED_BY}: ${lastEditedBy}`
      : created;
  });

  public async onEdit(event?: MouseEvent): Promise<void> {
    if (event) event.preventDefault();
    if (this.pendingKind()) return;

    // Captured before anything async: the virtual scroll can recycle this
    // component for another event while the dialog is open, and the edit
    // must still land on the event it was opened for.
    const babyEvent = this.event();

    const { BabyEventFormComponent } = await import(
      '../../components/baby-event-form/baby-event-form.component'
    );

    const dialogRef = this.dialog.open(BabyEventFormComponent, {
      width: '90vw',
      maxWidth: '300px',
      data: babyEvent,
      // Focus the dialog itself, not its first field, so opening it neither
      // raises the mobile keyboard nor picks a field the user didn't tap.
      autoFocus: 'dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: BabyEvent) => {
        if (result) {
          this.updateEvent(babyEvent, result);
        }
      });
  }

  private async updateEvent(
    babyEvent: BabyEvent,
    data: BabyEvent
  ): Promise<void> {
    const editedEvent: BabyEvent = {
      ...babyEvent,
      ...data,
      time: new Date(data.time),
      lastEditedBy: this.sessionStore.user().name,
    };

    try {
      await this.babyEventsService.updateEvent(editedEvent);
    } catch (error) {
      this.notificationService.error(
        error instanceof OfflineError
          ? NotificationStrings.CONNECTION_REQUIRED
          : NotificationStrings.UPDATE_EVENT_FAILED
      );
    }
  }

  public async onDelete(): Promise<void> {
    if (this.pendingKind()) return;

    // todo : add confirmation dialog
    try {
      await this.babyEventsService.deleteEvent(this.event());
    } catch (error) {
      this.notificationService.error(
        error instanceof OfflineError
          ? NotificationStrings.CONNECTION_REQUIRED
          : NotificationStrings.DELETE_EVENT_FAILED
      );
    }
  }

  public onFilter(): void {
    this.filter.emit(this.event().category);
  }

  public onUnfilter(): void {
    this.unfilter.emit();
  }
}
