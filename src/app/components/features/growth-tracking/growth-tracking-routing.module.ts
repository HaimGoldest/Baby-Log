import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppGuardService } from '../../../services/app-guard.service';
import { GrowthTrackingComponent } from './growth-tracking.component';
import { GrowthTrackingInfoItemUpdateComponent } from './growth-tracking-info/growth-tracking-info-item/growth-tracking-info-item-update/growth-tracking-info-item-update.component';

const routes: Routes = [
  {
    path: '',
    component: GrowthTrackingComponent,
    canActivate: [AppGuardService],
    children: [
      {
        path: 'update',
        component: GrowthTrackingInfoItemUpdateComponent,
        canActivate: [AppGuardService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GrowthTrackingRoutingModule {}
