import { Component, Input } from '@angular/core';
import { BabyMeasurementModel } from '../../../models/baby-measurement.model';
import { BabyMeasurementsService } from '../../../services/baby-measurements.service';

@Component({
  selector: 'app-growth-tracking-info-item',
  templateUrl: './growth-tracking-info-item.component.html',
  styleUrl: './growth-tracking-info-item.component.css',
})
export class GrowthTrackingInfoItemComponent {
  @Input() measurement: BabyMeasurementModel;
  @Input() index: number | undefined;

  constructor(private babyMeasurementsService: BabyMeasurementsService) {}

  onDelete() {
    this.babyMeasurementsService.deleteBabyAction(this.measurement);
  }

  onUpdate() {
    console.warn('onUpdate method not implemented yet!');
  }
}
