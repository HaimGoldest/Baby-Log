import { NgModule } from '@angular/core';

import { GrowthTrackingInfoItemComponent } from './growth-tracking-info/growth-tracking-info-item/growth-tracking-info-item.component';
import { GrowthTrackingInfoComponent } from './growth-tracking-info/growth-tracking-info.component';
import { GrowthTrackingNewMeasurementComponent } from './growth-tracking-new-measurement/growth-tracking-new-measurement.component';
import { GrowthTrackingComponent } from './growth-tracking.component';
import { GrowthTrackingRoutingModule } from './growth-tracking-routing.module';
import { CoreModule } from '../../../core.module';

@NgModule({
  declarations: [
    GrowthTrackingComponent,
    GrowthTrackingInfoComponent,
    GrowthTrackingNewMeasurementComponent,
    GrowthTrackingInfoItemComponent,
  ],
  imports: [CoreModule, GrowthTrackingRoutingModule],
})
export class GrowthTrackingModule {}
