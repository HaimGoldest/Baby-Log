import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BabyEventCategory } from '../../../../models/baby.model';

@Component({
  selector: 'app-baby-event-preferences-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './baby-event-preferences-item.component.html',
  styleUrl: './baby-event-preferences-item.component.scss',
})
export class BabyEventsPreferencesItemComponent {
  @Input({ required: true }) babyEventCategory: BabyEventCategory;
  @Output() modified = new EventEmitter<boolean>();

  public updateDefaultComment(newValue: string): void {
    this.babyEventCategory.defaultComment = newValue;
    this.onChanged();
  }

  public onChanged(): void {
    this.modified.emit(true);
  }
}
