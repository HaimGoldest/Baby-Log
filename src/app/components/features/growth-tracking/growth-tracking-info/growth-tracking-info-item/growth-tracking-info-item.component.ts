import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BabyMeasurementModel } from '../../../../../models/baby-measurement.model';
import { BabyMeasurementsService } from '../../../../../services/baby-measurements.service';

@Component({
  selector: 'app-growth-tracking-info-item',
  templateUrl: './growth-tracking-info-item.component.html',
  styleUrl: './growth-tracking-info-item.component.scss',
})
export class GrowthTrackingInfoItemComponent {
  @Input() measurement: BabyMeasurementModel;
  @Input() index: number | undefined;
  @Input() activeEditModeIndex: number | null = null;
  @Output() editModeOpened = new EventEmitter<number>();

  public editMode = false;

  public constructor(
    private babyMeasurementsService: BabyMeasurementsService
  ) {}

  public onStartEditMode(event?: MouseEvent) {
    if (event) event.preventDefault();
    this.editMode = true;

    if (this.index !== undefined) {
      this.editModeOpened.emit(this.index);
    }
  }

  public onEditSubmit(newDescription: string) {
    // if (this.babyActionData) {
    //   this.babyActionData.description = newDescription;
    //   this.editMode = false;
    //   this.babyActionsDataService.updatedBabyAction(this.babyActionData);
    // }
  }

  public onCancelEdit() {
    this.editMode = false;
  }

  public onDelete() {
    if (this.measurement) {
      this.babyMeasurementsService.deleteBabyAction(this.measurement);
    }
  }
}
