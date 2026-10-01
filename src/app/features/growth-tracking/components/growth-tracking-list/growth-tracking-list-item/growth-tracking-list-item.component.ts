import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class GrowthTrackingListItemComponent {
  public readonly measurement = input.required<BabyMeasurement>();
  private babyMeasurementsService = inject(BabyMeasurementsService);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  public strings = GrowthTrackingListItemStrings;

  /**
   * Read from the service by uid rather than kept here, so the state is not
   * lost when the list re-creates this component mid-write.
   */
  public readonly pendingKind = computed(() =>
    this.babyMeasurementsService.pendingKind(this.measurement().uid),
  );

  public async onDelete(): Promise<void> {
    if (this.pendingKind()) return;

    try {
      await this.babyMeasurementsService.deleteMeasurement(this.measurement());
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

    // Captured before anything async, so the edit lands on the measurement
    // the dialog was opened for even if this component is rebound meanwhile.
    const measurement = this.measurement();

    const { GrowthTrackingFormComponent } = await import(
      '../../growth-tracking-form/growth-tracking-form.component'
    );

    const dialogRef = this.dialog.open(GrowthTrackingFormComponent, {
      width: '90vw',
      maxWidth: '300px',
      data: measurement,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: BabyMeasurement) => {
        if (result) {
          this.updateMeasurement(measurement, result);
        }
      });
  }

  private async updateMeasurement(
    measurement: BabyMeasurement,
    data: BabyMeasurement
  ): Promise<void> {
    const editedMeasurement: BabyMeasurement = {
      ...measurement,
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
