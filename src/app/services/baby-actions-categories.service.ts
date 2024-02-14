import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BabyActionCategoryModel } from '../models/baby-action-category.model';
import { BabyActionDataModel } from '../models/baby-action-data.model';

@Injectable({
  providedIn: 'root',
})
export class BabyActionCategoriesService {
  babyActionsCategoriesChanged = new Subject<BabyActionCategoryModel[]>();

  babyActionsCategories: BabyActionCategoryModel[] = [
    new BabyActionCategoryModel(
      'Bottle',
      true,
      true,
      new BabyActionDataModel(
        'Bottle',
        null,
        '',
        '../../assets/images/icons8-baby-bottle-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Poo',
      true,
      true,
      new BabyActionDataModel(
        'Poo',
        null,
        '',
        '../../assets/images/icons8-pile-of-poo-3d-fluency-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Shower',
      true,
      true,
      new BabyActionDataModel(
        'Shower',
        null,
        '',
        '../../assets/images/icons8-shower-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Awake',
      true,
      true,
      new BabyActionDataModel(
        'Awake',
        null,
        '',
        '../../assets/images/icons8-sun-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Sleep',
      true,
      true,
      new BabyActionDataModel(
        'Sleep',
        null,
        '',
        '../../assets/images/icons8-moon-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Fever',
      true,
      true,
      new BabyActionDataModel(
        'Fever',
        null,
        '',
        '../../assets/images/icons8-thermometer-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Medication',
      true,
      true,
      new BabyActionDataModel(
        'Medication',
        null,
        '',
        '../../assets/images/icons8-pill-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Vomit',
      true,
      true,
      new BabyActionDataModel(
        'Vomit',
        null,
        '',
        '../../assets/images/icons8-face-vomiting-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Vaccine',
      false,
      false,
      new BabyActionDataModel(
        'Vaccine',
        null,
        '',
        '../../assets/images/icons8-syringe-96.png'
      )
    ),
  ];

  constructor() {}

  getCategories() {
    return this.babyActionsCategories.slice();
  }

  getCategory(index: number) {
    return this.babyActionsCategories[index];
  }

  addCategory(babyAction: BabyActionCategoryModel) {
    this.babyActionsCategories.unshift(babyAction);
    this.invokeBabyActionsCategoriesChanged();
  }

  // deleteCategory(index: number) {
  //   this.babyActionsCategories.splice(index, 1);
  //   this.invokeBabyActionsCategoriesChanged();
  // }

  invokeBabyActionsCategoriesChanged() {
    this.babyActionsCategoriesChanged.next(this.babyActionsCategories.slice());
  }
}
