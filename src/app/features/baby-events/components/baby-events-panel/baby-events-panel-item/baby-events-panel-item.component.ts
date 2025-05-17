import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { BabyEventCategory, BabyEvent } from '../../../../../models/baby.model';
import { BabyEventsService } from '../../../services/baby-events.service';
import { UserService } from '../../../../../core/services/user.service';

@Component({
  selector: 'app-baby-events-panel-item',
  templateUrl: './baby-events-panel-item.component.html',
  styleUrl: './baby-events-panel-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class BabyEventsPanelItemComponent {
  private babyEventsService = inject(BabyEventsService);
  private userService = inject(UserService);
  @Input({ required: true }) babyEventCategory: BabyEventCategory;
  @Output() filter = new EventEmitter<BabyEventCategory>();

  public async addBabyEvent(): Promise<void> {
    const comment = this.babyEventCategory.isDefaultCommentEnabled
      ? this.babyEventCategory.defaultComment
      : '';

    const newEvent: BabyEvent = {
      uid: 'new',
      category: this.babyEventCategory,
      comment: comment,
      time: new Date(),
      createdBy: this.userService.user().name,
      lastEditedBy: null,
    };

    try {
      await this.babyEventsService.addEvent(newEvent);
    } catch (error) {
      // todo - show error message to the user
    }
  }

  public filterEvent(event: MouseEvent): void {
    if (event) event.preventDefault();

    this.filter.emit(this.babyEventCategory);
  }
}
