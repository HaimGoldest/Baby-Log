import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingSpinnerComponent } from './components/common/loading-spinner/loading-spinner.component';
import { AuthGuardService } from './services/AuthGuardService';
import { AddBabyComponent } from './components/features/add-baby/add-baby.component';
import { BabyActionsPreferencesComponent } from './components/features/baby-actions/baby-actions-preferences/baby-actions-preferences.component';
import { BabyActionsComponent } from './components/features/baby-actions/baby-actions.component';
import { BabyInfoComponent } from './components/features/baby-info/baby-info.component';
import { GrowthTrackingInfoItemUpdateComponent } from './components/features/growth-tracking/growth-tracking-info/growth-tracking-info-item/growth-tracking-info-item-update/growth-tracking-info-item-update.component';
import { GrowthTrackingComponent } from './components/features/growth-tracking/growth-tracking.component';
import { LoginComponent } from './components/features/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/loading', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'baby-actions',
    component: BabyActionsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'growth-tracking',
    component: GrowthTrackingComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'growth-tracking-update',
    component: GrowthTrackingInfoItemUpdateComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'baby-actions-preferences',
    component: BabyActionsPreferencesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'add-baby',
    component: AddBabyComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'baby-info',
    component: BabyInfoComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'loading', component: LoadingSpinnerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
