import {Component, inject, Input, OnDestroy, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {Subscription} from 'rxjs';

import {ToastrService} from 'ngx-toastr';

import {AccountBase} from '../../account.base';
import {UserInterface} from '../../../core/interfaces/user/user.interface';
import {EnvConfigsInterface} from '../../../core/interfaces/env-configs.interface';
import {UsersService} from '../../../core/services/users.service';
import {environment} from '../../../../environments/environment.development';
import {LoaderComponent} from '../../../core/shared-components/loader/loader.component';
import {LoaderService} from '../../../core/shared-components/loader/services/loader.service';
import {AccountGeneralInfoFormInterface} from '../../interfaces/account-general-info-form.interface';

@Component({
  selector: 'ym-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
})
export class GeneralInfoComponent extends AccountBase<AccountGeneralInfoFormInterface> implements OnDestroy {

  env: EnvConfigsInterface = environment;

  private usersService: UsersService = inject(UsersService);
  private toastService: ToastrService = inject(ToastrService);
  private loaderService: LoaderService = inject(LoaderService);

  private oldFormState!: UserInterface;
  private subscriptions: Subscription = new Subscription();

  saveChanges(): void {
    this.loaderService.show();
    this.usersService.updateProfile(this.form.value as Partial<UserInterface>).subscribe({
      next: (userState: UserInterface): void => {
        this.usersService.updateUserState(userState);
        this.toastService.success(`General info for ${ userState.firstName } ${ userState.lastName } was successfully updated`, 'Update profile');
        this.loaderService.hide();
      },
      error: () => {
        this.toastService.error('Something went wrong while updating profile', 'Update profile');
        this.form.reset(this.oldFormState);
        this.loaderService.hide();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
