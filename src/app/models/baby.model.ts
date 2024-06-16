import { DateUtils } from '../utils/date-utils';
import { BabyActionDataModel } from './baby-action-data.model';
import { BabyMeasurementModel } from './baby-measurement.model';

export class BabyModel {
  constructor(
    public uid: string,
    public name: string,
    public birthDate: Date,
    public actionsData: BabyActionDataModel[],
    public measurementsData: BabyMeasurementModel[],
    public usersUids: string[]
  ) {}

  // Method to convert instance to JS object
  public toJsObject() {
    return {
      uid: this.uid,
      name: this.name,
      birthDate: DateUtils.convertDateToString(this.birthDate),
      actionsData: this.actionsData.map((action) => action.toJsObject()),
      measurementsData: this.measurementsData.map((measurement) =>
        measurement.toJsObject()
      ),
      usersUids: this.usersUids,
    };
  }
}