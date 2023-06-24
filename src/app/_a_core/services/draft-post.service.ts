import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

import {LocalStorageService} from './local-storage.service';

export const DRAFT_KEY = 'draft';

export interface DraftPostInterface {
  isDraft: boolean;
  content: any;
}

@Injectable({
  providedIn: 'root'
})
export class DraftPostService {

  get hasDraft$(): Observable<boolean> {
    return this.hasDraftSubject.asObservable();
  }

  private draftModel: DraftPostInterface = {
    isDraft: false,
    content: null
  };
  private hasDraftSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private localStorageService: LocalStorageService = inject(LocalStorageService);

  constructor() {
    this.hasDraftSubject.next(!!this.localStorageService.getData(DRAFT_KEY));
  }

  init(): DraftPostInterface {

    if (!this.localStorageService.getData(DRAFT_KEY)) {
      return this.draftModel;
    }

    const draft: DraftPostInterface = JSON.parse(this.localStorageService.getData(DRAFT_KEY) as string);

    this.draftModel.isDraft = draft.isDraft;
    this.draftModel.content = JSON.parse(draft.content);

    return this.draftModel;
  }

  save(data: any): void {
    this.draftModel.content = JSON.stringify(data);
    this.draftModel.isDraft = true;
    this.hasDraftSubject.next(true);

    this.localStorageService.saveData(DRAFT_KEY, JSON.stringify(this.draftModel));
  }

  remove(): DraftPostInterface {
    this.localStorageService.removeData(DRAFT_KEY);
    this.draftModel.isDraft = false;
    this.draftModel.content = null;
    this.hasDraftSubject.next(false);

    return this.draftModel;
  }
}
