import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BabyMeasurementModel } from '../../../../models/baby-measurement.model';

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
  ],
  templateUrl: './growth-tracking-form.component.html',
  styleUrls: ['./growth-tracking-form.component.scss'],
})
export class GrowthTrackingFormComponent {
  measurementForm: FormGroup;

  public constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GrowthTrackingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BabyMeasurementModel | null
  ) {
    this.initForm(data);
  }

  public onSubmit(): void {
    if (this.measurementForm.valid) {
      this.dialogRef.close(this.measurementForm.value);
    }
  }

  private initForm(data: BabyMeasurementModel | null): void {
    this.measurementForm = this.fb.group({
      date: [data?.date || ''],
      weight: [
        data?.weight || '',
        [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')],
      ],
      height: [
        data?.height || '',
        [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')],
      ],
      headMeasure: [
        data?.headMeasure || '',
        [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')],
      ],
    });
  }
}
