import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './features/navbar/navbar.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { NotificationHostComponent } from './shared/components/notification-host/notification-host.component';
import { RouteTrackerService } from './core/services/route-tracker.service';
import { AppService } from './core/services/app.service';
import { SessionStore } from './core/stores/session/session.store';

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

  // Injected for its side effect: creating the store starts the auth listener.
  private sessionStore = inject(SessionStore);

  /** Show loading spinner while user not logged in and route is not yet resolved or if AppService is in isLoading state.  */
  public readonly showLoadingSpinner = computed(
    () =>
      this.routeTrackerService.currentRoute() === '' ||
      this.appService.isLoading(),
  );
}
