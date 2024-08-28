import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

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
import { GrowthTrackingInfoComponent } from './growth-tracking/growth-tracking-info/growth-tracking-info.component';
import { GrowthTrackingNewMeasurementComponent } from './growth-tracking/growth-tracking-new-measurement/growth-tracking-new-measurement.component';
import { GrowthTrackingInfoItemComponent } from './growth-tracking/growth-tracking-info/growth-tracking-info-item/growth-tracking-info-item.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { LoginComponent } from './login/login.component';
import { AddBabyComponent } from './add-baby/add-baby.component';
import { BabyInfoComponent } from './baby-info/baby-info.component';
import { GrowthTrackingInfoItemUpdateComponent } from './growth-tracking/growth-tracking-info/growth-tracking-info-item/growth-tracking-info-item-update/growth-tracking-info-item-update.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

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
    GrowthTrackingInfoComponent,
    GrowthTrackingNewMeasurementComponent,
    GrowthTrackingInfoItemComponent,
    LoginComponent,
    AddBabyComponent,
    BabyInfoComponent,
    GrowthTrackingInfoItemUpdateComponent,
    LoadingSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
  ],
  exports: [LoadingSpinnerComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
