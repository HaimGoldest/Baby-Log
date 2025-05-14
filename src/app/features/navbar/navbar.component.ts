import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { BabiesService } from '../../core/services/babies.service';
import { AuthService } from '../../core/services/auth.service';
import { AppRoute } from '../../enums/app-route.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private babiesService = inject(BabiesService);

  public isLoggedIn = this.authService.isLoggedIn;
  public userImageUrl = this.userService.userPictureUrl;
  public babyImageUrl = this.babiesService.babyPictureUrl;
  public userHaveBabies = this.userService.userHaveBabies;

  public homePage = AppRoute.HomePage;
  public babyEventsPage = AppRoute.BabyEvents;
  public growthTrackingPage = AppRoute.GrowthTracking;
  public babyEventPreferencesPage = AppRoute.BabyEventPreferences;
  public addBabyPage = AppRoute.AddBaby;

  logout() {
    this.authService.logout();
  }
}
