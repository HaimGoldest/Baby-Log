import { Component, computed } from '@angular/core';
import { GrowthTrackingInfoItemComponent } from './growth-tracking-info-item/growth-tracking-info-item.component';
import { BabyMeasurementsService } from '../../services/baby-measurements.service';

@Component({
  selector: 'app-growth-tracking-info',
  standalone: true,
  imports: [GrowthTrackingInfoItemComponent],
  templateUrl: './growth-tracking-info.component.html',
  styleUrl: './growth-tracking-info.component.scss',
})
export class GrowthTrackingInfoComponent {
  public readonly measurements = computed(() =>
    this.babyMeasurementsService.measurements()
  );

  constructor(private babyMeasurementsService: BabyMeasurementsService) {}
}
