import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideClientHydration} from "@angular/platform-browser";
import {DialogModule} from '@angular/cdk/dialog';

import {ToastNoAnimationModule} from 'ngx-toastr';

import {routes} from './app.routes';
import {AuthService} from './_a_core/services/auth.service';
import {UsersService} from './_a_core/services/users.service';

import {authInterceptor} from './_a_core/interceptors/auth.interceptor';
import {appInitializerAuthCheckFactory} from './_a_core/factories/app-initializer-auth-check.factory';
import {appUserPrefetchInitializerFactory} from './_a_core/factories/app-user-prefetch-initializer.factory';


export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerAuthCheckFactory,
      deps: [AuthService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appUserPrefetchInitializerFactory,
      deps: [AuthService, UsersService],
      multi: true
    },
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideClientHydration(),
    importProvidersFrom(ToastNoAnimationModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 10000,
      preventDuplicates: true,
      toastClass: 'ymrlk-toast-override-panel ngx-toastr'
    })),
    importProvidersFrom(DialogModule)
  ]
};
