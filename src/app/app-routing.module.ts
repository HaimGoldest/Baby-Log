import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingSpinnerComponent } from './components/common/loading-spinner/loading-spinner.component';
import { AppGuardService } from './services/app-guard.service';
import { AddBabyComponent } from './components/features/add-baby/add-baby.component';
import { BabyActionsPreferencesComponent } from './components/features/baby-actions/baby-actions-preferences/baby-actions-preferences.component';
import { BabyActionsComponent } from './components/features/baby-actions/baby-actions.component';
import { BabyInfoComponent } from './components/features/baby-info/baby-info.component';
import { LoginComponent } from './components/features/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/loading', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'baby-actions',
    component: BabyActionsComponent,
    canActivate: [AppGuardService],
  },
  {
    path: 'growth-tracking',
    loadChildren: () =>
      import(
        './components/features/growth-tracking/growth-tracking.module'
      ).then((m) => m.GrowthTrackingModule),
  },
  {
    path: 'baby-actions-preferences',
    component: BabyActionsPreferencesComponent,
    canActivate: [AppGuardService],
  },
  {
    path: 'add-baby',
    component: AddBabyComponent,
    canActivate: [AppGuardService],
  },
  {
    path: 'baby-info',
    component: BabyInfoComponent,
    canActivate: [AppGuardService],
  },
  { path: 'loading', component: LoadingSpinnerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
