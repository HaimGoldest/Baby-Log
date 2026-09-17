import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // required by MatDatepicker
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

import { AppService } from '../../core/services/app.service';
import { Observable } from 'rxjs';
import { BabiesStore } from '../../core/stores/babies/babies.store';
import { SessionStore } from '../../core/stores/session/session.store';
import { AppRoute } from '../../enums/app-route.enum';
import { Gender } from '../../enums/gender.enum';
import AddBabyStrings from './add-baby.strings';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-baby',
  templateUrl: './add-baby.page.html',
  styleUrls: ['./add-baby.page.scss'],
})
export class AddBabyPage {
  private appService = inject(AppService);
  private sessionStore = inject(SessionStore);
  private babiesStore = inject(BabiesStore);
  private router = inject(Router);

  public isNewBabyMode = true;
  public errorMessage: string | null = null;
  public selectedImage: File | null = null;
  public imagePreview$?: Observable<string>;
  public strings = AddBabyStrings;

  onSwitchMode() {
    this.isNewBabyMode = !this.isNewBabyMode;
  }

  onImageSelected(event: Event) {
    this.appService.isLoading.set(true);

    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedImage = file;

    this.imagePreview$ = new Observable<string>((sub) => {
      const reader = new FileReader();
      reader.onload = () => {
        sub.next(reader.result as string);
        sub.complete();
      };
      reader.onerror = (err) => sub.error(err);
      reader.readAsDataURL(file);
    });
    this.appService.isLoading.set(false);
  }

  public async onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.appService.isLoading.set(true);

    try {
      const added = this.isNewBabyMode
        ? await this.addNewBaby(form)
        : await this.addExistingBaby(form);

      // Navigation moved out of SessionStore: the store performs the data
      // operation and this page decides where to go once it succeeded. Doing
      // it here also means the image upload finishes before we leave, which
      // the store-side navigation used to cut short.
      if (added) {
        await this.router.navigate(['/', AppRoute.BabyEventPreferences]);
      }
    } catch {
      this.showErrorMessage('Failed to create the baby!');
    } finally {
      this.appService.isLoading.set(false);
    }
  }

  /** Resolves to whether the baby was actually added, which gates navigation. */
  private async addNewBaby(form: NgForm): Promise<boolean> {
    const name = form.value.name;
    const birthDate = form.value.birthDate;
    const gender = form.value.gender as Gender;

    try {
      await this.sessionStore.addNewBaby({
        name: name,
        birthDate: birthDate,
        gender: gender,
        imageUrl: null,
      });

      if (this.selectedImage && this.babiesStore.baby()) {
        await this.uploadBabyImage();
      }

      return true;
    } catch (error) {
      this.showErrorMessage('Failed to create the baby!');
      return false;
    }
  }

  private async addExistingBaby(form: NgForm): Promise<boolean> {
    const uid = form.value.uid;
    try {
      await this.sessionStore.addExistingBaby(uid);
      return true;
    } catch (error) {
      this.showErrorMessage(
        'Failed to add the baby! (Please make sure you entered a correct baby key)'
      );
      return false;
    }
  }

  private async uploadBabyImage(): Promise<void> {
    const baby = this.babiesStore.baby();
    try {
      await this.babiesStore.uploadImage(baby.uid, this.selectedImage);
    } catch (error) {
      this.showErrorMessage('Failed to upload the baby image!');
    }
  }

  private showErrorMessage(message: string) {
    // todo - use generic error dialog component
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }
}
