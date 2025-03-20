import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingSpinnerComponent } from './components/common/loading-spinner/loading-spinner.component';
import { AppGuardService } from './services/app-guard.service';
import { BabyActionsPreferencesComponent } from './components/features/baby-actions/baby-actions-preferences/baby-actions-preferences.component';
import { BabyActionsComponent } from './components/features/baby-actions/baby-actions.component';
import { LoginComponent } from './components/features/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/loading', pathMatch: 'full' },

  // Eager loading paths
  { path: 'loading', component: LoadingSpinnerComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'baby-actions',
    component: BabyActionsComponent,
    canActivate: [AppGuardService],
  },
  {
    path: 'baby-actions-preferences',
    component: BabyActionsPreferencesComponent,
    canActivate: [AppGuardService],
  },

  // Lazy loading paths
  {
    path: 'growth-tracking',
    loadChildren: () =>
      import(
        './components/features/growth-tracking/growth-tracking.module'
      ).then((module) => module.GrowthTrackingModule),
  },
  {
    path: 'add-baby',
    loadComponent: () =>
      import('./components/features/add-baby/add-baby.component').then(
        (module) => module.AddBabyComponent
      ),
    canActivate: [AppGuardService],
  },
  {
    path: 'baby-info',
    loadComponent: () =>
      import('./components/features/baby-info/baby-info.component').then(
        (module) => module.BabyInfoComponent
      ),
    canActivate: [AppGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
