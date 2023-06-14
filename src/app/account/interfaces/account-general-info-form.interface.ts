import {FormControl} from '@angular/forms';

export interface AccountGeneralInfoFormInterface {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  subdomain: FormControl<string | null>;
}
