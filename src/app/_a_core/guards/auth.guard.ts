import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

import {Observable, of, switchMap} from 'rxjs';

import {AuthService} from '../services/auth.service';

export const authGuard: CanActivateFn = (): Observable<boolean> | Promise<boolean> | boolean => {

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isLoggedIn$.pipe(switchMap((isLoggedIn: boolean) => {
    if (isLoggedIn) {
      return of(isLoggedIn);
    } else {
      router.navigate(['']).catch((error) => console.log('AuthGuard:IsLoggedIn->ERROR: ', error));
      return of(isLoggedIn);
    }
  }));
};
