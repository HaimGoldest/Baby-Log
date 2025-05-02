import { Component, inject, Input } from '@angular/core';
import { BabyEventsService } from '../../../services/baby-events.service';
import { BabyEvent } from '../../../../../models/baby.model';

@Component({
  selector: 'app-baby-events-list-item',
  standalone: true,
  imports: [],
  templateUrl: './baby-events-list-item.component.html',
  styleUrls: ['./baby-events-list-item.component.scss'],
})
export class BabyActionsInfoItemComponent {
  private babyEventsService = inject(BabyEventsService);
  @Input({ required: true }) public event: BabyEvent;
}
