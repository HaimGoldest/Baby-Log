import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import BabyEventFavoriteItemStrings from './baby-event-favorite-item.strings';
import { BABY_NOTE_MAX_LENGTH } from '../../../../core/default-data/baby-event-limits';
import { FavoriteDraft } from '../../pages/baby-event-preferences.vm';

/**
 * Presentational card for one favorited category. It owns no state and never
 * touches its input: every edit is emitted upwards, and the preferences page
 * applies it to the draft it owns.
 */
@Component({
  selector: 'app-baby-event-favorite-item',
  templateUrl: './baby-event-favorite-item.component.html',
  styleUrl: './baby-event-favorite-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
  ],
})
export class BabyEventFavoriteItemComponent {
  public favorite = input.required<FavoriteDraft>();
  public isFirst = input.required<boolean>();
  public isLast = input.required<boolean>();

  public moveUp = output<void>();
  public moveDown = output<void>();
  public remove = output<void>();
  public addComment = output<void>();
  public editComment = output<{ id: number; text: string }>();
  public removeComment = output<number>();

  public strings = BabyEventFavoriteItemStrings;
  public readonly maxNoteLength = BABY_NOTE_MAX_LENGTH;

  public onCommentInput(id: number, target: EventTarget): void {
    this.editComment.emit({ id, text: (target as HTMLInputElement).value });
  }
}
