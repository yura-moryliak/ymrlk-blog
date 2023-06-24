import {FormControl} from "@angular/forms";

export interface LoginFormInterface {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
