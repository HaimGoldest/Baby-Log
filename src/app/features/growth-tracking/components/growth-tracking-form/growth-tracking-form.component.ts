
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

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

const MEASUREMENT_CONTROLS = ['weight', 'height', 'headMeasure'] as const;

/**
 * Each measurement is optional on its own, but the form needs at least one
 * that holds a valid number. The per-field validators still reject a
 * malformed entry, so this only decides whether anything was measured.
 */
const atLeastOneMeasurementValidator: ValidatorFn = (group) => {
  const hasMeasurement = MEASUREMENT_CONTROLS.some((name) => {
    const control = group.get(name);
    const value = control?.value;

    return (
      !!control?.valid &&
      value !== null &&
      value !== '' &&
      Number.isFinite(Number(value))
    );
  });

  return hasMeasurement ? null : { atLeastOneMeasurement: true };
};

@Component({
  selector: 'app-growth-tracking-form',
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
    MatTimepickerModule
],
  templateUrl: './growth-tracking-form.component.html',
  styleUrls: ['./growth-tracking-form.component.scss'],
})
export class GrowthTrackingFormComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<GrowthTrackingFormComponent>);
  public data = inject<BabyMeasurement | null>(MAT_DIALOG_DATA);
  public strings = GrowthTrackingFormStrings;

  // `??` rather than `||`, so a stored 0 is shown instead of cleared.
  public measurementForm = this.fb.group(
    {
      date: [this.data?.date || new Date(), Validators.required],
      weight: [
        this.data?.weight ?? null,
        Validators.pattern('^[0-9]+(\\.[0-9]+)?$'),
      ],
      height: [
        this.data?.height ?? null,
        Validators.pattern('^[0-9]+(\\.[0-9]+)?$'),
      ],
      headMeasure: [
        this.data?.headMeasure ?? null,
        Validators.pattern('^[0-9]+(\\.[0-9]+)?$'),
      ],
    },
    { validators: atLeastOneMeasurementValidator },
  );

  public onSubmit(): void {
    if (this.measurementForm.valid) {
      // A number input reports an empty field as null, never undefined (which
      // Firestore rejects), so skipped measurements are stored as null.
      this.dialogRef.close(this.measurementForm.getRawValue());
    }
  }
}
