import { Component, computed, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './features/navbar/navbar.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { RouteTrackerService } from './core/services/route-tracker.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LoadingSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private routeTrackerService = inject(RouteTrackerService);
  private authService = inject(AuthService);

  /** Show loading spinner while user not logged in and route is not yet resolved */
  public readonly showLoadingSpinner = computed(
    () =>
      //!this.authService.isLoggedIn() &&
      this.routeTrackerService.currentRoute() === ''
  );

  private logState = effect(() => {
    if (this.showLoadingSpinner()) {
      console.warn('Loading spinner is shown');
    } else {
      console.warn('Loading spinner is hidden');
    }
  });
}
