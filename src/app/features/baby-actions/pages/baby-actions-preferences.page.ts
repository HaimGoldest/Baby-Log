import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BabyActionCategoryPrefComponent } from '../components/baby-action-category-pref/baby-action-category-pref.component';
import { BabyActionCategoriesService } from '../services/baby-actions-categories.service';
import { BabyActionCategoryModel } from '../../../models/baby-action-category.model';

@Component({
  selector: 'app-baby-actions-preferences',
  standalone: true,
  imports: [CommonModule, BabyActionCategoryPrefComponent],
  templateUrl: './baby-actions-preferences.page.html',
  styleUrl: './baby-actions-preferences.page.scss',
})
export class BabyActionsPreferencesPage implements OnInit, OnDestroy {
  private hasChanged = false;
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
    if (this.hasChanged) {
      this.babyActionCategoriesService.updateCategories(
        this.babyActionsCategories
      );
    }

    this.babyActionsCategoriesChanged.unsubscribe;
  }

  public onChanged(): void {
    if (!this.hasChanged) {
      this.hasChanged = true;
    }
  }
}
