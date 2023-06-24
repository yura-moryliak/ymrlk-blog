import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

import {Observable, of, switchMap} from 'rxjs';

import {AuthService} from '../services/auth.service';

export const loggedInGuard: CanActivateFn = (): Observable<boolean> | Promise<boolean> | boolean => {

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isLoggedIn$.pipe(
    switchMap((isLoggedIn: boolean): Observable<boolean> => {

      if (isLoggedIn) {
        router.navigate(['']).catch((error) => console.log('loggedInGuard => Navigate error: ', error));
        return of(false)
      } else {
        return of(true);
      }
    })
  )
};
