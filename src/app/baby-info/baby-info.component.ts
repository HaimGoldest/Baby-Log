import { Component } from '@angular/core';
import { BabiesService } from '../services/babies.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-baby-info',
  templateUrl: './baby-info.component.html',
  styleUrls: ['./baby-info.component.css'],
})
export class BabyInfoComponent {
  uid: string;
  name: string;
  birthDate: Date;

  constructor(
    private babiesService: BabiesService,
    private userService: UserService,
    private router: Router,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) {
    this.uid = this.babiesService.babyData.value.uid;
    this.name = this.babiesService.babyData.value.name;
    this.birthDate = this.babiesService.babyData.value.birthDate;
  }

  public deleteBaby(): void {
    let userDeleted = this.userService.deleteBabyOnlyFromUser(this.uid);

    if (userDeleted) {
      this.navigateAfterBabyDeletion();
    }
  }

  public copyUIDToClipboard(): void {
    this.clipboard.copy(this.uid);
    this.snackBar.open('UID copied to clipboard', 'Close', {
      duration: 2000,
    });
  }

  private navigateAfterBabyDeletion() {
    this.router.navigate(['./add-baby']);
  }
}
