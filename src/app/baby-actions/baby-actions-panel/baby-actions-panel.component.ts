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
  babyActionsCategories: BabyActionCategoryModel[] = [];
  babyActionsCategoriesChanged: Subscription;

  constructor(
    private babyActionCategoriesService: BabyActionCategoriesService
  ) {}

  ngOnInit(): void {
    this.babyActionCategoriesService.getCategories().forEach((category) => {
      if (category.isCategoryEnable) {
        this.babyActionsCategories.push(category);
      }
    });

    this.babyActionsCategoriesChanged =
      this.babyActionCategoriesService.babyActionsCategoriesChanged.subscribe(
        (newCategories: BabyActionCategoryModel[]) =>
          (this.babyActionsCategories = newCategories)
      );
  }

  ngOnDestroy(): void {
    this.babyActionsCategoriesChanged.unsubscribe;
  }
}
