import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DialogRef} from '@angular/cdk/dialog';

import {ToastrService} from 'ngx-toastr';

import {RegisterFormInterface} from '../../../interfaces/register-form.interface';
import {FormControlInputComponent} from '../../../form-control-input/form-control-input.component';
import {
  ControlValidationComponent
} from '../../../form-control-input/components/control-validation/control-validation.component';

type ResetPasswordFormEmailControlType = Pick<RegisterFormInterface, 'email'>;

@Component({
  selector: 'ym-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormControlInputComponent, ControlValidationComponent]
})
export class ForgotPasswordDialogComponent {

  form: FormGroup<ResetPasswordFormEmailControlType> = new FormGroup<ResetPasswordFormEmailControlType>({
    email: new FormControl<string | null>('', Validators.compose([
      Validators.required,
      Validators.email
    ]))
  });

  private dialogRef: DialogRef = inject(DialogRef);
  private toastService: ToastrService = inject(ToastrService);

  resetPassword(): void {
    this.toastService.warning('NOT YET IMPLEMENTED', 'Reset password');
    this.form.reset();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
