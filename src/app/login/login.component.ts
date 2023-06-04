import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {LoginFormInterface} from "../core/interfaces/login-form.interface";

@Component({
  selector: 'ym-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {

  form: FormGroup<LoginFormInterface> = new FormGroup<LoginFormInterface>({
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  login(): void {
    console.log(this.form.value);
  }
}
