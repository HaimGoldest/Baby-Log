import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BabyActionDataModel } from '../models/baby-action-data.model';

@Injectable({
  providedIn: 'root',
})
export class BabyActionsDataService {
  babyActionsDataChanged = new Subject<BabyActionDataModel[]>();

  babyActionsData: BabyActionDataModel[] = [];

  constructor() {}

  getBabyActions() {
    return this.babyActionsData.slice();
  }

  // getBabyAction(index: number) {
  //   return this.babyActionsData[index];
  // }

  addBabyAction(babyActionData: BabyActionDataModel) {
    this.babyActionsData.unshift(babyActionData);
    this.invokeBabyActionsDataChanged();
  }

  // deleteBabyAction(index: number) {
  //   this.babyActionsData.splice(index, 1);
  //   this.invokeBabyActionsDataChanged();
  // }

  invokeBabyActionsDataChanged() {
    this.babyActionsDataChanged.next(this.babyActionsData.slice());
  }
}
