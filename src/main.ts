import { bootstrapApplication } from '@angular/platform-browser';

import { registerLocaleData } from '@angular/common';
import localeHe from '@angular/common/locales/he';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

registerLocaleData(localeHe, 'he-IL');

bootstrapApplication(AppComponent, appConfig).catch((err) => {
  console.error('Error bootstrapping the application:', err);
});
