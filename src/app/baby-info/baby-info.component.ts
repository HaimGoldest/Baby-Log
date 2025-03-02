import { Component, OnInit } from '@angular/core';
import { BabiesService } from '../services/babies.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-baby-info',
  templateUrl: './baby-info.component.html',
  styleUrls: ['./baby-info.component.scss'],
})
export class BabyInfoComponent implements OnInit {
  uid: string;
  name: string;
  birthDate: Date;
  babyImageUrl: string | null = null;
  isLoading: boolean;

  constructor(
    private babiesService: BabiesService,
    private userService: UserService,
    private router: Router,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) {
    this.uid = this.babiesService.babyData.value?.uid;
    this.name = this.babiesService.babyData.value?.name;
    this.birthDate = this.babiesService.babyData.value?.birthDate;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadBabyImage();
  }

  private loadBabyImage(): void {
    if (this.uid) {
      this.babiesService.getBabyImageUrl(this.uid).then((url) => {
        this.babyImageUrl = url;
        this.isLoading = false;
      });
    }
  }

  public onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.isLoading = true;
      const file = input.files[0];
      this.uploadNewImage(file);
    }
  }

  private uploadNewImage(file: File): void {
    if (this.uid) {
      this.babiesService
        .uploadBabyImage(this.uid, file)
        .then(() => {
          this.loadBabyImage(); // Refresh the displayed image
          this.snackBar.open('Image updated successfully', 'Close', {
            duration: 2000,
          });
        })
        .catch((error) => {
          this.snackBar.open('Failed to update image', 'Close', {
            duration: 2000,
          });
          console.error('Error uploading baby image:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  public deleteBaby(): void {
    let userDeleted = this.userService.deleteBabyOnlyFromUser(this.uid);

    if (userDeleted) {
      this.navigateAfterBabyDeletion();
    }
  }

  public copyUIDToClipboard(): void {
    this.clipboard.copy(this.uid);
    this.snackBar.open('Baby-Key copied to clipboard', 'Close', {
      duration: 2000,
    });
  }

  private navigateAfterBabyDeletion() {
    this.router.navigate(['./add-baby']);
  }
}
