import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-baby',
  templateUrl: './add-baby.component.html',
  styleUrls: ['./add-baby.component.css'],
})
export class AddBabyComponent {
  isNewBabyMode = true;
  errorMessage: string | null = null;

  constructor(private userService: UserService, private router: Router) {}

  onSwitchMode() {
    this.isNewBabyMode = !this.isNewBabyMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.isNewBabyMode) {
      this.addNewBaby(form);
    } else {
      this.addExistingBaby(form);
    }

    form.reset();
  }

  private async addNewBaby(form: NgForm): Promise<void> {
    const name = form.value.name;
    const birthDate = form.value.birthDate;
    const userAdded = await this.userService.addNewBaby(name, birthDate);

    if (userAdded) {
      this.navigateAfterAddingBaby();
    } else {
      this.showErrorMessage('Failed to create the baby!');
    }
  }

  private async addExistingBaby(form: NgForm): Promise<void> {
    const uid = form.value.uid;
    const userAdded = await this.userService.addExistingBaby(uid);

    if (userAdded) {
      this.navigateAfterAddingBaby();
    } else {
      this.showErrorMessage(
        'Failed to add the baby! (Please make sure you entered a correct baby key)'
      );
    }
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
