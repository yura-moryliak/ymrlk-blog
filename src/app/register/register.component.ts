import {Component, inject, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpErrorResponse} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

import {Subscription} from 'rxjs';

import {ToastrService} from 'ngx-toastr';

import {AuthService} from '../core/services/auth.service';
import {RegisterCredentialsInterface, RegisterFormInterface} from "../core/interfaces/register-form.interface";
import {passwordMatchValidator} from '../core/validators/password-match.validator';
import {LoaderComponent} from '../core/shared-components/loader/loader.component';
import {LoaderService} from '../core/shared-components/loader/services/loader.service';

@Component({
  selector: 'ym-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoaderComponent]
})
export class RegisterComponent {

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

  private authService: AuthService = inject(AuthService);
  private toastService: ToastrService = inject(ToastrService);
  private loaderService: LoaderService = inject(LoaderService);

  private subscriptions: Subscription = new Subscription();

  register(): void {

    this.loaderService.show();

    const registerSubscription: Subscription = this.authService.register(this.form.value as RegisterCredentialsInterface).subscribe({
      next: (response): void => {
        if (response) {
          this.toastService.success('Account was created successfully', 'Register successful');
          this.form.reset();
          this.loaderService.hide();
        }
      },
      error: (error: HttpErrorResponse): void => {
        this.toastService.error(error.error.message, 'Register failure');
        this.form.reset();
        this.loaderService.hide();
      }
    });

    this.subscriptions.add(registerSubscription);
  }
}
