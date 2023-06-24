import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Dialog} from '@angular/cdk/dialog';

import {Observable} from 'rxjs';

import {
  PostEditorDialogComponent
} from '../../../_a_core/shared-components/dialogs/post-editor-dialog/post-editor-dialog.component';
import {DraftPostService} from '../../../_a_core/services/draft-post.service';

@Component({
  selector: 'ym-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule],
})
export class PostsComponent implements OnInit {

  hasDraft$!: Observable<boolean>;

  private dialog: Dialog = inject(Dialog);
  private draftPostService: DraftPostService = inject(DraftPostService);

  ngOnInit(): void {
    this.hasDraft$ = this.draftPostService.hasDraft$;
  }

  openEditorDialog(): void {
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
