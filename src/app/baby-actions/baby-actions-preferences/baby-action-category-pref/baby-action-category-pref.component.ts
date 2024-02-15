import { Component, Input, OnInit } from '@angular/core';
import { BabyActionCategoryModel } from '../../../models/baby-action-category.model';
import { BabyActionCategoriesService } from '../../../services/baby-actions-categories.service';

@Component({
  selector: 'app-baby-action-category-pref',
  templateUrl: './baby-action-category-pref.component.html',
  styleUrl: './baby-action-category-pref.component.css',
})
export class BabyActionCategoryPrefComponent implements OnInit {
  @Input() babyActionCategory: BabyActionCategoryModel | undefined;
  @Input() index: number | undefined;

  constructor(
    private babyActionCategoriesService: BabyActionCategoriesService
  ) {}

  ngOnInit(): void {
    this.babyActionCategory =
      this.babyActionCategoriesService.getCategories()[this.index];
  }

  updateDefaultDescription(newValue: string) {
    this.babyActionCategory.defaultDescription = newValue;
  }
}
