export class BabyActionCategoryModel {
  constructor(
    public name: string,
    public defaultDescription: string,
    public imagePath: string,
    public isCategoryEnable: boolean,
    public isDefaultDescriptionEnable: boolean
  ) {}

  // Method to convert instance to JS object
  public toJsObject() {
    return {
      name: this.name,
      defaultDescription: this.defaultDescription,
      imagePath: this.imagePath,
      isCategoryEnable: this.isCategoryEnable,
      isDefaultDescriptionEnable: this.isDefaultDescriptionEnable,
    };
  }
}
