import { Injectable } from '@angular/core';
import { Subject, Subscription, map } from 'rxjs';
import { BabyActionDataModel } from '../models/baby-action-data.model';
import { BabiesService } from './babies.service';

@Injectable({
  providedIn: 'root',
})
export class BabyActionsDataService {
  public babyActionsDataChanged = new Subject<BabyActionDataModel[]>();
  babyDataChanged: Subscription;
  babyActionsData: BabyActionDataModel[] = [];

  constructor(private babiesService: BabiesService) {
    this.babyDataChanged = this.babiesService.babyData.subscribe((baby) => {
      if (baby && baby.actionsData) {
        this.setBabyActionsData(baby.actionsData);
      }
    });
  }

  getBabyActions() {
    return this.babyActionsData.slice();
  }

  async addBabyAction(babyActionData: BabyActionDataModel) {
    await this.babiesService.addBabyActionDataToDb(babyActionData);
  }

  deleteBabyAction(babyActionData: BabyActionDataModel) {
    this.babiesService.deleteBabyActionDataFromDb(babyActionData);
  }

  updatedBabyAction(babyActionData: BabyActionDataModel) {
    console.warn(babyActionData.creationTime);
    console.warn(babyActionData.creationTime.getTime());
    this.babiesService.updateBabyActionDataInDb(babyActionData);
  }

  private setBabyActionsData(newBabyActionsData: BabyActionDataModel[]): void {
    // Sort the newBabyActionsData array by creationTime in descending order
    newBabyActionsData.sort(
      (a, b) => b.creationTime.getTime() - a.creationTime.getTime()
    );

    this.babyActionsData = newBabyActionsData;
    this.babyActionsDataChanged.next(this.babyActionsData.slice());
  }
}
