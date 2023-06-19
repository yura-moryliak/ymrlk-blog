import {Component, inject, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

import {Subscription} from 'rxjs';

import {ToastrService} from 'ngx-toastr';

import {AuthService} from '../core/services/auth.service';
import {RegisterCredentialsInterface, RegisterFormInterface} from "../core/interfaces/register-form.interface";
import {LoaderComponent} from '../core/shared-components/loader/loader.component';
import {passwordMatchValidator} from '../core/validators/password-match.validator';
import {FormControlInputComponent} from '../core/form-control-input/form-control-input.component';
import {
  ControlValidationComponent
} from '../core/form-control-input/components/control-validation/control-validation.component';
import {LoaderInitializerComponent} from '../core/shared-components/loader/loader-initializer';

@Component({
  selector: 'ym-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoaderComponent, FormControlInputComponent, ControlValidationComponent]
})
export class RegisterComponent extends LoaderInitializerComponent {

  form: FormGroup<RegisterFormInterface> = new FormGroup<RegisterFormInterface>({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.email
    ])),
    password: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
      passwordMatchValidator('confirmPassword', true)
    ])),
    confirmPassword: new FormControl('', Validators.compose([
      Validators.required,
      passwordMatchValidator('password')
    ]))
  });

  isFormPending = false;

  private authService: AuthService = inject(AuthService);
  private toastService: ToastrService = inject(ToastrService);
  // private loaderService: LoaderService = inject(LoaderService);

  private subscriptions: Subscription = new Subscription();

  register(): void {

    if (this.isFormPending) {
      return;
    }

    this.isFormPending = true;
    this.showLoader();

    const registerSubscription: Subscription = this.authService.register(this.form.value as RegisterCredentialsInterface).subscribe({
      next: (response): void => {
        if (response) {
          this.toastService.success('Account was created successfully', 'Register');
          this.form.reset();
          this.hideLoader();
          this.isFormPending = false;
        }
      },
      error: (): void => {
        this.toastService.error('Something went wrong while registering ', 'Register');
        this.form.reset();
        this.hideLoader();
        this.isFormPending = false;
      }
    });

    this.subscriptions.add(registerSubscription);
  }
}
