import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { BabiesService } from '../../core/services/babies.service';
import { AppRoute } from '../../enums/app-route.enum';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private babiesService = inject(BabiesService);

  public isLoggedIn = this.authService.isLoggedIn;
  public userImageUrl = this.userService.userPictureUrl;
  public userHaveBabies = this.userService.userHaveBabies;

  public homePage = AppRoute.HomePage;
  public babyEventsPage = AppRoute.BabyEvents;
  public growthTrackingPage = AppRoute.GrowthTracking;
  public babyEventPreferencesPage = AppRoute.BabyEventPreferences;
  public addBabyPage = AppRoute.AddBaby;

  private rawBabyPicture = this.babiesService.babyImageUrl;
  public babyImageUrl = signal<string | null>(null);

  constructor() {
    effect(async () => {
      const p = this.rawBabyPicture();
      if (!p) {
        this.babyImageUrl.set(null);
      } else {
        try {
          this.babyImageUrl.set(await p);
        } catch {
          this.babyImageUrl.set(null);
        }
      }
    });
  }

  public logout() {
    this.authService.logout();
  }
}
