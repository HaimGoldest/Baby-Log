import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BabyActionModel } from '../models/bayby-action.model';

@Injectable({
  providedIn: 'root',
})
export class BabyActionsService {
  babyActionsChanged = new Subject<BabyActionModel[]>();

  babyActions: BabyActionModel[] = [
    new BabyActionModel(
      'Bottle',
      new Date(),
      'אכל חצי בקבוק',
      '../../assets/images/icons8-baby-bottle-96.png'
    ),
  ];

  constructor() {}

  getBabyActions() {
    return this.babyActions.slice();
  }

  getBabyAction(index: number) {
    return this.babyActions[index];
  }

  addBabyAction(babyAction: BabyActionModel) {
    this.babyActions.unshift(babyAction);
    this.invokeBabyActionsChanged();
  }

  deleteBabyAction(index: number) {
    this.babyActions.splice(index, 1);
    this.invokeBabyActionsChanged();
  }

  invokeBabyActionsChanged() {
    this.babyActionsChanged.next(this.babyActions.slice());
  }
}
