import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { AppGuard } from './core/guards/app.guard';
import { LoginComponent } from './features/login/login.component';
import { BabyActionsPreferencesComponent } from './features/baby-actions/baby-actions-preferences/baby-actions-preferences.component';
import { BabyActionsComponent } from './features/baby-actions/baby-actions.component';

const routes: Routes = [
  { path: '', redirectTo: '/loading', pathMatch: 'full' },

  // Eager loading paths
  { path: 'loading', component: LoadingSpinnerComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'baby-actions',
    component: BabyActionsComponent,
    canActivate: [AppGuard],
  },
  {
    path: 'baby-actions-preferences',
    component: BabyActionsPreferencesComponent,
    canActivate: [AppGuard],
  },

  // Lazy loading paths
  {
    path: 'growth-tracking',
    loadComponent: () =>
      import('./features/growth-tracking/pages/growth-tracking.page').then(
        (m) => m.GrowthTrackingPage
      ),
  },
  {
    path: 'add-baby',
    loadComponent: () =>
      import('./features/add-baby/add-baby.component').then(
        (module) => module.AddBabyComponent
      ),
    canActivate: [AppGuard],
  },
  {
    path: 'baby-info',
    loadComponent: () =>
      import('./features/baby-info/baby-info.component').then(
        (module) => module.BabyInfoComponent
      ),
    canActivate: [AppGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
