import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginFormInterface} from '../../core/interfaces/login-form.interface';

export const sharedLoginForm: FormGroup<LoginFormInterface> = new FormGroup<LoginFormInterface>({
  email: new FormControl('', Validators.compose([Validators.email, Validators.required])),
  password: new FormControl('', Validators.required)
});
