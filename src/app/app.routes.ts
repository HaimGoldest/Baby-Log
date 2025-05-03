import { Routes } from '@angular/router';
import { LoginPage } from './features/login/login.page';
import { AppRoute } from './enums/app-route.enum';
import { BabyEventsComponent } from './features/baby-events/pages/baby-events.page';
import { appGuard } from './core/guards/app.guard';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: AppRoute.Loading, pathMatch: 'full' },

  // Eager loading paths
  { path: AppRoute.Loading, component: LoadingSpinnerComponent },
  { path: AppRoute.Login, component: LoginPage, canActivate: [appGuard] },
  {
    path: AppRoute.BabyEvents,
    component: BabyEventsComponent,
    canActivate: [appGuard],
  },

  // Lazy loading paths
  {
    path: AppRoute.BabyEventPreferences,
    loadComponent: () =>
      import('./features/baby-events/pages/baby-event-preferences.page').then(
        (m) => m.BabyEventsPreferencesPage
      ),
    canActivate: [appGuard],
  },

  {
    path: AppRoute.GrowthTracking,
    loadComponent: () =>
      import('./features/growth-tracking/pages/growth-tracking.page').then(
        (m) => m.GrowthTrackingPage
      ),
    canActivate: [appGuard],
  },

  {
    path: AppRoute.AddBaby,
    loadComponent: () =>
      import('./features/add-baby/add-baby.page').then((m) => m.AddBabyPage),
    canActivate: [appGuard],
  },

  {
    path: AppRoute.BabyInfo,
    loadComponent: () =>
      import('./features/baby-info/baby-info.page').then((m) => m.BabyInfoPage),
    canActivate: [appGuard],
  },
];
