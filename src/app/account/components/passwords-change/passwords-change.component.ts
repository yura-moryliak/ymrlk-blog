import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import {Subscription} from 'rxjs';

import {AccountBaseComponent} from '../../classes/account.base';
import {AccountPasswordChangeFormInterface} from '../../interfaces/account-password-change-form.interface';
import {AvatarComponent} from '../../../core/shared-components/avatar/avatar.component';
import {LoaderComponent} from '../../../core/shared-components/loader/loader.component';

export type AccountPasswordsFormValue = {
  oldPassword: string;
  newPassword: string
}

@Component({
  selector: 'ym-passwords-change',
  templateUrl: './passwords-change.component.html',
  styleUrls: ['./passwords-change.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, AvatarComponent, FormsModule, LoaderComponent, ReactiveFormsModule],
})
export class PasswordsChangeComponent extends AccountBaseComponent<AccountPasswordChangeFormInterface> {

  protected saveChanges(): void {
    this.loaderService.show();

    const passwordChangeSubscription: Subscription = this.usersService.changePassword(this.form.value as AccountPasswordsFormValue).subscribe({
      next: (isChanged: boolean): void => {
        this.handlePasswordChange(isChanged);
      },
      error: (): void => {
        this.toastService.info('Something went wrong while changing password', 'Password change');
        this.loaderService.hide();
      }
    })

    this.subscriptions.add(passwordChangeSubscription);
  }

  protected populateForm(): void {
    this.form = new FormGroup<AccountPasswordChangeFormInterface>({
      oldPassword: new FormControl(''),
      newPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
      ]))
    });
  }

  private handlePasswordChange(isChanged: boolean): void {
    if (!isChanged) {
      this.loaderService.hide();
      this.toastService.error('Make sure you provide correct passwords', 'Password change');
      return;
    }

    this.loaderService.hide();
    this.authService.logOut();
    this.toastService.info('Password was successfully changed. Please login once again', 'Password change');
  }
}
