import {inject} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpStatusCode} from '@angular/common/http';

import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';

import {AuthService} from '../services/auth.service';
import {AuthTokensInterface} from '../interfaces/auth/auth-tokens.interface';

let isRefreshing: boolean = false;
const refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

export const authInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

  const authService: AuthService = inject(AuthService);

  if (authService.getAccessToken()) {
    request = addToken(request, authService.getAccessToken());
  }

  return next(request).pipe(
    catchError((error)=> {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized;

      return isUnauthorized ?
        handleUnauthorizedError(request, next, authService) :
        throwError(error);
    })
  ) as Observable<HttpEvent<unknown>>;
}

const addToken = (request: HttpRequest<any>, token: string): HttpRequest<unknown> => (
  request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
);

const handleUnauthorizedError = (request: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService): Observable<unknown> => (
  isRefreshing ? updateCurrentRefresh(request, next) : initRefreshToken(request, next, authService)
);

const initRefreshToken = (request: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<any>> => {
  isRefreshing = true;
  refreshTokenSubject.next('');

  return authService.refreshToken().pipe(
    switchMap((tokens: AuthTokensInterface) => {
      isRefreshing = true;
      refreshTokenSubject.next(tokens.refreshToken);

      return next(addToken(request, tokens.accessToken));
    })
  )
}

const updateCurrentRefresh = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> => (
  refreshTokenSubject.pipe(
    filter((token: string) => token != null),
    take(1),
    switchMap((jwt: string) => next(addToken(request, jwt))))
);
