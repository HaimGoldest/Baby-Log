import { BabyActionCategoryModel } from './baby-action-category.model';

export class BabyActionDataModel {
  constructor(
    public category: BabyActionCategoryModel,
    public description: string,
    public creationTime: Date
  ) {}
}
