import {bootstrapApplication} from '@angular/platform-browser';
import {enableProdMode} from '@angular/core';

import {AppComponent} from './app/app.component';
import {appConfig} from './app/app.config';

import {environment} from './environments/environment';

if (environment.production) {
  console.log('IS PRODUCTION: ', environment);
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
