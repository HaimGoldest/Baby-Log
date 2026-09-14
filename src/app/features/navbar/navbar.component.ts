import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { SessionStore } from '../../core/stores/session/session.store';
import { BabiesStore } from '../../core/stores/babies/babies.store';
import { AppRoute } from '../../enums/app-route.enum';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import NavbarStrings from './navbar.strings';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
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
  private sessionStore = inject(SessionStore);
  private babiesStore = inject(BabiesStore);

  public isLoggedIn = this.sessionStore.isLoggedIn;
  public userImageUrl = this.sessionStore.userimageUrl;
  public userHaveBabies = this.sessionStore.userHaveBabies;
  public babyImageUrl = computed(() => this.babiesStore.baby()?.imageUrl);
  public homePage = AppRoute.HomePage;
  public babyEventsPage = AppRoute.BabyEvents;
  public growthTrackingPage = AppRoute.GrowthTracking;
  public babyEventPreferencesPage = AppRoute.BabyEventPreferences;
  public addBabyPage = AppRoute.AddBaby;
  public babyInfoPage = AppRoute.BabyInfo;

  public strings = NavbarStrings;

  public logout() {
    this.sessionStore.signOut();
  }

  public onImageError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
