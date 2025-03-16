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
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatMomentDateModule,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { BabyMeasurementModel } from '../../../../models/baby-measurement.model';

export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-growth-tracking-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ],
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
      date: [data?.date || new Date()],
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
