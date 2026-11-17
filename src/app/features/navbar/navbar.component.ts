import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
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

  /** Image URLs that failed to load; their avatars fall back to an icon. */
  private readonly brokenImageUrls = signal<ReadonlySet<string>>(new Set());

  public readonly isLoggedIn = this.sessionStore.isLoggedIn;
  public readonly userHaveBabies = this.sessionStore.userHaveBabies;
  public readonly baby = this.babiesStore.baby;
  public readonly userName = computed(
    () => this.sessionStore.user()?.name ?? '',
  );
  public readonly userImageUrl = computed(() =>
    this.loadableImage(this.sessionStore.userimageUrl()),
  );
  public readonly babyImageUrl = computed(() =>
    this.loadableImage(this.babiesStore.baby()?.imageUrl),
  );

  public readonly babyEventsPage = AppRoute.BabyEvents;
  public readonly growthTrackingPage = AppRoute.GrowthTracking;
  public readonly babyEventPreferencesPage = AppRoute.BabyEventPreferences;
  public readonly addBabyPage = AppRoute.AddBaby;
  public readonly babyInfoPage = AppRoute.BabyInfo;

  public readonly strings = NavbarStrings;

  public logout(): void {
    this.sessionStore.signOut();
  }

  public onImageError(url: string): void {
    this.brokenImageUrls.update((urls) => new Set(urls).add(url));
  }

  private loadableImage(url: string | null | undefined): string | null {
    return url && !this.brokenImageUrls().has(url) ? url : null;
  }
}
