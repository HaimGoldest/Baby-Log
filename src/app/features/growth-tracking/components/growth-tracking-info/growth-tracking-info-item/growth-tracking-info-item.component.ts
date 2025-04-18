import { Component, Input, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BabyMeasurementsService } from '../../../services/baby-measurements.service';
import { BabyMeasurementModel } from '../../../../../models/baby-measurement.model';

@Component({
  selector: 'app-growth-tracking-info-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './growth-tracking-info-item.component.html',
  styleUrl: './growth-tracking-info-item.component.scss',
})
export class GrowthTrackingInfoItemComponent implements OnDestroy {
  @Input() measurement: BabyMeasurementModel;
  private destroy$ = new Subject<void>();

  public constructor(
    private babyMeasurementsService: BabyMeasurementsService,
    private dialog: MatDialog
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onDelete() {
    if (this.measurement) {
      this.babyMeasurementsService.deleteBabyAction(this.measurement);
    }
  }

  public async openEditMeasurementForm(): Promise<void> {
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
      .subscribe((result: BabyMeasurementModel) => {
        if (result) {
          this.updateMeasurement(result);
        }
      });
  }

  private updateMeasurement(data: BabyMeasurementModel) {
    const editedMeasurement = new BabyMeasurementModel(
      data.date,
      data.height,
      data.weight,
      data.headMeasure
    );
    this.babyMeasurementsService.updateMeasurement(
      this.measurement,
      editedMeasurement
    );
  }
}
