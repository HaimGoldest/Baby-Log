// import { CommonModule } from '@angular/common';
// import {
//   Component,
//   ElementRef,
//   Input,
//   Output,
//   EventEmitter,
//   ViewChild,
// } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatMenuModule } from '@angular/material/menu';

// @Component({
//   selector: 'app-baby-actions-info-item',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     MatCardModule,
//     MatIconModule,
//     MatMenuModule,
//     MatButtonModule,
//     MatFormFieldModule,
//     MatInputModule,
//   ],
//   templateUrl: './baby-actions-info-item.component.html',
//   styleUrls: ['./baby-actions-info-item.component.scss'],
// })
// export class BabyActionsInfoItemComponent {
//   //@Input() babyActionData: BabyActionDataModel | undefined;
//   @Input() index: number | undefined;
//   @Input() activeEditModeIndex: number | null = null;
//   @Input() filterMode: boolean = false;
//   @Output() editModeOpened = new EventEmitter<number>();
//   @Output() filter = new EventEmitter<any>();
//   @Output() unfilter = new EventEmitter<void>();
//   @ViewChild('descriptionTextarea', { static: true })
//   descriptionTextareaRef: ElementRef;
//   editMode = false;

//   constructor(private babyActionsDataService: BabyActionsDataService) {}

//   onStartEditMode(event?: MouseEvent) {
//     if (event) event.preventDefault();
//     this.editMode = true;

//     if (this.index !== undefined) {
//       this.editModeOpened.emit(this.index);
//     }
//   }

//   onEditSubmit(newDescription: string) {
//     // if (this.babyActionData) {
//     //   this.babyActionData.description = newDescription;
//     //   this.editMode = false;
//     //   this.babyActionsDataService.updatedBabyAction(this.babyActionData);
//     // }
//   }

//   onCancelEdit() {
//     this.editMode = false;
//   }

//   onDelete() {
//     // if (this.babyActionData) {
//     //   this.babyActionsDataService.deleteBabyAction(this.babyActionData);
//     // }
//   }

//   onFilter() {
//     // if (this.babyActionData) {
//     //   this.filter.emit(this.babyActionData.category);
//     // }
//   }

//   onUnfilter() {
//     //this.unfilter.emit();
//   }
// }
