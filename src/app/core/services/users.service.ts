import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {BehaviorSubject, Observable, of, switchMap} from 'rxjs';

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
      })
    )
  }

  updateUserState(userState: UserInterface): void {
    this.userStateSubject.next(userState);
  }

  updateProfile(model: Partial<UserInterface>): Observable<UserInterface> {
    return this.httpClient.put(`${ environment.api.baseUrl }/users/profile/update`, {
      uuid: this.localStorageService.getData(USER_UUID_KEY),
      model
    });
  }

  uploadProfileAvatar(file: File): Observable<UserInterface> {
    const formData: FormData = new FormData();

    formData.append('avatar', file);
    formData.append('uuid', <string>this.localStorageService.getData(USER_UUID_KEY));

    return this.httpClient.post(`${ environment.api.baseUrl }/users/profile/upload-avatar`, formData);
  }

  deleteProfileAvatar(avatarSrc: string): Observable<UserInterface> {
    return this.httpClient.post(`${ environment.api.baseUrl }/users/profile/delete-avatar`, {
      uuid: this.localStorageService.getData(USER_UUID_KEY),
      fileName: avatarSrc.split('/')[avatarSrc.split('/').length - 1]
    })
  }
}
