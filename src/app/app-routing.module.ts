import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BabyActionsPreferencesComponent } from './baby-actions/baby-actions-preferences/baby-actions-preferences.component';
import { BabyActionsComponent } from './baby-actions/baby-actions.component';
import { GrowthTrackingComponent } from './growth-tracking/growth-tracking.component';

const routes: Routes = [
  { path: '', component: BabyActionsComponent },
  { path: 'baby-actions', component: BabyActionsComponent },
  { path: 'growth-tracking', component: GrowthTrackingComponent },
  {
    path: 'baby-actions-preferences',
    component: BabyActionsPreferencesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
