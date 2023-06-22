import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Dialog} from '@angular/cdk/dialog';

import {
  PostEditorDialogComponent
} from '../../../_a_core/shared-components/dialogs/post-editor-dialog/post-editor-dialog.component';

@Component({
  selector: 'ym-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule],
})
export class PostsComponent {

  private dialog: Dialog = inject(Dialog);

  createPost(): void {
    this.dialog.open(PostEditorDialogComponent, {
      minWidth: '100%',
      minHeight: '100%',
      closeOnDestroy: true,
      closeOnNavigation: true,
      closeOnOverlayDetachments: true,
      disableClose: true,
      panelClass: 'ym-dialog-common-wrapper-no-border'
    });
  }
}
