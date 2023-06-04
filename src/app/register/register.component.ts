import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {RegisterFormInterface} from "../core/interfaces/register-form.interface";

@Component({
  selector: 'ym-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegisterComponent {

  form: FormGroup<RegisterFormInterface> = new FormGroup<RegisterFormInterface>({
    userName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.email
    ])),
    password: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ])),
    confirmPassword: new FormControl('', Validators.required)
  });

  register(): void {
    console.log(this.form.value);
  }
}
