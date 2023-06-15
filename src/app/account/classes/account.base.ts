import {Component, Input, OnDestroy} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';

import {Subscription} from 'rxjs';

import {UserInterface} from '../../core/interfaces/user/user.interface';

@Component({
  selector: 'ym-account-base',
  template: ''
})
export abstract class AccountBase<TControl extends {[K in keyof TControl]: AbstractControl<any>} = any> implements OnDestroy {

  @Input() set data(data: { user: UserInterface }) {
    if (!data) {
      return;
    }

    this.user = data.user;
    this.populateForm();
  }

  user!: UserInterface;
  form!: FormGroup<TControl>;

  protected abstract populateForm(): void;
  protected abstract saveChanges(): void;

  protected subscriptions: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
