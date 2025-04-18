import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BabyActionCategoryModel } from '../../../../../models/baby-action-category.model';
import { BabyActionDataModel } from '../../../../../models/baby-action-data.model';
import { BabyActionsDataService } from '../../../services/baby-actions-data.service';

@Component({
  selector: 'app-baby-actions-panel-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './baby-actions-panel-item.component.html',
  styleUrl: './baby-actions-panel-item.component.scss',
})
export class BabyActionsPanelItemComponent {
  @Input() babyActionCategory: BabyActionCategoryModel;
  @Input() index: number;
  @Output() filter = new EventEmitter<any>();

  constructor(private babyActionsDataService: BabyActionsDataService) {}

  public onAddBabyAction(): void {
    try {
      const description = this.babyActionCategory.isDefaultDescriptionEnable
        ? this.babyActionCategory.defaultDescription
        : '';

      const babyActionData = new BabyActionDataModel(
        this.babyActionCategory,
        description,
        new Date()
      );

      this.babyActionsDataService.addBabyAction(babyActionData);
    } catch (error) {
      console.error('Error adding baby action data:', error);
    }
  }

  public FilterBabyActionsData(event: MouseEvent): void {
    event.preventDefault(); // Prevent the default context menu from appearing
    this.onFilter(this.babyActionCategory);
  }

  public onFilter(category: any): void {
    this.filter.emit(category);
  }
}
