import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BabyMeasurementsService } from '../services/baby-measurements.service';
import { BabyMeasurementModel } from '../../../models/baby-measurement.model';
import { GrowthTrackingFormComponent } from '../components/growth-tracking-form/growth-tracking-form.component';
import { GrowthTrackingInfoComponent } from '../components/growth-tracking-info/growth-tracking-info.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-growth-tracking',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    GrowthTrackingInfoComponent,
  ],
  templateUrl: './growth-tracking.page.html',
  styleUrl: './growth-tracking.page.scss',
})
export class GrowthTrackingPage implements OnDestroy {
  private destroy$ = new Subject<void>();

  public constructor(
    private babyMeasurementsService: BabyMeasurementsService,
    private dialog: MatDialog
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public openAddMeasurementForm(): void {
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
      data.date,
      data.height,
      data.weight,
      data.headMeasure
    );
    this.babyMeasurementsService.addMeasurement(measurement);
  }
}
