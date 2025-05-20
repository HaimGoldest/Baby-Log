import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  public babyImageUrl = computed(() => this.babiesService.baby()?.imageUrl);
  public homePage = AppRoute.HomePage;
  public babyEventsPage = AppRoute.BabyEvents;
  public growthTrackingPage = AppRoute.GrowthTracking;
  public babyEventPreferencesPage = AppRoute.BabyEventPreferences;
  public addBabyPage = AppRoute.AddBaby;
  public babyInfoPage = AppRoute.BabyInfo;

  public logout() {
    this.authService.logout();
  }
}
