import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import {BehaviorSubject, catchError, Observable, of, switchMap, tap, throwError} from 'rxjs';

import jwtDecode from 'jwt-decode';

import {environment} from '../../../environments/environment.development';
import {AuthTokensInterface} from '../interfaces/auth/auth-tokens.interface';
import {AuthCredentialsInterface} from '../interfaces/auth/auth-credentials.interface';
import {LocalStorageService} from './local-storage.service';
import {RegisterCredentialsInterface} from '../interfaces/register-form.interface';

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const USER_UUID_KEY = 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }


  login(credentials: AuthCredentialsInterface): Observable<boolean | null> {
    return this.httpClient.post<AuthTokensInterface>(`${ environment.api.baseUrl }/auth/login`, credentials, {withCredentials: true}).pipe(
      switchMap((tokens: AuthTokensInterface) => {
        this.doLogin(tokens);

        const decodedJwt: any = jwtDecode(tokens.accessToken);
        this.localStorageService.saveData(USER_UUID_KEY, decodedJwt[USER_UUID_KEY]);

        return of(true);
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('AuthService:Login->ERROR: ', error);
        return throwError(error.error);
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

  register(credentials: RegisterCredentialsInterface): Observable<any> {
    return this.httpClient.post(`${ environment.api.baseUrl }/users/register`, credentials);
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
    return <string>this.localStorageService.getData(REFRESH_TOKEN_KEY);
  }

  private storeTokens(tokens: AuthTokensInterface): void {
    this.localStorageService.saveData(ACCESS_TOKEN_KEY, tokens.accessToken);
    this.localStorageService.saveData(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  private removeTokens(): void {
    this.localStorageService.removeData(ACCESS_TOKEN_KEY);
    this.localStorageService.removeData(USER_UUID_KEY);
    this.localStorageService.removeData(REFRESH_TOKEN_KEY);
  }
}
