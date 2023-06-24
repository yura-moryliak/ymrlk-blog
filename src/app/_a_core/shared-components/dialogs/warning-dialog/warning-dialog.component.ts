import {Component, inject, TemplateRef, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {DialogRef, DIALOG_DATA} from '@angular/cdk/dialog';

export interface WarningDialogDataInterface {
  label?: string;
  content?: TemplateRef<any>;
  cancelButtonText?: string;
  confirmButtonText?: string;
}

@Component({
  selector: 'ym-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class WarningDialogComponent {

  dialogData: WarningDialogDataInterface = inject(DIALOG_DATA);

  private dialogRef: DialogRef = inject(DialogRef);

  closeDialog(proceed = false): void {
    this.dialogRef.close(proceed);
  }
}
