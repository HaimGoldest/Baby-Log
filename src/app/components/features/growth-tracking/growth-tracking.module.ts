import { NgModule } from '@angular/core';

import { GrowthTrackingInfoItemComponent } from './growth-tracking-info/growth-tracking-info-item/growth-tracking-info-item.component';
import { GrowthTrackingInfoComponent } from './growth-tracking-info/growth-tracking-info.component';
import { GrowthTrackingComponent } from './growth-tracking.component';
import { GrowthTrackingRoutingModule } from './growth-tracking-routing.module';
import { GrowthTrackingFormComponent } from './growth-tracking-form/growth-tracking-form.component';
import { CoreModule } from '../../../core.module';

@NgModule({
  declarations: [
    GrowthTrackingComponent,
    GrowthTrackingInfoComponent,
    GrowthTrackingInfoItemComponent,
  ],
  imports: [
    CoreModule,
    GrowthTrackingRoutingModule,
    GrowthTrackingFormComponent,
  ],
})
export class GrowthTrackingModule {}
