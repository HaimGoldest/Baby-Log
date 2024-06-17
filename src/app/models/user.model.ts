import { BabyActionCategoryModel } from './baby-action-category.model';

export class UserModel {
  constructor(
    public uid: string,
    public name: string,
    public babyActionsPref: BabyActionCategoryModel[],
    public babiesUids: string[]
  ) {}

  // Method to convert instance to JS object
  public toJsObject() {
    return {
      uid: this.uid,
      name: this.name,
      babyActionsPref: this.babyActionsPref.map((action) =>
        action.toJsObject()
      ),
      babiesUids: this.babiesUids,
    };
  }
}