import { Component, Input } from '@angular/core';
import { BabyActionCategoryModel } from '../../../models/baby-action-category.model';
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
    let BabyActionData = this.babyActionCategory.data;
    BabyActionData.creationTime = new Date();
    this.babyActionDataService.addBabyAction(BabyActionData);
  }
}
