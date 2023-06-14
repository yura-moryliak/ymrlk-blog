import {Component, Input} from '@angular/core';
import {UserInterface} from '../core/interfaces/user/user.interface';
import {AbstractControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'ym-account-base',
  template: ''
})
export abstract class AccountBase<TControl extends {[K in keyof TControl]: AbstractControl<any>} = any>  {

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

}
