import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';

import {catchError, Observable, of, switchMap} from 'rxjs';

import {UserInterface} from '../interfaces/user/user.interface';
import {UsersService} from '../services/users.service';

export const publicProfileGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {

  const usersService: UsersService = inject(UsersService);
  const router: Router = inject(Router);

  return usersService.getUserByUUIDOrSubdomain(route.params['profileUUIDOrSubdomain']).pipe(
    catchError((error: HttpErrorResponse): Observable<boolean> => {

      if (error && error.status === HttpStatusCode.NotFound) {
        router.navigate(['/404']).catch((e) => console.log('publicProfileGuard => Navigate error: ', e));
        return of(false);
      }

      return of(true);
    }),
    switchMap((user: boolean | UserInterface | null) =>
      !user ? of(false) : of(true)
    )
  )
};
