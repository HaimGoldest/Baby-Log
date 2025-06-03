import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { BabiesService } from '../../core/services/babies.service';
import { UserService } from '../../core/services/user.service';
import { Gender } from '../../enums/gender.enum';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppService } from '../../core/services/app.service';
import { Observable } from 'rxjs';
import AddBabyStrings from './add-baby.strings';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-baby',
  templateUrl: './add-baby.page.html',
  styleUrls: ['./add-baby.page.scss'],
})
export class AddBabyPage {
  private appService = inject(AppService);
  private userService = inject(UserService);
  private babiesService = inject(BabiesService);

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
      if (this.isNewBabyMode) {
        await this.addNewBaby(form);
      } else {
        await this.addExistingBaby(form);
      }
    } catch {
      this.showErrorMessage('Failed to create the baby!');
    } finally {
      this.appService.isLoading.set(false);
    }
  }

  private async addNewBaby(form: NgForm): Promise<void> {
    const name = form.value.name;
    const birthDate = form.value.birthDate;
    const gender = form.value.gender as Gender;

    try {
      await this.userService.addNewBaby({
        name: name,
        birthDate: birthDate,
        gender: gender,
        imageUrl: null,
      });

      if (this.selectedImage && this.babiesService.baby()) {
        await this.uploadBabyImage();
      }
    } catch (error) {
      this.showErrorMessage('Failed to create the baby!');
    }
  }

  private async addExistingBaby(form: NgForm): Promise<void> {
    const uid = form.value.uid;
    try {
      await this.userService.addExistingBaby(uid);
    } catch (error) {
      this.showErrorMessage(
        'Failed to add the baby! (Please make sure you entered a correct baby key)'
      );
    }
  }

  private async uploadBabyImage(): Promise<void> {
    const baby = this.babiesService.baby();
    try {
      await this.babiesService.uploadBabyImage(baby.uid, this.selectedImage);
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
