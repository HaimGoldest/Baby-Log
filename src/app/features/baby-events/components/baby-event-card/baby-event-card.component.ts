import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { BabyEventsService } from '../../services/baby-events.service';
import { BabyEvent, BabyEventCategory } from '../../../../models/baby.model';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-baby-event-card',
  templateUrl: './baby-event-card.component.html',
  styleUrls: ['./baby-event-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class BabyEventCardComponent {
  private babyEventsService = inject(BabyEventsService);
  @Input({ required: true }) public event: BabyEvent;
  @Input({ required: true }) public filterMode: boolean;
  @Output() filter = new EventEmitter<BabyEventCategory>();
  @Output() unfilter = new EventEmitter<void>();

  public onEdit(event?: MouseEvent): void {
    if (event) event.preventDefault();
    console.warn('Edit event not implemented yet');
    // if (this.babyActionData) {
    //   this.babyActionData.description = newDescription;
    //   this.editMode = false;
    //   this.babyActionsDataService.updatedBabyAction(this.babyActionData);
    // }
  }

  public onDelete(): void {
    try {
      this.babyEventsService.deleteEvent(this.event);
      // todo : add confirmation dialog
    } catch (error) {
      // todo : show error message
    }
  }

  public onFilter(): void {
    this.filter.emit(this.event.category);
  }

  public onUnfilter(): void {
    this.unfilter.emit();
  }
}
