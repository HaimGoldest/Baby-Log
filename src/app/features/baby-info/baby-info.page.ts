import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BabiesService } from '../../core/services/babies.service';
import { UserService } from '../../core/services/user.service';
import { AppRoute } from '../../enums/app-route.enum';
import { AppService } from '../../core/services/app.service';

@Component({
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  selector: 'app-baby-info',
  templateUrl: './baby-info.page.html',
  styleUrls: ['./baby-info.page.scss'],
})
export class BabyInfoPage {
  private appService = inject(AppService);
  private babiesService = inject(BabiesService);
  private userService = inject(UserService);
  private router = inject(Router);
  private clipboard = inject(Clipboard);
  private snackBar = inject(MatSnackBar);

  public baby = this.babiesService.baby;
  public babyImageUrl = this.babiesService.babyImageUrl;

  public onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.appService.isLoading.set(true);
      const file = input.files[0];
      this.uploadNewImage(file);
    }
  }

  private uploadNewImage(file: File): void {
    if (this.baby().uid) {
      this.babiesService
        .uploadBabyImage(this.baby().uid, file)
        .then(() => {
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
          this.appService.isLoading.set(false);
        });
    }
  }

  public async deleteBaby(): Promise<void> {
    try {
      await this.userService.deleteBabyFromUser(this.baby());
      this.navigateAfterBabyDeletion();
    } catch (error) {
      // todo - show error message dialog
    }
  }

  public copyUIDToClipboard(): void {
    this.clipboard.copy(this.baby().uid);
    // todo - show a message that the uid was copied - delete the snackbar
    this.snackBar.open('Baby-Key copied to clipboard', 'Close', {
      duration: 2000,
    });
  }

  private navigateAfterBabyDeletion() {
    this.router.navigate(['/', AppRoute.AddBaby]);
  }
}
