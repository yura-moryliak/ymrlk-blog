import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Component, inject, OnDestroy, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpErrorResponse} from '@angular/common/http';

import {Subscription} from 'rxjs';

import {ToastrService} from 'ngx-toastr';

import {AuthService} from '../core/services/auth.service';
import {LoginFormInterface} from '../core/interfaces/login-form.interface';
import {AuthCredentialsInterface} from '../core/interfaces/auth/auth-credentials.interface';

@Component({
  selector: 'ym-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent implements OnDestroy {

  form: FormGroup<LoginFormInterface> = new FormGroup<LoginFormInterface>({
    email: new FormControl('', Validators.compose([Validators.email, Validators.required])),
    password: new FormControl('', Validators.required)
  });

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private toastService: ToastrService = inject(ToastrService);

  private subscriptions: Subscription = new Subscription();

  login(): void {
    const loginSubscription: Subscription = this.authService.login(this.form.value as AuthCredentialsInterface)
      .subscribe({
        next: (isLoggedIn: boolean | null): void => {
          if (isLoggedIn) {
            this.router.navigate(['/']).catch((error) => console.log(error));
            this.toastService.success('You are successfully logged in', 'Login success');
          }
        },
        error: (error: HttpErrorResponse) => this.toastService.error(error.error.message, 'Login failure')
      });

    this.subscriptions.add(loginSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
