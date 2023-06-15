import {FormControl} from '@angular/forms';

export interface AccountPasswordChangeFormInterface {
  oldPassword: FormControl<string | null>;
  newPassword: FormControl<string | null>;
}
