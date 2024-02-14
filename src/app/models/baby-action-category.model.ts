import { BabyActionDataModel } from './baby-action-data.model';

export class BabyActionCategoryModel {
  constructor(
    public name: string,
    public defaultDescription : string,
    public imagePath: string,
    public isCategoryEnable: boolean,
    public isDefaultDescriptionEnable: boolean,
  ) {}
}
