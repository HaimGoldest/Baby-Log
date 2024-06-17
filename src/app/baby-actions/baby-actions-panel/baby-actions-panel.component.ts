import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BabyActionCategoryModel } from '../../models/baby-action-category.model';
import { BabyActionCategoriesService } from '../../services/baby-actions-categories.service';

@Component({
  selector: 'app-baby-actions-panel',
  templateUrl: './baby-actions-panel.component.html',
  styleUrl: './baby-actions-panel.component.css',
})
export class BabyActionsPanelComponent implements OnInit, OnDestroy {
  activeBabyActionsCategories: BabyActionCategoryModel[] = [];
  babyActionsCategoriesChanged: Subscription;

  constructor(
    private babyActionCategoriesService: BabyActionCategoriesService
  ) {}

  ngOnInit(): void {
    this.activeBabyActionsCategories = this.babyActionCategoriesService
      .getCategories()
      .filter((category) => category.isCategoryEnable);

    this.babyActionsCategoriesChanged =
      this.babyActionCategoriesService.babyActionsCategoriesChanged.subscribe(
        (newCategories: BabyActionCategoryModel[]) => {
          this.activeBabyActionsCategories = newCategories.filter(
            (category) => category.isCategoryEnable
          );
        }
      );
  }

  ngOnDestroy(): void {
    this.babyActionsCategoriesChanged.unsubscribe;
  }
}
