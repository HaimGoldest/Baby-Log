import { DateUtils } from '../utils/date-utils';
import { BabyActionCategoryModel } from './baby-action-category.model';

export class BabyActionDataModel {
  constructor(
    public category: BabyActionCategoryModel,
    public description: string,
    public creationTime: Date
  ) {}

  // Method to convert instance to JS object
  public toJsObject() {
    return {
      category: this.category.toJsObject(),
      description: this.description,
      creationTime: DateUtils.convertDateToString(this.creationTime),
    };
  }
}
