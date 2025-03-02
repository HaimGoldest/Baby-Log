import { Component, Input } from '@angular/core';
import { BabyMeasurementModel } from '../../../models/baby-measurement.model';
import { BabyMeasurementsService } from '../../../services/baby-measurements.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-growth-tracking-info-item',
  templateUrl: './growth-tracking-info-item.component.html',
  styleUrl: './growth-tracking-info-item.component.scss',
})
export class GrowthTrackingInfoItemComponent {
  @Input() measurement: BabyMeasurementModel;
  @Input() index: number | undefined;

  constructor(
    private babyMeasurementsService: BabyMeasurementsService,
    private router: Router
  ) {}

  onDelete() {
    this.babyMeasurementsService.deleteBabyAction(this.measurement);
  }

  onUpdate() {
    this.router.navigate(['/growth-tracking-update'], {
      state: { measurement: this.measurement },
    });
  }
}
