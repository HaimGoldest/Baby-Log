import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BabyMeasurementsService } from '../services/baby-measurements.service';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { BabyMeasurement } from '../../../models/baby.model';
import { GrowthTrackingListComponent } from '../components/growth-tracking-list/growth-tracking-list.component';
import { NotificationService } from '../../../core/services/notification.service';
import NotificationStrings from '../../../shared/strings/notification.strings';

@Component({
  selector: 'app-growth-tracking',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    GrowthTrackingListComponent
],
  templateUrl: './growth-tracking.page.html',
  styleUrl: './growth-tracking.page.scss',
})
export class GrowthTrackingPage implements OnDestroy {
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  public constructor(
    private babyMeasurementsService: BabyMeasurementsService,
    private dialog: MatDialog
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public async openAddMeasurementForm(): Promise<void> {
    const { GrowthTrackingFormComponent } = await import(
      '../components/growth-tracking-form/growth-tracking-form.component'
    );

    const dialogRef = this.dialog.open(GrowthTrackingFormComponent, {
      width: '90vw',
      maxWidth: '300px',
      data: null,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: BabyMeasurement) => {
        if (result) {
          this.addMeasurement(result);
        }
      });
  }

  private async addMeasurement(data: BabyMeasurement): Promise<void> {
    const measurement: BabyMeasurement = {
      uid: 'new',
      date: new Date(data.date),
      height: data.height,
      weight: data.weight,
      headMeasure: data.headMeasure,
    };

    try {
      await this.babyMeasurementsService.addMeasurement(measurement);
    } catch (error) {
      this.notificationService.error(
        NotificationStrings.ADD_MEASUREMENT_FAILED
      );
    }
  }
}
