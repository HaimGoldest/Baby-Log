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
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';

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
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private destroy$ = new Subject<void>();

  @Input({ required: true }) public event: BabyEvent;
  @Input({ required: true }) public filterMode: boolean;
  @Output() filter = new EventEmitter<BabyEventCategory>();
  @Output() unfilter = new EventEmitter<void>();

  public async onEdit(event?: MouseEvent): Promise<void> {
    if (event) event.preventDefault();

    const { BabyEventFormComponent } = await import(
      '../../components/baby-event-form/baby-event-form.component'
    );

    const dialogRef = this.dialog.open(BabyEventFormComponent, {
      width: '90vw',
      maxWidth: '300px',
      data: this.event,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: BabyEvent) => {
        if (result) {
          this.updateEvent(result);
        }
      });
  }

  private async updateEvent(data: BabyEvent): Promise<void> {
    const editedEvent: BabyEvent = {
      ...this.event,
      ...data,
      time: new Date(data.time),
      lastEditedBy: this.userService.user().name,
    };

    try {
      await this.babyEventsService.updateEvent(editedEvent);
    } catch (error) {
      this.showError('Error updating measurement');
    }
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

  private showError(message: string) {
    // todo - implement generic error dialog
  }
}
