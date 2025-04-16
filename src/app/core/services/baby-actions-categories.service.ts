import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BabyActionCategoryModel } from '../../models/baby-action-category.model';

@Injectable({
  providedIn: 'root',
})
export class BabyActionCategoriesService {
  babyActionsCategoriesChanged = new Subject<BabyActionCategoryModel[]>();

  private babyActionsCategories: BabyActionCategoryModel[] = [
    new BabyActionCategoryModel(
      'Bottle',
      '',
      '../../assets/images/icons8-baby-bottle-96.png',
      true,
      false
    ),
    new BabyActionCategoryModel(
      'Breastfeeding',
      '',
      '../../assets/images/icons8-breastfeeding-96.png',
      true,
      false
    ),
    new BabyActionCategoryModel(
      'Breast Pump',
      '',
      '../../assets/images/icons8-breast-pump-96.png',
      true,
      false
    ),
    new BabyActionCategoryModel(
      'Diaper',
      '',
      '../../assets/images/icons8-diaper-96.png',
      true,
      false
    ),
    new BabyActionCategoryModel(
      'Poo',
      '',
      '../../assets/images/icons8-pile-of-poo-3d-fluency-96.png',
      true,
      false
    ),
    new BabyActionCategoryModel(
      'Shower',
      '',
      '../../assets/images/icons8-shower-96.png',
      true,
      false
    ),
    new BabyActionCategoryModel(
      'Awake',
      '',
      '../../assets/images/icons8-sun-96.png',
      true,
      false
    ),
    new BabyActionCategoryModel(
      'Sleep',
      '',
      '../../assets/images/icons8-moon-96.png',
      true,
      false
    ),
    new BabyActionCategoryModel(
      'Fever',
      '',
      '../../assets/images/icons8-thermometer-96.png',
      true,
      false
    ),
    new BabyActionCategoryModel(
      'Medication',
      '',
      '../../assets/images/icons8-pill-96.png',
      true,
      false
    ),
    new BabyActionCategoryModel(
      'Vomit',
      '',
      '../../assets/images/icons8-face-vomiting-96.png',
      true,
      false
    ),
    new BabyActionCategoryModel(
      'Vaccine',
      '',
      '../../assets/images/icons8-syringe-96.png',
      false,
      false
    ),
    new BabyActionCategoryModel(
      'Notes',
      '',
      '../../assets/images/icons8-task-96.png',
      true,
      false
    ),
  ];

  getCategories(): BabyActionCategoryModel[] {
    return this.babyActionsCategories.slice();
  }

  updateCategories(newCategories: BabyActionCategoryModel[]): void {
    this.babyActionsCategories = newCategories.map(
      (obj) =>
        new BabyActionCategoryModel(
          obj.name,
          obj.defaultDescription,
          obj.imagePath,
          obj.isCategoryEnable,
          obj.isDefaultDescriptionEnable
        )
    );
    this.invokeBabyActionsCategoriesChanged();
  }

  invokeBabyActionsCategoriesChanged(): void {
    this.babyActionsCategoriesChanged.next(this.babyActionsCategories.slice());
  }
}
