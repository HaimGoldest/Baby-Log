import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { LoadingSpinnerComponent } from './components/common/loading-spinner/loading-spinner.component';
import { AddBabyComponent } from './components/features/add-baby/add-baby.component';
import { BabyActionsInfoItemComponent } from './components/features/baby-actions/baby-actions-info/baby-actions-info-item/baby-actions-info-item.component';
import { BabyActionsInfoComponent } from './components/features/baby-actions/baby-actions-info/baby-actions-info.component';
import { BabyActionsPanelItemComponent } from './components/features/baby-actions/baby-actions-panel/baby-actions-panel-item/baby-actions-panel-item.component';
import { BabyActionsPanelComponent } from './components/features/baby-actions/baby-actions-panel/baby-actions-panel.component';
import { BabyActionCategoryPrefComponent } from './components/features/baby-actions/baby-actions-preferences/baby-action-category-pref/baby-action-category-pref.component';
import { BabyActionsPreferencesComponent } from './components/features/baby-actions/baby-actions-preferences/baby-actions-preferences.component';
import { BabyActionsComponent } from './components/features/baby-actions/baby-actions.component';
import { BabyInfoComponent } from './components/features/baby-info/baby-info.component';
import { GrowthTrackingInfoItemUpdateComponent } from './components/features/growth-tracking/growth-tracking-info/growth-tracking-info-item/growth-tracking-info-item-update/growth-tracking-info-item-update.component';
import { LoginComponent } from './components/features/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BabyActionsComponent,
    BabyActionsPanelComponent,
    BabyActionsInfoComponent,
    BabyActionsInfoItemComponent,
    BabyActionsPanelItemComponent,
    BabyActionsPreferencesComponent,
    BabyActionCategoryPrefComponent,
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
    MatToolbarModule,
    MatDividerModule,
  ],
  exports: [LoadingSpinnerComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
