import {InjectionToken} from '@angular/core';

export interface RequestProviderInterface {
  headers? : {
    cookie: string;
  }
}

export const REQUEST_PROVIDER_TOKEN = new InjectionToken<RequestProviderInterface>('request provider token');
