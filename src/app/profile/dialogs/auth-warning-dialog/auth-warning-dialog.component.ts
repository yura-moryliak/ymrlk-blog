import {CommonModule} from '@angular/common';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Component, inject, OnDestroy, ViewEncapsulation} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {DialogRef} from '@angular/cdk/dialog';
import {Router} from '@angular/router';

import {Subscription} from 'rxjs';

import {ToastrService} from 'ngx-toastr';

import {
  ControlValidationComponent
} from '../../../core/form-control-input/components/control-validation/control-validation.component';
import {FormControlInputComponent} from '../../../core/form-control-input/form-control-input.component';
import {sharedLoginForm} from '../../../login/components/shared-login-form';
import {LoginFormInterface} from '../../../core/interfaces/login-form.interface';
import {AuthService} from '../../../core/services/auth.service';
import {AuthCredentialsInterface} from '../../../core/interfaces/auth/auth-credentials.interface';
import {LoaderInitializerComponent} from '../../../core/shared-components/loader/loader-initializer';
import {LoaderComponent} from '../../../core/shared-components/loader/loader.component';

@Component({
  selector: 'ym-auth-warning-dialog',
  templateUrl: './auth-warning-dialog.component.html',
  styleUrls: ['./auth-warning-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ControlValidationComponent, FormControlInputComponent, FormsModule, ReactiveFormsModule, LoaderComponent],
})
export class AuthWarningDialogComponent extends LoaderInitializerComponent implements  OnDestroy {

  form: FormGroup<LoginFormInterface> = sharedLoginForm;

  isFormPending = false;

  private dialogRef: DialogRef = inject(DialogRef);

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private toastService: ToastrService = inject(ToastrService);

  private subscriptions: Subscription = new Subscription();

  login(): void {

    if (this.isFormPending) {
      return;
    }

    this.isFormPending = true;
    this.showLoader();

    const loginSubscription: Subscription = this.authService.login(this.form.value as AuthCredentialsInterface)
      .subscribe({
        next: (isLoggedIn: boolean | null): void => {
          if (isLoggedIn) {
            this.router.navigate([this.router.url]).catch((error) => console.log(error));
            this.toastService.success('You are successfully logged in', 'Login');
            this.form.reset();
            this.hideLoader();
            this.isFormPending = false;
            this.dialogRef.close(true);
          }
        },
        error: (error: HttpErrorResponse): void => {
          this.toastService.error(error.message, 'Login');
          this.form.reset();
          this.hideLoader();
          this.isFormPending = false;
        }
      });

    this.subscriptions.add(loginSubscription);
  }

  closeDialog(event: Event): void {
    event.preventDefault();
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
