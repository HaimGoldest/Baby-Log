import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  ],
  templateUrl: './baby-event-form.component.html',
  styleUrls: ['./baby-event-form.component.scss'],
})
export class BabyEventFormComponent {
  public eventForm: FormGroup;
  private formBuilder: FormBuilder;
  public dialogRef = inject(MatDialogRef<BabyEventFormComponent>);
  public data = inject<BabyEvent | null>(MAT_DIALOG_DATA);

  // public constructor() {
  //   this.eventForm = this.formBuilder.group({
  //     date: [this.data?.time || new Date()],
  //   });
  // }
}
