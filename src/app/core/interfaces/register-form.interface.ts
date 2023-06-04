import {FormControl} from "@angular/forms";

export interface RegisterFormInterface {
  userName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}
