import {HttpHandlerFn, HttpRequest, HttpResponse} from '@angular/common/http';
import {of, tap} from 'rxjs';
import {inject, makeStateKey, PLATFORM_ID, TransferState} from '@angular/core';
import {RequestKetExtractorService} from '../services/request-ket-extractor.service';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';

const STATE_KEY_PREFIX = 'http_requests:';

export const transferHttpResponseInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn): any => {

  const transferState: TransferState = inject(TransferState);
  const platformId = inject(PLATFORM_ID);
  const requestKetExtractorService: RequestKetExtractorService = inject(RequestKetExtractorService);


  if (request.method.toUpperCase() !== 'GET') {
    return next(request);
  }

  const key = makeStateKey<HttpResponse<object>>(STATE_KEY_PREFIX + requestKetExtractorService.getKey(request));

  if (isPlatformBrowser(platformId)) {

    const cachedResponse = transferState.get(key, null);

    if (cachedResponse) {
      transferState.remove(key);

      return of(new HttpResponse({
        body: cachedResponse.body,
        status: 200,
        statusText: 'OK (from server)',

      }));
    }
    return next(request);
  }

  if (isPlatformServer(platformId)) {

    return next(request).pipe(tap((event) => {

      if (event instanceof HttpResponse && event.status == 200) {
        const response = { body: event.body };
        transferState.set(key, response);
      }
    }));
  }
}
