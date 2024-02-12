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
      new BabyActionDataModel(
        'Bottle',
        null,
        'temp..',
        '../../assets/images/icons8-baby-bottle-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Poo',
      true,
      new BabyActionDataModel(
        'Poo',
        null,
        'temp..',
        '../../assets/images/icons8-pile-of-poo-3d-fluency-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Shower',
      true,
      new BabyActionDataModel(
        'Shower',
        null,
        'temp..',
        '../../assets/images/icons8-shower-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Awake',
      true,
      new BabyActionDataModel(
        'Awake',
        null,
        'temp..',
        '../../assets/images/icons8-sun-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Sleep',
      true,
      new BabyActionDataModel(
        'Sleep',
        null,
        'temp..',
        '../../assets/images/icons8-moon-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Fever',
      true,
      new BabyActionDataModel(
        'Fever',
        null,
        'temp..',
        '../../assets/images/icons8-thermometer-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Medication',
      true,
      new BabyActionDataModel(
        'Medication',
        null,
        'temp..',
        '../../assets/images/icons8-pill-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Vomit',
      true,
      new BabyActionDataModel(
        'Vomit',
        null,
        'temp..',
        '../../assets/images/icons8-face-vomiting-96.png'
      )
    ),
    new BabyActionCategoryModel(
      'Vaccine',
      false,
      new BabyActionDataModel(
        'Vaccine',
        null,
        'temp..',
        '../../assets/images/icons8-syringe-96.png'
      )
    ),
  ];

  constructor() {}

  getCategories() {
    return this.babyActionsCategories.slice();
  }

  // getCategory(index: number) {
  //   return this.babyActionsCategories[index];
  // }

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
