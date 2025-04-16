import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GrowthTrackingInfoItemComponent } from './growth-tracking-info-item/growth-tracking-info-item.component';
import { BabyMeasurementsService } from '../../services/baby-measurements.service';
import { BabyMeasurementModel } from '../../../../models/baby-measurement.model';

@Component({
  selector: 'app-growth-tracking-info',
  standalone: true,
  imports: [GrowthTrackingInfoItemComponent],
  templateUrl: './growth-tracking-info.component.html',
  styleUrl: './growth-tracking-info.component.scss',
})
export class GrowthTrackingInfoComponent implements OnInit, OnDestroy {
  measurements: BabyMeasurementModel[] = [];
  measurementsChanged: Subscription;

  constructor(private babyMeasurementsService: BabyMeasurementsService) {}

  ngOnInit(): void {
    this.measurements = this.babyMeasurementsService.getMeasurements();

    this.measurementsChanged =
      this.babyMeasurementsService.measurementsChanged.subscribe(
        (newMeasurements: BabyMeasurementModel[]) =>
          (this.measurements = newMeasurements)
      );
  }

  ngOnDestroy(): void {
    this.measurementsChanged.unsubscribe;
  }
}
