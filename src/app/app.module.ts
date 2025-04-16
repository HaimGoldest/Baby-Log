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
import { LoginComponent } from './features/login/login.component';
import { NavbarComponent } from './features/navbar/navbar.component';
import { BabyActionsInfoItemComponent } from './features/baby-actions/baby-actions-info/baby-actions-info-item/baby-actions-info-item.component';
import { BabyActionsInfoComponent } from './features/baby-actions/baby-actions-info/baby-actions-info.component';
import { BabyActionsPanelItemComponent } from './features/baby-actions/baby-actions-panel/baby-actions-panel-item/baby-actions-panel-item.component';
import { BabyActionsPanelComponent } from './features/baby-actions/baby-actions-panel/baby-actions-panel.component';
import { BabyActionCategoryPrefComponent } from './features/baby-actions/baby-actions-preferences/baby-action-category-pref/baby-action-category-pref.component';
import { BabyActionsPreferencesComponent } from './features/baby-actions/baby-actions-preferences/baby-actions-preferences.component';
import { BabyActionsComponent } from './features/baby-actions/baby-actions.component';

@NgModule({
  declarations: [
    AppComponent,
    BabyActionsComponent,
    BabyActionsPanelComponent,
    BabyActionsInfoComponent,
    BabyActionsInfoItemComponent,
    BabyActionsPanelItemComponent,
    BabyActionsPreferencesComponent,
    BabyActionCategoryPrefComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    NavbarComponent,
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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
