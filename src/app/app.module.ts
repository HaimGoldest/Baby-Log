import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BabyActionsComponent } from './baby-actions/baby-actions.component';
import { BabyActionsPanelComponent } from './baby-actions/baby-actions-panel/baby-actions-panel.component';
import { BabyActionsInfoComponent } from './baby-actions/baby-actions-info/baby-actions-info.component';
import { BabyActionsInfoItemComponent } from './baby-actions/baby-actions-info/baby-actions-info-item/baby-actions-info-item.component';
import { BabyActionsPanelItemComponent } from './baby-actions/baby-actions-panel/baby-actions-panel-item/baby-actions-panel-item.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BabyActionsComponent,
    BabyActionsPanelComponent,
    BabyActionsInfoComponent,
    BabyActionsInfoItemComponent,
    BabyActionsPanelItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
