import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common';

import {BehaviorSubject, catchError, Observable, of, switchMap, tap, throwError} from 'rxjs';

import {environment} from '../../../environments/environment.development';
import {AuthTokensInterface} from '../interfaces/auth/auth-tokens.interface';
import {AuthCredentialsInterface} from '../interfaces/auth/auth-credentials.interface';
import {AuthProfileCredentialsInterface} from '../interfaces/auth/auth-profile-creentials.interface';
import {LocalStorageService} from './local-storage.service';
import {CookieService} from 'ngx-cookie-service';
// import {CookieService} from './cookie.service';

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const USER_UUID_KEY = 'user-uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isPlatformBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }


  login(credentials: AuthCredentialsInterface): Observable<boolean | null> {
    return this.httpClient.post<AuthTokensInterface>(`${ environment.api.baseUrl }/auth/login`, credentials, {withCredentials: true}).pipe(
      switchMap((tokens: AuthTokensInterface) => {
        this.doLogin(tokens);
        return this.getCurrentUserUUID();
      })
    )
  }

  logOut(): void {
    this.doLogoutUser();
  }

  updateLoggedInStatus(isLoggedIn = false): void {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  refreshToken(): Observable<AuthTokensInterface> {
    return this.httpClient.post<AuthTokensInterface>(`${ environment.api.baseUrl }/auth/refresh`, {
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap((tokens: AuthTokensInterface) => this.storeTokens(tokens)),
      catchError((error) => {
        this.doLogoutUser();
        return throwError(error);
      })
    )
  }

  getAccessToken = (): string => this.localStorageService.getData(ACCESS_TOKEN_KEY) as string;

  register(): void {
    console.log('Register');
  }

  private getCurrentUserUUID(): Observable<boolean> {
    return this.httpClient.get<AuthProfileCredentialsInterface>(`${ environment.api.baseUrl }/users/profile`).pipe(
      switchMap((profileCredentials: AuthProfileCredentialsInterface) => {

        this.localStorageService.saveData(USER_UUID_KEY, profileCredentials.uuid);
        return of(true);
      }),
      catchError((error) => {
        console.log('AuthService:Login->Profile:ERROR: ', error);
        return throwError(error);
      })
    )
  }

  private doLogin(tokens: AuthTokensInterface): void {
    this.updateLoggedInStatus(true);
    this.storeTokens(tokens);
  }

  private doLogoutUser(): void {
    this.updateLoggedInStatus(false);
    this.removeTokens();

    this.router.navigate(['/']).catch((error) => console.log('Logout error: ', error));
  }

  private getRefreshToken(): string {
    return <string>this.cookieService.get(REFRESH_TOKEN_KEY);
  }

  private storeTokens(tokens: AuthTokensInterface): void {
    this.localStorageService.saveData(ACCESS_TOKEN_KEY, tokens.accessToken);

    if (this.isPlatformBrowser) {
      this.cookieService.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
        expires: environment.tokens.refresh.expiresIn,
        path: environment.tokens.refresh.path,
        domain: environment.tokens.refresh.domain,
        secure: environment.tokens.refresh.httpOnly,
        sameSite: 'Strict'
      });
    }
  }

  private removeTokens(): void {
    this.localStorageService.removeData(ACCESS_TOKEN_KEY);
    this.localStorageService.removeData(USER_UUID_KEY);

    if (this.isPlatformBrowser) {
      this.cookieService.delete(REFRESH_TOKEN_KEY);
    }
  }
}
