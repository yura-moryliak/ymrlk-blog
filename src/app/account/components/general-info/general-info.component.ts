import {Component, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogRef} from '@angular/cdk/dialog';

import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {lastValueFrom, Subscription} from 'rxjs';

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
import {WarningDialogComponent} from '../../dialogs/warning-dialog/warning-dialog.component';
import {WarningDialogInterface} from '../../interfaces/warning-dialog.interface';

@Component({
  selector: 'ym-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, FormControlInputComponent, ControlValidationComponent],
})
export class GeneralInfoComponent extends AccountBaseComponent<AccountGeneralInfoFormInterface>
  implements WarningDialogInterface<any, WarningDialogComponent> {

  @ViewChild('warningDialogContent', { static: true, read: TemplateRef })
  warningDialogContent!: TemplateRef<any>;

  env: EnvConfigsInterface = environment;

  private oldFormState!: UserInterface;
  private dialogRef!: DialogRef<any, WarningDialogComponent>;

  protected async saveChanges(): Promise<void> {

    if (this.isFormPending) {
      return;
    }

    const emailChanged = this.form.value.email !== this.oldFormState.email;

    if (!emailChanged) {
      return this.processSavingForm();
    }

    await this.processWarningDialog();
  }

  openWarningDialog(): DialogRef<any, WarningDialogComponent> {
    return this.dialogService.open(WarningDialogComponent, {
      width: '550px',
      maxWidth: '90vw',
      height: '300px',
      closeOnDestroy: true,
      closeOnNavigation: true,
      closeOnOverlayDetachments: true,
      disableClose: true,
      data: {
        label: 'Email change warning!',
        content: this.warningDialogContent
      },
      panelClass: 'ym-dialog-common-wrapper'
    });
  }

  protected populateForm(): void {
    this.form = new FormGroup<AccountGeneralInfoFormInterface>({
      firstName: new FormControl(this.user.firstName || '', Validators.required),
      lastName: new FormControl(this.user.lastName || '', Validators.required),
      email: new FormControl(this.user.email || '', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      phoneNumber: new FormControl(this.user.phoneNumber || ''),
      subdomain: new FormControl({ value: this.user.subdomain || '', disabled: true })
    });
    this.oldFormState = { ...this.form.value } as Partial<UserInterface>;
  }

  private processSavingForm(): void {
    this.isFormPending = true;
    this.showLoader();

    const updateProfileSubscription: Subscription = this.usersService.updateProfile(this.form.value as Partial<UserInterface>).subscribe({
      next: (userState: UserInterface): void => {

        if (userState.email !== this.oldFormState.email) {
          this.authService.logOut();
          this.toastService.info('Email was successfully changed. Please login once again', 'Email change');
          return;
        }

        this.usersService.updateUserState(userState);
        this.toastService.success(`General info for ${ userState.firstName } ${ userState.lastName } was successfully updated`, 'Update profile');
        this.hideLoader();
        this.isFormPending = false;
      },
      error: (): void => {
        this.toastService.error('Something went wrong while updating profile', 'Update profile');
        this.form.reset(this.oldFormState);
        this.hideLoader();
        this.isFormPending = false;
      }
    });

    this.subscriptions.add(updateProfileSubscription);
  }

  private async processWarningDialog(): Promise<void> {
    this.dialogRef = this.openWarningDialog();

    const proceedChange = await lastValueFrom(this.dialogRef.closed)

    if (!proceedChange) {
      this.form.controls.email.reset(this.oldFormState.email);
      return;
    }

    this.processSavingForm();
  }
}
