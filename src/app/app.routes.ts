import { Routes } from '@angular/router';
import { LoginPage } from './features/login/login.page';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { BabyActionsPage } from './features/baby-actions/pages/baby-actions.page';
import { AppGuard } from './core/guards/app.guard';
import { Route } from './enums/route.enum';

export const appRoutes: Routes = [
  { path: '', redirectTo: Route.Loading, pathMatch: 'full' },

  // Eager loading paths
  { path: Route.Loading, component: LoadingSpinnerComponent },
  { path: Route.Login, component: LoginPage },
  {
    path: Route.BabyActions,
    component: BabyActionsPage,
    canActivate: [AppGuard],
  },

  // Lazy loading paths
  {
    path: Route.Preferences,
    loadComponent: () =>
      import('./features/baby-events/pages/baby-event-preferences.page').then(
        (m) => m.BabyEventsPreferencesPage
      ),
    canActivate: [AppGuard],
  },

  {
    path: Route.GrowthTracking,
    loadComponent: () =>
      import('./features/growth-tracking/pages/growth-tracking.page').then(
        (m) => m.GrowthTrackingPage
      ),
    canActivate: [AppGuard],
  },

  {
    path: Route.AddBaby,
    loadComponent: () =>
      import('./features/add-baby/add-baby.page').then((m) => m.AddBabyPage),
    canActivate: [AppGuard],
  },

  {
    path: Route.BabyInfo,
    loadComponent: () =>
      import('./features/baby-info/baby-info.page').then((m) => m.BabyInfoPage),
    canActivate: [AppGuard],
  },
];
