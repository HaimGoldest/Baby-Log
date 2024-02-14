import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BabyActionCategoryModel } from '../../models/baby-action-category.model';
import { BabyActionCategoriesService } from '../../services/baby-actions-categories.service';

@Component({
  selector: 'app-baby-actions-preferences',
  templateUrl: './baby-actions-preferences.component.html',
  styleUrl: './baby-actions-preferences.component.css',
})
export class BabyActionsPreferencesComponent implements OnInit, OnDestroy {
  babyActionsCategories: BabyActionCategoryModel[];
  babyActionsCategoriesChanged: Subscription;

  constructor(
    private babyActionCategoriesService: BabyActionCategoriesService
  ) {}

  ngOnInit(): void {
    this.babyActionsCategories =
      this.babyActionCategoriesService.getCategories();

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
