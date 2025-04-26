import { Component, Input, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BabyMeasurementsService } from '../../../services/baby-measurements.service';
import { BabyMeasurement } from '../../../../../models/baby.model';

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
  @Input({ required: true }) measurement!: BabyMeasurement;
  private destroy$ = new Subject<void>();

  public constructor(
    private babyMeasurementsService: BabyMeasurementsService,
    private dialog: MatDialog
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public async onDelete() {
    try {
      await this.babyMeasurementsService.deleteMeasurement(this.measurement);
    } catch (error) {
      this.showError('Error deleting measurement');
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
      .subscribe((result: BabyMeasurement) => {
        if (result) {
          this.updateMeasurement(result);
        }
      });
  }

  private async updateMeasurement(data: BabyMeasurement) {
    const editedMeasurement: BabyMeasurement = {
      ...this.measurement,
      date: data.date,
      height: data.height,
      weight: data.weight,
      headMeasure: data.headMeasure,
    };

    try {
      await this.babyMeasurementsService.updateMeasurement(editedMeasurement);
    } catch (error) {
      this.showError('Error updating measurement');
    }
  }

  private showError(message: string) {
    // todo - implement generic error dialog
  }
}
