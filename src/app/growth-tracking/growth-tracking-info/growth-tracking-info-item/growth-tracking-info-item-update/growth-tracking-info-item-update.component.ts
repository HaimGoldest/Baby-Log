import { Component, OnInit } from '@angular/core';
import { BabyMeasurementModel } from '../../../../models/baby-measurement.model';
import { BabyMeasurementsService } from '../../../../services/baby-measurements.service';

@Component({
  selector: 'app-growth-tracking-info-item-update',
  templateUrl: './growth-tracking-info-item-update.component.html',
  styleUrls: ['./growth-tracking-info-item-update.component.css'],
})
export class GrowthTrackingInfoItemUpdateComponent implements OnInit {
  oldMeasurement: BabyMeasurementModel;
  updetedMeasurement: BabyMeasurementModel;

  constructor(private babyMeasurementsService: BabyMeasurementsService) {}

  ngOnInit(): void {
    const stateMeasurement = history.state.measurement;
    this.oldMeasurement = new BabyMeasurementModel(
      new Date(stateMeasurement.date),
      stateMeasurement.height,
      stateMeasurement.weight,
      stateMeasurement.headMeasure
    );

    // Initialize newMeasurement with formatted date
    this.updetedMeasurement = new BabyMeasurementModel(
      new Date(this.oldMeasurement.date),
      this.oldMeasurement.height,
      this.oldMeasurement.weight,
      this.oldMeasurement.headMeasure
    );
  }

  public onUpdateMeasurement(): void {
    this.convertDateFromFormattedStringToDate();
    this.babyMeasurementsService.updateMeasurement(
      this.oldMeasurement,
      this.updetedMeasurement
    );
  }

  private convertDateFromFormattedStringToDate() {
    this.updetedMeasurement.date = new Date(this.updetedMeasurement.date);
  }

  // Utility function to format the date
  public formatDateToDisplay(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
  }

  public parseDateFromDisplay(dateString: string): Date {
    return new Date(dateString);
  }
}
