import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {Component, inject, OnDestroy, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {Subscription} from 'rxjs';

import {AuthService} from '../core/services/auth.service';
import {LoginFormInterface} from '../core/interfaces/login-form.interface';
import {AuthCredentialsInterface} from '../core/interfaces/auth/auth-credentials.interface';

@Component({
  selector: 'ym-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnDestroy {

  form: FormGroup<LoginFormInterface> = new FormGroup<LoginFormInterface>({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private subscriptions: Subscription = new Subscription();

  login(): void {
    const loginSubscription: Subscription = this.authService.login(this.form.value as AuthCredentialsInterface)
      .subscribe((isLoggedIn: boolean | null): void => {
        if (isLoggedIn) {
          this.router.navigate(['/']).catch((error) => console.log(error));
        }
      });

    this.subscriptions.add(loginSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
