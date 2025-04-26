import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { BabiesService } from '../../core/services/babies.service';
import { UserService } from '../../core/services/user.service';
import { Route } from '../../enums/route.enum';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    LoadingSpinnerComponent,
  ],
  selector: 'app-baby-info',
  templateUrl: './baby-info.page.html',
  styleUrls: ['./baby-info.page.scss'],
})
export class BabyInfoPage implements OnInit {
  baby = computed(() => this.babiesService.baby());
  babyImageUrl: string | null = null;
  isLoading: boolean;

  constructor(
    private babiesService: BabiesService,
    private userService: UserService,
    private router: Router,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadBabyImage();
  }

  private loadBabyImage(): void {
    if (this.baby().uid) {
      this.babiesService.getBabyImageUrl(this.baby().uid).then((url) => {
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
    if (this.baby().uid) {
      this.babiesService
        .uploadBabyImage(this.baby().uid, file)
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
    this.router.navigate([Route.AddBaby]);
  }
}
