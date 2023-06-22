import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogRef} from '@angular/cdk/dialog';

@Component({
  selector: 'ym-post-editor-dialog',
  templateUrl: './post-editor-dialog.component.html',
  styleUrls: ['./post-editor-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule],
})
export class PostEditorDialogComponent {

  private dialogRef: DialogRef = inject(DialogRef);

  closeDialog(): void {
    this.dialogRef.close();
  }

}
