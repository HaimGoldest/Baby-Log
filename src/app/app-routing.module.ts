import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BabyActionsPreferencesComponent } from './baby-actions/baby-actions-preferences/baby-actions-preferences.component';
import { BabyActionsComponent } from './baby-actions/baby-actions.component';
import { GrowthTrackingHeadMeasureComponent } from './growth-tracking/growth-tracking-head-measure/growth-tracking-head-measure.component';
import { GrowthTrackingHeightComponent } from './growth-tracking/growth-tracking-height/growth-tracking-height.component';
import { GrowthTrackingWeightComponent } from './growth-tracking/growth-tracking-weight/growth-tracking-weight.component';
import { GrowthTrackingComponent } from './growth-tracking/growth-tracking.component';

const routes: Routes = [
  { path: '', component: BabyActionsComponent },
  { path: 'baby-actions', component: BabyActionsComponent },
  { path: 'growth-tracking', component: GrowthTrackingComponent },
  {
    path: 'growth-tracking',
    component: GrowthTrackingComponent,
    children: [
      { path: 'height', component: GrowthTrackingHeightComponent },
      { path: 'weight', component: GrowthTrackingWeightComponent },
      { path: 'head-measure', component: GrowthTrackingHeadMeasureComponent },
    ],
  },
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
