import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BabyMeasurementsService } from '../services/baby-measurements.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BabyMeasurement } from '../../../models/baby.model';
import { GrowthTrackingListComponent } from '../components/growth-tracking-info/growth-tracking-list.component';

@Component({
  selector: 'app-growth-tracking',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    GrowthTrackingListComponent,
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
      date: data.date,
      height: data.height,
      weight: data.weight,
      headMeasure: data.headMeasure,
    };

    try {
      await this.babyMeasurementsService.addMeasurement(measurement);
    } catch (error) {
      this.showError('Error adding measurement. Please try again later.');
    }
  }

  private showError(message: string) {
    // todo - implement generic error dialog
  }
}
