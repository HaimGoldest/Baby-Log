import { Component, OnDestroy } from '@angular/core';
import { BabyMeasurementModel } from '../../../models/baby-measurement.model';
import { GrowthTrackingFormComponent } from './growth-tracking-form/growth-tracking-form.component';
import { Subject, takeUntil } from 'rxjs';
import { BabyMeasurementsService } from '../../../services/baby-measurements.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-growth-tracking',
  templateUrl: './growth-tracking.component.html',
  styleUrl: './growth-tracking.component.scss',
})
export class GrowthTrackingComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private babyMeasurementsService: BabyMeasurementsService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Opens the measurement form dialog for adding new measurement.
   */
  public openMeasurementForm(): void {
    const dialogRef = this.dialog.open(GrowthTrackingFormComponent, {
      width: '90vw',
      maxWidth: '300px',
      data: null,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: BabyMeasurementModel) => {
        if (result) {
          this.addMeasurement(result);
        }
      });
  }

  private addMeasurement(data: BabyMeasurementModel) {
    const measurement = new BabyMeasurementModel(
      new Date(),
      data.height,
      data.weight,
      data.headMeasure
    );
    this.babyMeasurementsService.addMeasurement(measurement);
  }
}
