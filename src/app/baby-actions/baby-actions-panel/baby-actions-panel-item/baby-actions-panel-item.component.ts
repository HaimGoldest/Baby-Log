import { Component, Input } from '@angular/core';
import { BabyActionModel } from '../../../models/bayby-action.model';
import { BabyActionsService } from '../../../services/baby-actions.service';

@Component({
  selector: 'app-baby-actions-panel-item',
  templateUrl: './baby-actions-panel-item.component.html',
  styleUrl: './baby-actions-panel-item.component.css',
})
export class BabyActionsPanelItemComponent {
  @Input() babyAction: BabyActionModel;
  @Input() index: number;

  constructor(private babyActionService: BabyActionsService) {}

  onAddBabyAction() {
    this.babyAction.creationTime = new Date();
    this.babyActionService.addBabyAction(this.babyAction);
  }
}
