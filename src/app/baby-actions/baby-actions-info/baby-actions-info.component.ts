import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BabyActionDataModel } from '../../models/baby-action-data.model';
import { BabyActionsDataService } from '../../services/baby-actions-data.service';

@Component({
  selector: 'app-baby-actions-info',
  templateUrl: './baby-actions-info.component.html',
  styleUrls: ['./baby-actions-info.component.css'],
})
export class BabyActionsInfoComponent implements OnInit, OnDestroy {
  babyActionsData: BabyActionDataModel[] = [];
  babyActionsDataChanged: Subscription;
  FilteredBabyActionsDataChanged: Subscription;
  filterMode = false;

  constructor(private babyActionDataService: BabyActionsDataService) {}

  public ngOnInit(): void {
    this.babyActionsData = this.babyActionDataService.getBabyActions();

    this.babyActionsDataChanged =
      this.babyActionDataService.babyActionsDataChanged.subscribe(
        (newBabyActions: BabyActionDataModel[]) =>
          (this.babyActionsData = newBabyActions)
      );

    this.FilteredBabyActionsDataChanged =
      this.babyActionDataService.FilteredBabyActionsDataChanged.subscribe(
        (filteredBabyActions: BabyActionDataModel[]) =>
          (this.babyActionsData = filteredBabyActions)
      );
  }

  public ngOnDestroy(): void {
    this.babyActionsDataChanged.unsubscribe();
    this.FilteredBabyActionsDataChanged.unsubscribe();
  }

  onFilter(category: any) {
    this.filterMode = true;
    this.babyActionDataService.filterBabyActionsData(category);
  }

  onUnfilter() {
    this.filterMode = false;
    this.babyActionDataService.filterBabyActionsData(null);
  }
}
