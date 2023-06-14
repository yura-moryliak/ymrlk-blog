import {FormControl} from '@angular/forms';

export interface AccountEditProfileFormInterface {
  location: FormControl<string | null>;
  bio: FormControl<string | null>;
}
