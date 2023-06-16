import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Component, inject, OnDestroy, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpErrorResponse} from '@angular/common/http';
import {Dialog} from '@angular/cdk/dialog';

import {Subscription} from 'rxjs';

import {ToastrService} from 'ngx-toastr';

import {AuthService} from '../core/services/auth.service';
import {LoginFormInterface} from '../core/interfaces/login-form.interface';
import {AuthCredentialsInterface} from '../core/interfaces/auth/auth-credentials.interface';
import {LoaderComponent} from '../core/shared-components/loader/loader.component';
import {LoaderService} from '../core/shared-components/loader/services/loader.service';
import {ForgotPasswordDialogComponent} from './components/forgot-password-dialog/forgot-password-dialog.component';
import {FormControlInputComponent} from '../core/form-control-input/form-control-input.component';
import {
  ControlValidationComponent
} from '../core/form-control-input/components/control-validation/control-validation.component';

@Component({
  selector: 'ym-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoaderComponent, FormControlInputComponent, ControlValidationComponent]
})
export class LoginComponent implements OnDestroy {

  form: FormGroup<LoginFormInterface> = new FormGroup<LoginFormInterface>({
    email: new FormControl('', Validators.compose([Validators.email, Validators.required])),
    password: new FormControl('', Validators.required)
  });

  isFormPending = false;

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private toastService: ToastrService = inject(ToastrService);
  private loaderService: LoaderService = inject(LoaderService);
  private dialogService: Dialog = inject(Dialog);

  private subscriptions: Subscription = new Subscription();

  login(): void {

    if (this.isFormPending) {
      return;
    }

    this.isFormPending = true;
    this.loaderService.show();

    const loginSubscription: Subscription = this.authService.login(this.form.value as AuthCredentialsInterface)
      .subscribe({
        next: (isLoggedIn: boolean | null): void => {
          if (isLoggedIn) {
            this.router.navigate(['/']).catch((error) => console.log(error));
            this.toastService.success('You are successfully logged in', 'Login');
            this.form.reset();
            this.loaderService.hide();
            this.isFormPending = false;
          }
        },
        error: (error: HttpErrorResponse): void => {
          this.toastService.error(error.message, 'Login');
          this.form.reset();
          this.loaderService.hide();
          this.isFormPending = false;
        }
      });

    this.subscriptions.add(loginSubscription);
  }

  openForgotPasswordDialog(): void {
    this.dialogService.open(ForgotPasswordDialogComponent, {
      width: '550px',
      maxWidth: '90vw',
      height: '500px',
      closeOnDestroy: true,
      closeOnNavigation: true,
      closeOnOverlayDetachments: true,
      panelClass: 'ym-dialog-common-wrapper'
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
