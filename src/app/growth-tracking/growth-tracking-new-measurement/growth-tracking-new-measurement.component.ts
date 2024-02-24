import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BabyMeasurementModel } from '../../models/baby-measurement.model';
import { BabyMeasurementsService } from '../../services/baby-measurements.service';

@Component({
  selector: 'app-growth-tracking-new-measurement',
  templateUrl: './growth-tracking-new-measurement.component.html',
  styleUrl: './growth-tracking-new-measurement.component.css',
})
export class GrowthTrackingNewMeasurementComponent {
  @ViewChild('f', { static: true }) form: NgForm;

  constructor(private babyMeasurementsService: BabyMeasurementsService) {}

  onSubmit(form: NgForm) {
    const value = form.value;
    const measurement = new BabyMeasurementModel(
      new Date(),
      value.height,
      value.weight,
      value.headMeasure
    );
    this.babyMeasurementsService.addMeasurement(measurement);
    this.onClear();
  }

  onClear() {
    this.form.reset();
  }
}
