import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppGuardService } from '../../../services/app-guard.service';
import { GrowthTrackingComponent } from './growth-tracking.component';

const routes: Routes = [
  {
    path: '',
    component: GrowthTrackingComponent,
    canActivate: [AppGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GrowthTrackingRoutingModule {}
