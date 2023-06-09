import {StaticProvider} from '@angular/core';
import {REQUEST} from '@nguniversal/express-engine/tokens';

import {REQUEST_PROVIDER_TOKEN} from './request.provider';

export const backendRequestProvider: StaticProvider = {
  provide: REQUEST_PROVIDER_TOKEN,
  useExisting: REQUEST
};
