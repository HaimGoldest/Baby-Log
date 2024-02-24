import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BabyActionsComponent } from './baby-actions/baby-actions.component';
import { BabyActionsPanelComponent } from './baby-actions/baby-actions-panel/baby-actions-panel.component';
import { BabyActionsInfoComponent } from './baby-actions/baby-actions-info/baby-actions-info.component';
import { BabyActionsInfoItemComponent } from './baby-actions/baby-actions-info/baby-actions-info-item/baby-actions-info-item.component';
import { BabyActionsPanelItemComponent } from './baby-actions/baby-actions-panel/baby-actions-panel-item/baby-actions-panel-item.component';
import { GrowthTrackingComponent } from './growth-tracking/growth-tracking.component';
import { BabyActionsPreferencesComponent } from './baby-actions/baby-actions-preferences/baby-actions-preferences.component';
import { BabyActionCategoryPrefComponent } from './baby-actions/baby-actions-preferences/baby-action-category-pref/baby-action-category-pref.component';
import { GrowthTrackingHeightComponent } from './growth-tracking/growth-tracking-height/growth-tracking-height.component';
import { GrowthTrackingWeightComponent } from './growth-tracking/growth-tracking-weight/growth-tracking-weight.component';
import { GrowthTrackingHeadMeasureComponent } from './growth-tracking/growth-tracking-head-measure/growth-tracking-head-measure.component';
import { GrowthTrackingInfoComponent } from './growth-tracking/growth-tracking-info/growth-tracking-info.component';
import { GrowthTrackingNewMeasurementComponent } from './growth-tracking/growth-tracking-new-measurement/growth-tracking-new-measurement.component';
import { GrowthTrackingInfoItemComponent } from './growth-tracking/growth-tracking-info/growth-tracking-info-item/growth-tracking-info-item.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BabyActionsComponent,
    BabyActionsPanelComponent,
    BabyActionsInfoComponent,
    BabyActionsInfoItemComponent,
    BabyActionsPanelItemComponent,
    GrowthTrackingComponent,
    BabyActionsPreferencesComponent,
    BabyActionCategoryPrefComponent,
    GrowthTrackingHeightComponent,
    GrowthTrackingWeightComponent,
    GrowthTrackingHeadMeasureComponent,
    GrowthTrackingInfoComponent,
    GrowthTrackingNewMeasurementComponent,
    GrowthTrackingInfoItemComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
