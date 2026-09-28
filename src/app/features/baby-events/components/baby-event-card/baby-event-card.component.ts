import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { BabyEventsService } from '../../services/baby-events.service';
import { BabyEvent, BabyEventCategory } from '../../../../models/baby.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SessionStore } from '../../../../core/stores/session/session.store';
import { NotificationService } from '../../../../core/services/notification.service';
import { OfflineError } from '../../../../core/firebase/fire-store-helper.service';
import { PendingKind } from '../../../../core/firebase/pending-writes';
import NotificationStrings from '../../../../shared/strings/notification.strings';
import { BusyOverlayComponent } from '../../../../shared/components/busy-overlay/busy-overlay.component';
import { SyncPendingIconComponent } from '../../../../shared/components/sync-pending-icon/sync-pending-icon.component';
import BabyEventCardStrings from './baby-event-card.strings';

@Component({
  selector: 'app-baby-event-card',
  templateUrl: './baby-event-card.component.html',
  styleUrls: ['./baby-event-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    BusyOverlayComponent,
    SyncPendingIconComponent,
  ],
})
export class BabyEventCardComponent {
  private babyEventsService = inject(BabyEventsService);
  private sessionStore = inject(SessionStore);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  public strings = BabyEventCardStrings;

  @Input({ required: true }) public event: BabyEvent;
  @Input({ required: true }) public filterMode: boolean;
  @Output() filter = new EventEmitter<BabyEventCategory>();
  @Output() unfilter = new EventEmitter<void>();

  /**
   * Read from the service by uid rather than kept here: the virtual scroll
   * recycles this component for other events, and a moved event can leave the
   * rendered range mid-write.
   */
  public pendingKind(): PendingKind | null {
    return this.babyEventsService.pendingKind(this.event.uid);
  }

  public async onEdit(event?: MouseEvent): Promise<void> {
    if (event) event.preventDefault();
    if (this.pendingKind()) return;

    const { BabyEventFormComponent } = await import(
      '../../components/baby-event-form/baby-event-form.component'
    );

    const dialogRef = this.dialog.open(BabyEventFormComponent, {
      width: '90vw',
      maxWidth: '300px',
      data: this.event,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: BabyEvent) => {
        if (result) {
          this.updateEvent(result);
        }
      });
  }

  private async updateEvent(data: BabyEvent): Promise<void> {
    const editedEvent: BabyEvent = {
      ...this.event,
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
      await this.babyEventsService.deleteEvent(this.event);
    } catch (error) {
      this.notificationService.error(
        error instanceof OfflineError
          ? NotificationStrings.CONNECTION_REQUIRED
          : NotificationStrings.DELETE_EVENT_FAILED
      );
    }
  }

  public onFilter(): void {
    this.filter.emit(this.event.category);
  }

  public onUnfilter(): void {
    this.unfilter.emit();
  }
}
