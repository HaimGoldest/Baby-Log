import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './features/navbar/navbar.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { NotificationHostComponent } from './shared/components/notification-host/notification-host.component';
import { RouteTrackerService } from './core/services/route-tracker.service';
import { AppService } from './core/services/app.service';
import { SessionStore } from './core/stores/session/session.store';
import { AppRoute } from './enums/app-route.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    LoadingSpinnerComponent,
    NotificationHostComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private routeTrackerService = inject(RouteTrackerService);
  private appService = inject(AppService);
  private router = inject(Router);

  // Injected for its side effect: creating the store starts the auth listener.
  private sessionStore = inject(SessionStore);

  /** Show loading spinner while user not logged in and route is not yet resolved or if AppService is in isLoading state.  */
  public readonly showLoadingSpinner = computed(
    () =>
      this.routeTrackerService.currentRoute() === '' ||
      this.appService.isLoading(),
  );

  public constructor() {
    // Navigation on session transitions lives at the shell rather than in the
    // store: the store owns data, and `appGuard` owns the routing rules.
    // Aiming at the home page is enough - the guard redirects on from there
    // when the user has no baby or no favorites, so the destination is
    // expressed in exactly one place.
    effect(() => {
      const status = this.sessionStore.status();

      if (status === 'ready') {
        this.router.navigate(['/', AppRoute.HomePage]);
      } else if (status === 'signed-out') {
        this.router.navigate(['/', AppRoute.Login]);
      }
    });
  }
}
