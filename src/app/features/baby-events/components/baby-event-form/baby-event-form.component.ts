import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { BabyEvent } from '../../../../models/baby.model';
import BabyEventFormStrings from './baby-event-form.strings';

@Component({
  selector: 'app-baby-event-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './baby-event-form.component.html',
  styleUrls: ['./baby-event-form.component.scss'],
})
export class BabyEventFormComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<BabyEventFormComponent>);
  private data = inject<BabyEvent>(MAT_DIALOG_DATA);
  public strings = BabyEventFormStrings;

  private initialTime = this.data?.time ? new Date(this.data.time) : new Date();

  public eventForm = this.fb.group({
    date: [this.initialTime],
    time: [this.toTimeString(this.initialTime), [Validators.required]],
    comment: [this.data?.comment ?? '', [Validators.maxLength(62)]],
  });

  public onSubmit(): void {
    if (this.eventForm.valid) {
      const { date, time, comment } = this.eventForm.value;
      const [hours, minutes] = (time ?? '').split(':').map(Number);

      const merged = new Date(date ?? this.initialTime);
      merged.setHours(hours, minutes, 0, 0);

      this.dialogRef.close({ time: merged, comment });
    }
  }

  private toTimeString(date: Date): string {
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
