import {mergeApplicationConfig, ApplicationConfig} from '@angular/core';
import {provideServerRendering} from '@angular/platform-server';

import {appConfig} from './app.config';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {transferHttpResponseInterceptor} from './core/interceptors/transfer-http-response.interceptor';
import {TRANSFER_RESPONSE_BASE_URLS} from './core/services/request-ket-extractor.service';
import {environment} from '../environments/environment.development';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withInterceptors([transferHttpResponseInterceptor])),
    {
      provide: TRANSFER_RESPONSE_BASE_URLS,
      useValue: [`${ environment.api.baseUrl }`]
    },
  ]
};

export const config: ApplicationConfig = mergeApplicationConfig(appConfig, serverConfig);
