import {FormControl} from "@angular/forms";

export interface RegisterFormInterface {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  subdomain: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

export interface RegisterCredentialsInterface {
  firstName: string;
  lastName: string;
  subdomain: string
  email: string
  password: string
  confirmPassword: string;
}
