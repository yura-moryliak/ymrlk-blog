import {Component, inject, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {Subscription} from 'rxjs';

import {ToastrService} from 'ngx-toastr';

import {UserInterface} from '../../../core/interfaces/user/user.interface';
import {EnvConfigsInterface} from '../../../core/interfaces/env-configs.interface';
import {UsersService} from '../../../core/services/users.service';
import {environment} from '../../../../environments/environment.development';

export interface AccountGeneralInfoFormInterface {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  subdomain: FormControl<string | null>;
}

@Component({
  selector: 'ym-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class GeneralInfoComponent implements OnInit, OnDestroy {

  @Input() set data(data: { user: UserInterface }) {
    if (!data) {
      return;
    }

    this.user = data.user;
    this.populateForm();
  };

  user!: UserInterface;
  env: EnvConfigsInterface = environment;
  form!: FormGroup<AccountGeneralInfoFormInterface>;

  private usersService: UsersService = inject(UsersService);
  private toastService: ToastrService = inject(ToastrService);

  private oldFormState!: UserInterface;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const formValueChangesSubscription: Subscription = this.form.valueChanges.subscribe((changes) => {
      console.log('Track changes for detecting navigation: ', changes);
    });

    this.subscriptions.add(formValueChangesSubscription);
  }

  saveChanges(): void {
    this.usersService.updateProfile(this.form.value as Partial<UserInterface>).subscribe({
      next: (userState: UserInterface): void => {
        this.usersService.updateUserState(userState);
        this.toastService.success(`General info for ${ userState.firstName } ${ userState.lastName } was successfully updated`, 'Update profile successful');
      },
      error: () => {
        this.toastService.error('Something went wrong while updating profile', 'Update profile failure');
        this.form.reset(this.oldFormState);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private populateForm(): void {
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
