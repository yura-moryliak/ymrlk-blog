import {Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {Subscription} from 'rxjs';

import {AccountBaseComponent} from '../../classes/account.base';
import {UserInterface} from '../../../core/interfaces/user/user.interface';
import {EnvConfigsInterface} from '../../../core/interfaces/env-configs.interface';
import {environment} from '../../../../environments/environment.development';
import {LoaderComponent} from '../../../core/shared-components/loader/loader.component';
import {AccountGeneralInfoFormInterface} from '../../interfaces/account-general-info-form.interface';
import {FormControlInputComponent} from '../../../core/form-control-input/form-control-input.component';
import {
  ControlValidationComponent
} from '../../../core/form-control-input/components/control-validation/control-validation.component';

@Component({
  selector: 'ym-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, FormControlInputComponent, ControlValidationComponent],
})
export class GeneralInfoComponent extends AccountBaseComponent<AccountGeneralInfoFormInterface> implements OnDestroy {

  env: EnvConfigsInterface = environment;

  private oldFormState!: UserInterface;

  protected saveChanges(): void {
    this.loaderService.show();

    const updateProfileSubscription: Subscription = this.usersService.updateProfile(this.form.value as Partial<UserInterface>).subscribe({
      next: (userState: UserInterface): void => {
        this.usersService.updateUserState(userState);
        this.toastService.success(`General info for ${ userState.firstName } ${ userState.lastName } was successfully updated`, 'Update profile');
        this.loaderService.hide();
      },
      error: (): void => {
        this.toastService.error('Something went wrong while updating profile', 'Update profile');
        this.form.reset(this.oldFormState);
        this.loaderService.hide();
      }
    });

    this.subscriptions.add(updateProfileSubscription);
  }

  protected populateForm(): void {
    this.form = new FormGroup<AccountGeneralInfoFormInterface>({
      firstName: new FormControl(this.user.firstName || '', Validators.required),
      lastName: new FormControl(this.user.lastName || '', Validators.required),
      email: new FormControl(this.user.email || '', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      subdomain: new FormControl(this.user.subdomain || '')
    });
    this.oldFormState = { ...this.form.value } as Partial<UserInterface>;
  }
}
