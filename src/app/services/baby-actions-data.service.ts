import { Injectable } from '@angular/core';
import { Subject, Subscription, map } from 'rxjs';
import { BabyActionDataModel } from '../models/baby-action-data.model';
import { BabiesService } from './babies.service';
import { BabyActionCategoryModel } from '../models/baby-action-category.model';

@Injectable({
  providedIn: 'root',
})
export class BabyActionsDataService {
  public babyActionsDataChanged = new Subject<BabyActionDataModel[]>();
  public FilteredBabyActionsDataChanged = new Subject<BabyActionDataModel[]>();
  babyDataChanged: Subscription;
  babyActionsData: BabyActionDataModel[] = [];

  constructor(private babiesService: BabiesService) {
    this.babyDataChanged = this.babiesService.babyData.subscribe((baby) => {
      if (baby && baby.actionsData) {
        this.setBabyActionsData(baby.actionsData);
      }
    });
  }

  public getBabyActions() {
    return this.babyActionsData.slice();
  }

  public async addBabyAction(babyActionData: BabyActionDataModel) {
    await this.babiesService.addBabyActionDataToDb(babyActionData);
  }

  public deleteBabyAction(babyActionData: BabyActionDataModel) {
    this.babiesService.deleteBabyActionDataFromDb(babyActionData);
  }

  public updatedBabyAction(babyActionData: BabyActionDataModel) {
    console.warn(babyActionData.creationTime);
    console.warn(babyActionData.creationTime.getTime());
    this.babiesService.updateBabyActionDataInDb(babyActionData);
  }

  public filterBabyActionsData(category: BabyActionCategoryModel): void {
    if (category === null) {
      this.FilteredBabyActionsDataChanged.next(this.babyActionsData.slice());
      return;
    }

    let data = this.babyActionsData.filter(
      (x) => x.category.name === category.name
    );
    this.FilteredBabyActionsDataChanged.next(data);
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
