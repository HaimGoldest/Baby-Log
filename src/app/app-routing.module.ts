import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BabyActionsPreferencesComponent } from './baby-actions/baby-actions-preferences/baby-actions-preferences.component';
import { BabyActionsComponent } from './baby-actions/baby-actions.component';
import { GrowthTrackingComponent } from './growth-tracking/growth-tracking.component';
import { LoginComponent } from './login/login.component';
import { AddBabyComponent } from './add-baby/add-baby.component';
import { BabyInfoComponent } from './baby-info/baby-info.component';
import { GrowthTrackingInfoItemUpdateComponent } from './growth-tracking/growth-tracking-info/growth-tracking-info-item/growth-tracking-info-item-update/growth-tracking-info-item-update.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';

const routes: Routes = [
  { path: '', component: LoadingSpinnerComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'baby-actions',
    component: BabyActionsComponent,
  },
  {
    path: 'growth-tracking',
    component: GrowthTrackingComponent,
  },
  {
    path: 'growth-tracking-update',
    component: GrowthTrackingInfoItemUpdateComponent,
  },
  {
    path: 'baby-actions-preferences',
    component: BabyActionsPreferencesComponent,
  },
  {
    path: 'add-baby',
    component: AddBabyComponent,
  },
  {
    path: 'baby-info',
    component: BabyInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
