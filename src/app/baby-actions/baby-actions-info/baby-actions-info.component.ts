import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { BabyActionModel } from '../../models/bayby-action.model';
import { BabyActionsService } from '../../services/baby-actions.service';

@Component({
  selector: 'app-baby-actions-info',
  templateUrl: './baby-actions-info.component.html',
  styleUrl: './baby-actions-info.component.css',
})
export class BabyActionsInfoComponent {
  babyActions: BabyActionModel[] = [];
  private babyActionsChanged: Subscription;

  constructor(private babyActionService: BabyActionsService) {}

  ngOnInit(): void {
    this.babyActions = this.babyActionService.getBabyActions();
    this.babyActionsChanged =
      this.babyActionService.babyActionsChanged.subscribe(
        (newBabyActions: BabyActionModel[]) =>
          (this.babyActions = newBabyActions)
      );
  }

  ngOnDestroy(): void {
    this.babyActionsChanged.unsubscribe;
  }
}
