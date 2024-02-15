import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BabyActionDataModel } from '../../models/baby-action-data.model';
import { BabyActionsDataService } from '../../services/baby-actions-data.service';

@Component({
  selector: 'app-baby-actions-info',
  templateUrl: './baby-actions-info.component.html',
  styleUrl: './baby-actions-info.component.css',
})
export class BabyActionsInfoComponent implements OnInit, OnDestroy {
  babyActionsData: BabyActionDataModel[] = [];
  babyActionsDataChanged: Subscription;

  constructor(private babyActionDataService: BabyActionsDataService) {}

  ngOnInit(): void {
    this.babyActionsData = this.babyActionDataService.getBabyActions();

    this.babyActionsDataChanged =
      this.babyActionDataService.babyActionsDataChanged.subscribe(
        (newBabyActions: BabyActionDataModel[]) =>
          (this.babyActionsData = newBabyActions)
      );
  }

  ngOnDestroy(): void {
    this.babyActionsDataChanged.unsubscribe;
  }
}
