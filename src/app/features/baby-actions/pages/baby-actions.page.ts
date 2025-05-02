// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { BabyActionsInfoComponent } from '../components/baby-actions-info/baby-actions-info.component';
// import { BabyActionsPanelComponent } from '../components/baby-actions-panel/baby-actions-panel.component';
// import { BabyActionsDataService } from '../services/baby-actions-data.service';

// @Component({
//   selector: 'app-baby-actions',
//   standalone: true,
//   imports: [CommonModule, BabyActionsPanelComponent, BabyActionsInfoComponent],
//   templateUrl: './baby-actions.page.html',
//   styleUrl: './baby-actions.page.scss',
// })
// export class BabyActionsPage {
//   filterMode = false;

//   constructor(private babyActionDataService: BabyActionsDataService) {}

//   onFilter(category: any) {
//     this.filterMode = true;
//     this.babyActionDataService.filterBabyActionsData(category);
//   }

//   onUnfilter() {
//     this.filterMode = false;
//     this.babyActionDataService.filterBabyActionsData(null);
//   }
// }
