import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BabyMeasurementsService } from '../../../services/baby-measurements.service';
import { BabyMeasurement } from '../../../../../models/baby.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { OfflineError } from '../../../../../core/firebase/fire-store-helper.service';
import { PendingKind } from '../../../../../core/firebase/pending-writes';
import NotificationStrings from '../../../../../shared/strings/notification.strings';
import { BusyOverlayComponent } from '../../../../../shared/components/busy-overlay/busy-overlay.component';
import { SyncPendingIconComponent } from '../../../../../shared/components/sync-pending-icon/sync-pending-icon.component';
import GrowthTrackingListItemStrings from './growth-tracking-list-item.strings';

@Component({
  selector: 'app-growth-tracking-list-item',
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
  templateUrl: './growth-tracking-list-item.component.html',
  styleUrl: './growth-tracking-list-item.component.scss',
})
export class GrowthTrackingListItemComponent implements OnDestroy {
  @Input({ required: true }) public measurement!: BabyMeasurement;
  private babyMeasurementsService = inject(BabyMeasurementsService);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  public strings = GrowthTrackingListItemStrings;

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Read from the service by uid rather than kept here, so the state is not
   * lost when the list re-creates this component mid-write.
   */
  public pendingKind(): PendingKind | null {
    return this.babyMeasurementsService.pendingKind(this.measurement.uid);
  }

  public async onDelete(): Promise<void> {
    if (this.pendingKind()) return;

    try {
      await this.babyMeasurementsService.deleteMeasurement(this.measurement);
    } catch (error) {
      this.notificationService.error(
        error instanceof OfflineError
          ? NotificationStrings.CONNECTION_REQUIRED
          : NotificationStrings.DELETE_MEASUREMENT_FAILED
      );
    }
  }

  public async openEditMeasurementForm(): Promise<void> {
    if (this.pendingKind()) return;

    const { GrowthTrackingFormComponent } = await import(
      '../../growth-tracking-form/growth-tracking-form.component'
    );

    const dialogRef = this.dialog.open(GrowthTrackingFormComponent, {
      width: '90vw',
      maxWidth: '300px',
      data: this.measurement,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: BabyMeasurement) => {
        if (result) {
          this.updateMeasurement(result);
        }
      });
  }

  private async updateMeasurement(data: BabyMeasurement): Promise<void> {
    const editedMeasurement: BabyMeasurement = {
      ...this.measurement,
      date: new Date(data.date),
      height: data.height,
      weight: data.weight,
      headMeasure: data.headMeasure,
    };

    try {
      await this.babyMeasurementsService.updateMeasurement(editedMeasurement);
    } catch (error) {
      this.notificationService.error(
        error instanceof OfflineError
          ? NotificationStrings.CONNECTION_REQUIRED
          : NotificationStrings.UPDATE_MEASUREMENT_FAILED
      );
    }
  }
}
