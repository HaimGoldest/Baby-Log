import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { BabyEvent } from '../../../../models/baby.model';

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
    MatMomentDateModule,
    MatIconModule,
    MatTimepickerModule,
  ],
  templateUrl: './baby-event-form.component.html',
  styleUrls: ['./baby-event-form.component.scss'],
})
export class BabyEventFormComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<BabyEventFormComponent>);
  private data = inject<BabyEvent | null>(MAT_DIALOG_DATA);

  public eventForm = this.fb.group({
    date: [this.data?.time ?? new Date()],
  });
}
