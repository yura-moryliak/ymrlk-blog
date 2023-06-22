import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private isPlatformBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  saveData(key: string, value: string): void {
    if (this.isPlatformBrowser) {
      localStorage.setItem(key, value);
    }
  }

  getData(key: string): string | undefined {
    if (!this.isPlatformBrowser) {
      return;
    }

    return localStorage.getItem(key) as string;
  }

  removeData(key: string): void {
    localStorage.removeItem(key);
  }

  clearData(): void {
    localStorage.clear();
  }
}
