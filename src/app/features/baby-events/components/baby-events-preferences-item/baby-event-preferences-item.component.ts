import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import BabyEventsPreferencesItemStrings from './baby-event-preferences-item.strings';
import { BabyEventCategoryView } from '../../pages/baby-events.vm';

@Component({
  selector: 'app-baby-event-preferences-item',
  templateUrl: './baby-event-preferences-item.component.html',
  styleUrl: './baby-event-preferences-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule],
})
export class BabyEventsPreferencesItemComponent {
  @Input({ required: true }) babyEventCategory: BabyEventCategoryView;
  @Output() modified = new EventEmitter<boolean>();

  public strings = BabyEventsPreferencesItemStrings;

  public updateCommonComment(newValue: string): void {
    this.babyEventCategory.favorite.commonComments = newValue ? [newValue] : [];
    this.onChanged();
  }

  public onChanged(): void {
    this.modified.emit(true);
  }
}
