import { BabyActionDataModel } from './baby-action-data.model';

export class BabyActionCategoryModel {
  constructor(
    public name: string,
    public isEnable: boolean,
    public data: BabyActionDataModel
  ) {}
}
