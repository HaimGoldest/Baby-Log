import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BabyMeasurementModel } from '../../../models/baby-measurement.model';

@Component({
  selector: 'app-growth-tracking-info-item',
  templateUrl: './growth-tracking-info-item.component.html',
  styleUrl: './growth-tracking-info-item.component.css'
})
export class GrowthTrackingInfoItemComponent {
  @Input() measurement: BabyMeasurementModel | undefined;
  @Input() index: number | undefined;
}
