import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';

import {Observable, of, switchMap} from 'rxjs';

import {AuthService} from '../services/auth.service';

export const authGuard: CanActivateFn = (): Observable<boolean> | Promise<boolean> | boolean =>
  inject(AuthService).isLoggedIn$.pipe(switchMap((isLoggedIn: boolean) => of(isLoggedIn)));
