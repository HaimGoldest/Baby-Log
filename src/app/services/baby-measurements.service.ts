import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { BabyMeasurementModel } from '../models/baby-measurement.model';
import { BabiesService } from './babies.service';

@Injectable({
  providedIn: 'root',
})
export class BabyMeasurementsService {
  measurementsChanged = new Subject<BabyMeasurementModel[]>();
  babyDataChanged: Subscription;
  measurements: BabyMeasurementModel[] = [];

  constructor(private babiesService: BabiesService) {
    this.babyDataChanged = this.babiesService.babyData.subscribe((baby) => {
      if (baby && baby.measurementsData) {
        this.setMeasurementsData(baby.measurementsData);
      }
    });
  }

  getMeasurements() {
    return this.measurements.slice();
  }

  addMeasurement(newMeasurement: BabyMeasurementModel) {
    this.babiesService.addMeasurementDataToDb(newMeasurement);
  }

  updateMeasurement(
    oldMeasurement: BabyMeasurementModel,
    updatedMeasurement: BabyMeasurementModel
  ) {
    this.babiesService.updateMeasurementDataInDb(
      oldMeasurement,
      updatedMeasurement
    );
  }

  deleteBabyAction(measurement: BabyMeasurementModel) {
    this.babiesService.deleteMeasurementDataFromDb(measurement);
  }

  private setMeasurementsData(
    newMeasurementsData: BabyMeasurementModel[]
  ): void {
    // Sort the newMeasurementsData array by date in descending order
    newMeasurementsData.sort((a, b) => b.date.getTime() - a.date.getTime());

    this.measurements = newMeasurementsData;
    this.measurementsChanged.next(this.measurements.slice());
  }
}
