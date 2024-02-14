import { BabyActionDataModel } from './baby-action-data.model';

export class BabyActionCategoryModel {
  constructor(
    public name: string,
    public isCategoryEnable: boolean,
    public isDefaultDesciptionEnable: boolean,
    public data: BabyActionDataModel
  ) {}
}
