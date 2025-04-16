import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BabyActionsInfoItemComponent } from './baby-actions-info-item/baby-actions-info-item.component';
import { CommonModule } from '@angular/common';
import { BabyActionDataModel } from '../../../../models/baby-action-data.model';
import { BabyActionsDataService } from '../../services/baby-actions-data.service';

@Component({
  selector: 'app-baby-actions-info',
  standalone: true,
  imports: [CommonModule, BabyActionsInfoItemComponent],
  templateUrl: './baby-actions-info.component.html',
  styleUrls: ['./baby-actions-info.component.scss'],
})
export class BabyActionsInfoComponent implements OnInit, OnDestroy {
  babyActionsData: BabyActionDataModel[] = [];
  babyActionsDataChanged: Subscription;
  FilteredBabyActionsDataChanged: Subscription;
  activeEditModeIndex: number | null = null;
  @Input() filterMode: boolean = false;
  @Output() filter = new EventEmitter<any>();
  @Output() unfilter = new EventEmitter<void>();

  constructor(private babyActionDataService: BabyActionsDataService) {}

  public ngOnInit(): void {
    this.babyActionsData = this.babyActionDataService.getBabyActions();

    this.babyActionsDataChanged =
      this.babyActionDataService.babyActionsDataChanged.subscribe(
        (newBabyActions: BabyActionDataModel[]) =>
          (this.babyActionsData = newBabyActions)
      );

    this.FilteredBabyActionsDataChanged =
      this.babyActionDataService.FilteredBabyActionsDataChanged.subscribe(
        (filteredBabyActions: BabyActionDataModel[]) =>
          (this.babyActionsData = filteredBabyActions)
      );
  }

  public ngOnDestroy(): void {
    this.babyActionsDataChanged.unsubscribe();
    this.FilteredBabyActionsDataChanged.unsubscribe();
  }

  public onFilter(category: any): void {
    this.filter.emit(category);
  }

  public onUnfilter(): void {
    this.unfilter.emit();
  }

  onEditModeOpened(index: number) {
    this.activeEditModeIndex = index;
  }
}
