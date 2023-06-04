import {FormControl} from "@angular/forms";

export interface LoginFormInterface {
  userName: FormControl<string | null>;
  password: FormControl<string | null>;
}
