import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { AppGuard } from './core/guards/app.guard';
import { LoginPage } from './features/login/login.page';
import { BabyActionsPage } from './features/baby-actions/pages/baby-actions.page';

const routes: Routes = [
  { path: '', redirectTo: '/loading', pathMatch: 'full' },

  // Eager loading paths
  { path: 'loading', component: LoadingSpinnerComponent },
  { path: 'login', component: LoginPage },
  {
    path: 'baby-actions',
    component: BabyActionsPage,
    canActivate: [AppGuard],
  },

  // Lazy loading paths
  {
    path: 'baby-actions-preferences',
    loadComponent: () =>
      import(
        './features/baby-actions/pages/baby-actions-preferences.page'
      ).then((page) => page.BabyActionsPreferencesPage),
    canActivate: [AppGuard],
  },
  {
    path: 'growth-tracking',
    loadComponent: () =>
      import('./features/growth-tracking/pages/growth-tracking.page').then(
        (m) => m.GrowthTrackingPage
      ),
    canActivate: [AppGuard],
  },
  {
    path: 'add-baby',
    loadComponent: () =>
      import('./features/add-baby/add-baby.page').then(
        (module) => module.AddBabyPage
      ),
    canActivate: [AppGuard],
  },
  {
    path: 'baby-info',
    loadComponent: () =>
      import('./features/baby-info/baby-info.page').then(
        (module) => module.BabyInfoPage
      ),
    canActivate: [AppGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
