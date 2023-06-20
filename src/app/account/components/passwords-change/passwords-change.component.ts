import {Component, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DialogRef} from '@angular/cdk/dialog';

import {lastValueFrom, Subscription} from 'rxjs';

import {AccountBaseComponent} from '../../classes/account.base';
import {AccountPasswordChangeFormInterface} from '../../interfaces/account-password-change-form.interface';
import {AvatarComponent} from '../../../core/shared-components/avatar/avatar.component';
import {LoaderComponent} from '../../../core/shared-components/loader/loader.component';
import {FormControlInputComponent} from '../../../core/form-control-input/form-control-input.component';
import {
  ControlValidationComponent
} from '../../../core/form-control-input/components/control-validation/control-validation.component';
import {WarningDialogInterface} from '../../interfaces/warning-dialog.interface';
import {WarningDialogComponent} from '../../dialogs/warning-dialog/warning-dialog.component';

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
  imports: [CommonModule, AvatarComponent, FormsModule, LoaderComponent, ReactiveFormsModule, FormControlInputComponent, ControlValidationComponent],
})
export class PasswordsChangeComponent extends AccountBaseComponent<AccountPasswordChangeFormInterface>
  implements WarningDialogInterface<any, WarningDialogComponent> {

  @ViewChild('warningDialogContent', { static: true, read: TemplateRef })
  warningDialogContent!: TemplateRef<any>;

  private dialogRef!: DialogRef<any, WarningDialogComponent>;

  protected async saveChanges(): Promise<void> {

    if (this.isFormPending) {
      return;
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
    this.form = new FormGroup<AccountPasswordChangeFormInterface>({
      oldPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
      newPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
      ]))
    });
  }

  private handlePasswordChange(isChanged: boolean): void {
    if (!isChanged) {
      this.hideLoader();
      this.toastService.error('Make sure you provide correct passwords', 'Password change');
      return;
    }

    this.hideLoader();
    this.authService.logOut();
    this.toastService.info('Password was successfully changed. Please login once again', 'Password change');
  }

  private async processWarningDialog(): Promise<void> {
    this.dialogRef = this.openWarningDialog();

    const proceedChange = await lastValueFrom(this.dialogRef.closed)

    if (!proceedChange) {
      return this.form.reset();
    }

    this.processSavingForm();
  }

  private processSavingForm(): void {
    this.isFormPending = true;
    this.showLoader();

    const passwordChangeSubscription: Subscription = this.usersService.changePassword(this.form.value as AccountPasswordsFormValue).subscribe({
      next: (isChanged: boolean): void => {
        this.handlePasswordChange(isChanged);
      },
      error: (): void => {
        this.toastService.info('Something went wrong while changing password', 'Password change');
        this.hideLoader();
      }
    })

    this.subscriptions.add(passwordChangeSubscription);
  }
}
