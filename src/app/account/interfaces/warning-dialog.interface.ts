import {DialogRef} from '@angular/cdk/dialog';

export interface WarningDialogInterface<A, B> {
  openWarningDialog(): DialogRef<A, B>;
}
