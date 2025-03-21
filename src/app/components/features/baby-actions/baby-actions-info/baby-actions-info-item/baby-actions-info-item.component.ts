import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { BabyActionDataModel } from '../../../../../models/baby-action-data.model';
import { BabyActionsDataService } from '../../../../../services/baby-actions-data.service';

@Component({
  selector: 'app-baby-actions-info-item',
  templateUrl: './baby-actions-info-item.component.html',
  styleUrls: ['./baby-actions-info-item.component.scss'],
})
export class BabyActionsInfoItemComponent {
  @Input() babyActionData: BabyActionDataModel | undefined;
  @Input() index: number | undefined;
  @Input() activeEditModeIndex: number | null = null;
  @Input() filterMode: boolean = false;
  @Output() editModeOpened = new EventEmitter<number>();
  @Output() filter = new EventEmitter<any>();
  @Output() unfilter = new EventEmitter<void>();
  @ViewChild('descriptionTextarea', { static: true })
  descriptionTextareaRef: ElementRef;
  editMode = false;

  constructor(private babyActionsDataService: BabyActionsDataService) {}

  onStartEditMode(event?: MouseEvent) {
    if (event) event.preventDefault();
    this.editMode = true;

    if (this.index !== undefined) {
      this.editModeOpened.emit(this.index);
    }
  }

  onEditSubmit(newDescription: string) {
    if (this.babyActionData) {
      this.babyActionData.description = newDescription;
      this.editMode = false;
      this.babyActionsDataService.updatedBabyAction(this.babyActionData);
    }
  }

  onCancelEdit() {
    this.editMode = false;
  }

  onDelete() {
    if (this.babyActionData) {
      this.babyActionsDataService.deleteBabyAction(this.babyActionData);
    }
  }

  onFilter() {
    if (this.babyActionData) {
      this.filter.emit(this.babyActionData.category);
    }
  }

  onUnfilter() {
    this.unfilter.emit();
  }
}
