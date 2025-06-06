import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
import { BabyMeasurement } from '../../../../models/baby.model';
import GrowthTrackingFormStrings from './growth-tracking-form.strings';

@Component({
  selector: 'app-growth-tracking-form',
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
  templateUrl: './growth-tracking-form.component.html',
  styleUrls: ['./growth-tracking-form.component.scss'],
})
export class GrowthTrackingFormComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<GrowthTrackingFormComponent>);
  public data = inject<BabyMeasurement | null>(MAT_DIALOG_DATA);
  public strings = GrowthTrackingFormStrings;

  public measurementForm = this.fb.group({
    date: [this.data?.date || new Date()],
    weight: [
      this.data?.weight || '',
      [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')],
    ],
    height: [
      this.data?.height || '',
      [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')],
    ],
    headMeasure: [
      this.data?.headMeasure || '',
      [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')],
    ],
  });

  public onSubmit(): void {
    if (this.measurementForm.valid) {
      this.dialogRef.close(this.measurementForm.value);
    }
  }
}
