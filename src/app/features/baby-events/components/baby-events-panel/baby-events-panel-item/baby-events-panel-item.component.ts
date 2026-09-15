import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import { BabyEventCategory, BabyEvent } from '../../../../../models/baby.model';
import { BabyEventsService } from '../../../services/baby-events.service';
import { SessionStore } from '../../../../../core/stores/session/session.store';
import { NotificationService } from '../../../../../core/services/notification.service';
import NotificationStrings from '../../../../../shared/strings/notification.strings';
import { BabyEventCategoryView } from '../../../pages/baby-events.vm';

@Component({
  selector: 'app-baby-events-panel-item',
  templateUrl: './baby-events-panel-item.component.html',
  styleUrl: './baby-events-panel-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class BabyEventsPanelItemComponent {
  private babyEventsService = inject(BabyEventsService);
  private sessionStore = inject(SessionStore);
  private notificationService = inject(NotificationService);
  public babyEventCategory = input.required<BabyEventCategoryView>();
  @Output() filter = new EventEmitter<BabyEventCategory>();

  public async addBabyEvent(): Promise<void> {
    const newEvent: BabyEvent = {
      uid: 'new',
      category: this.babyEventCategory().category,
      comment: this.babyEventCategory().favorite.commonComments[0] ?? '',
      time: new Date(),
      createdBy: this.sessionStore.user().name,
      lastEditedBy: null,
    };

    try {
      await this.babyEventsService.addEvent(newEvent);
    } catch (error) {
      this.notificationService.error(NotificationStrings.ADD_EVENT_FAILED);
    }
  }

  public filterEvent(event: MouseEvent): void {
    if (event) event.preventDefault();

    this.filter.emit(this.babyEventCategory().category);
  }
}
