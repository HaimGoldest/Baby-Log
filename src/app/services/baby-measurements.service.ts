import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BabyMeasurementModel } from '../models/baby-measurement.model';

@Injectable({
  providedIn: 'root'
})
export class BabyMeasurementsService {
  measurementsChanged = new Subject<BabyMeasurementModel[]>();
  measurements: BabyMeasurementModel[] = []

  constructor() { }

  addMeasurement(babyActionData: BabyMeasurementModel) {
    // todo - sort list by date
    this.measurements.unshift(babyActionData);
    this.invokeMeasurementsChanged();
  }

  getMeasurements() {
    return this.measurements.slice();
  }

  invokeMeasurementsChanged() {
    this.measurementsChanged.next(this.measurements.slice());
  }
}
