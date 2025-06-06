import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import BabyEventsPreferencesItemStrings from './baby-event-preferences-item.strings';
import GetCategoryName from '../../utils/baby-event-categories.strings';
import { BabyEventCategory } from '../../../../models/baby.model';

@Component({
  selector: 'app-baby-event-preferences-item',
  templateUrl: './baby-event-preferences-item.component.html',
  styleUrl: './baby-event-preferences-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class BabyEventsPreferencesItemComponent {
  @Input({ required: true }) babyEventCategory: BabyEventCategory;
  @Output() modified = new EventEmitter<boolean>();

  public strings = BabyEventsPreferencesItemStrings;

  public updateDefaultComment(newValue: string): void {
    this.babyEventCategory.defaultComment = newValue;
    this.onChanged();
  }

  public onChanged(): void {
    this.modified.emit(true);
  }

  public getCategoryName(category: BabyEventCategory): string {
    return GetCategoryName(category);
  }
}
