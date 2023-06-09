import {Component, inject, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpErrorResponse} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

import {Subscription} from 'rxjs';

import {AuthService} from '../core/services/auth.service';
import {RegisterCredentialsInterface, RegisterFormInterface} from "../core/interfaces/register-form.interface";
import {passwordMatchValidator} from '../core/validators/password-match.validator';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ym-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent {

  form: FormGroup<RegisterFormInterface> = new FormGroup<RegisterFormInterface>({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    subdomain: new FormControl(''),
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

  private subscriptions: Subscription = new Subscription();

  register(): void {
    const registerSubscription: Subscription = this.authService.register(this.form.value as RegisterCredentialsInterface).subscribe({
      next: (response) => response && this.toastService.success('Account was created successfully', 'Register successful'),
      error: (error: HttpErrorResponse) => this.toastService.error(error.error.message, 'Register failure')
    });

    this.subscriptions.add(registerSubscription);
  }
}
