import { DateUtils } from '../utils/date-utils';

export class BabyMeasurementModel {
  constructor(
    public date: Date,
    public height: number,
    public weight: number,
    public headMeasure: number
  ) {}

  // Method to convert instance to JS object
  public toJsObject() {
    return {
      date: DateUtils.convertDateToString(this.date),
      height: this.height,
      weight: this.weight,
      headMeasure: this.headMeasure,
    };
  }
}
