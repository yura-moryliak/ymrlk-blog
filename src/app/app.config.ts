import {APP_INITIALIZER, ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideClientHydration} from "@angular/platform-browser";

import {routes} from './app.routes';
import {AuthService} from './core/services/auth.service';

import {authInterceptor} from './core/interceptors/auth.interceptor';
import {appInitializerAuthCheckFactory} from './core/factories/app-initializer-auth-check.factory';



export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerAuthCheckFactory,
      deps: [AuthService],
      multi: true
    },
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideClientHydration()
  ]
};
