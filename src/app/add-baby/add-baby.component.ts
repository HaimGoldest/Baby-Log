import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { BabiesService } from '../services/babies.service';

@Component({
  selector: 'app-add-baby',
  templateUrl: './add-baby.component.html',
  styleUrls: ['./add-baby.component.scss'],
})
export class AddBabyComponent {
  isNewBabyMode = true;
  errorMessage: string | null = null;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isLoading: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
    private babiesService: BabiesService
  ) {}

  onSwitchMode() {
    this.isNewBabyMode = !this.isNewBabyMode;
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  public onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;
    if (this.isNewBabyMode) {
      this.addNewBaby(form).finally(() => {
        this.isLoading = false;
      });
    } else {
      this.addExistingBaby(form).finally(() => {
        this.isLoading = false;
      });
    }

    form.reset();
    this.imagePreview = null;
  }

  private async addNewBaby(form: NgForm): Promise<void> {
    const name = form.value.name;
    const birthDate = form.value.birthDate;
    const userAdded = await this.userService.addNewBaby(name, birthDate);

    if (userAdded && this.selectedImage) {
      await this.uploadBabyImage();
    }

    if (userAdded) {
      this.navigateAfterAddingBaby();
    } else {
      this.showErrorMessage('Failed to create the baby!');
    }
  }

  private async addExistingBaby(form: NgForm): Promise<void> {
    const uid = form.value.uid;
    const userAdded = await this.userService.addExistingBaby(uid);

    if (userAdded && this.selectedImage) {
      await this.uploadBabyImage();
    }

    if (userAdded) {
      this.navigateAfterAddingBaby();
    } else {
      this.showErrorMessage(
        'Failed to add the baby! (Please make sure you entered a correct baby key)'
      );
    }
  }

  private uploadBabyImage(): Promise<void> {
    if (this.selectedImage && this.babiesService.babyData.value) {
      const babyUid = this.babiesService.babyData.value.uid;
      return this.babiesService.uploadBabyImage(babyUid, this.selectedImage);
    }
    return Promise.resolve();
  }

  private navigateAfterAddingBaby() {
    this.router.navigate(['./baby-actions']);
  }

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }
}
