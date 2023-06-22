import {Component, inject, Input, OnDestroy} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {Dialog} from '@angular/cdk/dialog';

import {Subscription} from 'rxjs';

import {ToastrService} from 'ngx-toastr';

import {UserInterface} from '../../_a_core/interfaces/user/user.interface';
import {UsersService} from '../../_a_core/services/users.service';
import {AuthService} from '../../_a_core/services/auth.service';
import {LoaderInitializerComponent} from '../../_a_core/shared-components/loader/loader-initializer';

@Component({
  selector: 'ym-account-base',
  template: ''
})
export abstract class AccountBaseComponent<TControl extends {[K in keyof TControl]: AbstractControl<any>} = any> extends LoaderInitializerComponent implements OnDestroy {

  @Input() set data(data: { user: UserInterface }) {
    if (!data) {
      return;
    }

    this.user = data.user;
    this.populateForm();
  }

  user!: UserInterface;
  form!: FormGroup<TControl>;

  protected isFormPending = false;

  protected authService: AuthService = inject(AuthService);
  protected toastService: ToastrService = inject(ToastrService);
  protected usersService: UsersService = inject(UsersService);
  protected dialogService: Dialog = inject(Dialog);

  protected abstract populateForm(): void;
  protected abstract saveChanges(): void;

  protected subscriptions: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
