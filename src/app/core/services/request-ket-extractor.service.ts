import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {HttpRequest} from '@angular/common/http';

export const TRANSFER_RESPONSE_BASE_URLS = new InjectionToken<string []>('request cache base url');

@Injectable({
  providedIn: 'root'
})
export class RequestKetExtractorService {

  constructor(@Optional() @Inject(TRANSFER_RESPONSE_BASE_URLS) private baseUrls: string[]) {
    this.baseUrls = ([].concat(this.baseUrls as any || [])).reduce((result, item) => result.concat(item), []);
  }

  getKey(httpRequest: HttpRequest<any>): string {
    let url = httpRequest.url;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.baseUrls.some((baseUrl, index) => {
      if (url.indexOf(baseUrl) === 0) {
        url = `__BASE_URL_${index}__` + url.slice(baseUrl.length);
        return true;
      }
    });
    return url;
  }
}
