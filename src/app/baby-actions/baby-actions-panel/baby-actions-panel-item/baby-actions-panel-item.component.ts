import { Component, Input } from '@angular/core';
import { BabyActionCategoryModel } from '../../../models/baby-action-category.model';
import { BabyActionDataModel } from '../../../models/baby-action-data.model';
import { BabyActionsDataService } from '../../../services/baby-actions-data.service';

@Component({
  selector: 'app-baby-actions-panel-item',
  templateUrl: './baby-actions-panel-item.component.html',
  styleUrl: './baby-actions-panel-item.component.css',
})
export class BabyActionsPanelItemComponent {
  @Input() babyActionCategory: BabyActionCategoryModel;
  @Input() index: number;

  constructor(private babyActionDataService: BabyActionsDataService) {}

  onAddBabyAction() {
    try {
      const description = this.babyActionCategory.isDefaultDescriptionEnable
        ? this.babyActionCategory.defaultDescription
        : '';

      const babyActionData = new BabyActionDataModel(
        this.babyActionCategory,
        description,
        new Date()
      );

      this.babyActionDataService.addBabyAction(babyActionData);
    } catch (error) {
      console.error('Error adding baby action data:', Error);
    }
  }
}
