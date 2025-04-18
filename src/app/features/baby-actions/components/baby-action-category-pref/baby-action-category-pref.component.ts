import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BabyActionCategoryModel } from '../../../../models/baby-action-category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BabyActionCategoriesService } from '../../services/baby-actions-categories.service';

@Component({
  selector: 'app-baby-action-category-pref',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './baby-action-category-pref.component.html',
  styleUrl: './baby-action-category-pref.component.scss',
})
export class BabyActionCategoryPrefComponent implements OnInit {
  @Input() babyActionCategory: BabyActionCategoryModel | undefined;
  @Input() index: number | undefined;
  @Output() modified = new EventEmitter<boolean>();

  constructor(
    private babyActionCategoriesService: BabyActionCategoriesService
  ) {}

  public ngOnInit(): void {
    this.babyActionCategory =
      this.babyActionCategoriesService.getCategories()[this.index];
  }

  public updateDefaultDescription(newValue: string): void {
    this.babyActionCategory.defaultDescription = newValue;
    this.onChanged();
  }

  public onChanged(): void {
    this.modified.emit(true);
  }
}
