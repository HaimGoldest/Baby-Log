import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
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
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTimepickerModule,
  ],
  templateUrl: './baby-event-form.component.html',
  styleUrls: ['./baby-event-form.component.scss'],
})
export class BabyEventFormComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<BabyEventFormComponent>);
  private data = inject<BabyEvent>(MAT_DIALOG_DATA);
  public strings = BabyEventFormStrings;

  public eventForm = this.fb.group({
    time: [this.data?.time ?? new Date()],
    comment: [this.data?.comment ?? ''],
  });

  public onSubmit(): void {
    if (this.eventForm.valid) {
      this.dialogRef.close(this.eventForm.value);
    }
  }
}
