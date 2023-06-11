import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import {BehaviorSubject, catchError, Observable, of, switchMap, throwError} from 'rxjs';

import {LocalStorageService} from './local-storage.service';
import {UserInterface} from '../interfaces/user/user.interface';
import {USER_UUID_KEY} from './auth.service';
import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  get userState$(): Observable<UserInterface> {
    return this.userStateSubject.asObservable();
  }

  private httpClient: HttpClient = inject(HttpClient);
  private localStorageService: LocalStorageService = inject(LocalStorageService);

  private userStateSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  getUserByUUID(): Observable<UserInterface | null> {
    return this.httpClient.get(`${ environment.api.baseUrl }/users/uuid/${ this.localStorageService.getData(USER_UUID_KEY) }`).pipe(
      switchMap((user: UserInterface) => {
        this.userStateSubject.next(user);
        return of(user);
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('UsersService:getUserByUUID->ERROR: ', error);
        return throwError(error.error);
      })
    )
  }

}
