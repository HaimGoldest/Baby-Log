import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { BabyMeasurementModel } from '../../../../../../models/baby-measurement.model';
import { BabyMeasurementsService } from '../../../../../../services/baby-measurements.service';

@Component({
  selector: 'app-growth-tracking-info-item-update',
  templateUrl: './growth-tracking-info-item-update.component.html',
  styleUrls: ['./growth-tracking-info-item-update.component.scss'],
})
export class GrowthTrackingInfoItemUpdateComponent implements OnInit {
  oldMeasurement: BabyMeasurementModel;
  updetedMeasurement: BabyMeasurementModel;
  dateToDisplay: string;
  showDatePicker: boolean = false;

  constructor(
    private babyMeasurementsService: BabyMeasurementsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const stateMeasurement = history.state.measurement;
    this.oldMeasurement = new BabyMeasurementModel(
      new Date(stateMeasurement.date),
      stateMeasurement.height,
      stateMeasurement.weight,
      stateMeasurement.headMeasure
    );

    this.updetedMeasurement = new BabyMeasurementModel(
      new Date(this.oldMeasurement.date),
      this.oldMeasurement.height,
      this.oldMeasurement.weight,
      this.oldMeasurement.headMeasure
    );

    this.dateToDisplay = this.formatDateToDisplay(this.oldMeasurement.date);
  }

  public onUpdateMeasurement(): void {
    this.updetedMeasurement.date = new Date(this.dateToDisplay);
    this.babyMeasurementsService.updateMeasurement(
      this.oldMeasurement,
      this.updetedMeasurement
    );
    this.router.navigate(['/growth-tracking']);
  }

  public onCancel(): void {
    this.router.navigate(['/growth-tracking']);
  }

  public onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.dateToDisplay = this.formatDateToDisplay(event.value!);
  }

  public toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  private formatDateToDisplay(date: Date | null): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return date
      ? date.toLocaleDateString('en-GB', options).replace(/ /g, '-')
      : '';
  }
}
