import { Component } from '@angular/core';
import { BabyActionsDataService } from '../../../services/baby-actions-data.service';

@Component({
  selector: 'app-baby-actions',
  templateUrl: './baby-actions.component.html',
  styleUrl: './baby-actions.component.scss',
})
export class BabyActionsComponent {
  filterMode = false;

  constructor(private babyActionDataService: BabyActionsDataService) {}

  onFilter(category: any) {
    this.filterMode = true;
    this.babyActionDataService.filterBabyActionsData(category);
  }

  onUnfilter() {
    this.filterMode = false;
    this.babyActionDataService.filterBabyActionsData(null);
  }
}
