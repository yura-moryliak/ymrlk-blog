import {
  Component,
  inject, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewEncapsulation
} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import {Dialog, DialogRef} from '@angular/cdk/dialog';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {lastValueFrom} from 'rxjs';

import {ToastrService} from 'ngx-toastr';

import {EditorModule} from 'primeng/editor';

import * as QuillNamespace from 'quill';

import {SanitizeHtmlPipe} from '../../../pipes/sanitize-html.pipe';
import {FormControlInputComponent} from '../../../form-control-input/form-control-input.component';
import {
  ControlValidationComponent
} from '../../../form-control-input/components/control-validation/control-validation.component';
import {WarningDialogComponent, WarningDialogDataInterface} from '../warning-dialog/warning-dialog.component';
import {DraftPostInterface, DraftPostService} from '../../../services/draft-post.service';

@Component({
  selector: 'ym-post-editor-dialog',
  templateUrl: './post-editor-dialog.component.html',
  styleUrls: ['./post-editor-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, EditorModule, SanitizeHtmlPipe, FormControlInputComponent, ControlValidationComponent, ReactiveFormsModule],
})
export class PostEditorDialogComponent implements OnInit, OnDestroy {

  @ViewChild('warningDialogContent', { static: true, read: TemplateRef })
  warningDialogContent!: TemplateRef<any>;

  Quill: any = QuillNamespace;

  isPreviewMode = false;

  draft!: DraftPostInterface;

  form: FormGroup<{ postDescription: FormControl<string | null>; content: FormControl<string | null> }> = new FormGroup<{postDescription: FormControl; content: FormControl<string | null>}>({
    postDescription: new FormControl<string | null>('', Validators.compose([
      Validators.required,
      Validators.maxLength(100)
    ])),
    content: new FormControl<string | null>('', Validators.required)
  })

  private dialogService: Dialog = inject(Dialog);
  private dialogRef: DialogRef = inject(DialogRef);
  private renderer: Renderer2 = inject(Renderer2);
  private document: Document = inject(DOCUMENT);
  private toastService: ToastrService = inject(ToastrService);
  private draftPostService: DraftPostService = inject(DraftPostService);

  ngOnInit(): void {
    this.initEditorFontSizes();
    this.handleBodyScroll();
    this.initDraft();
  }

  closeDialog(): void {

    const isFormControlsEdited = this.form.controls.postDescription.value || this.form.controls.content.value;

    if (!isFormControlsEdited || !this.form.dirty) {
      return this.dialogRef.close();
    }

    this.openWarningDialog();
  }

  togglePreview(): void {
    this.isPreviewMode = !this.isPreviewMode;
  }

  createPost(): void {
    console.log(this.form.value);
  }

  removeFromDraft(): void {
    this.draft = this.draftPostService.remove();
    this.form.reset();
  }

  async openWarningDialog(): Promise<void> {
    const warningDialogRef: DialogRef<boolean, WarningDialogComponent> = this.dialogService.open(WarningDialogComponent, {
      width: '550px',
      maxWidth: '90vw',
      height: '300px',
      closeOnDestroy: true,
      closeOnNavigation: true,
      closeOnOverlayDetachments: true,
      disableClose: true,
      data: {
        label: 'Create new post warning',
        content: this.warningDialogContent,
        cancelButtonText: 'Exit',
        confirmButtonText: this.draft.isDraft ? 'Update draft' : 'Save to draft'
      } as WarningDialogDataInterface,
      panelClass: 'ym-dialog-common-wrapper'
    });

    const cancelWithoutSavingToDraft = await lastValueFrom(warningDialogRef.closed);

    if (!cancelWithoutSavingToDraft) {
      return this.dialogRef.close();
    }

    this.saveToDraft();
  }

  ngOnDestroy(): void {
    this.handleBodyScroll(true);
  }

  private initEditorFontSizes(): void {
    const fontSizeArr = ['16px', '18px', '24px', '30px', '36px', '48px'];
    const Size = this.Quill.import('attributors/style/size');

    Size.whitelist = fontSizeArr;
    this.Quill.register(Size, true);
  }

  private handleBodyScroll(onDestroy = false): void {
    this.renderer.setStyle(this.document.body, 'overflow', !onDestroy ? 'hidden' : 'initial');
  }

  private initDraft(): void {
    this.draft = this.draftPostService.init();
    this.form.patchValue(this.draft.content);
  }

  private saveToDraft(): void {
    this.draftPostService.save(this.form.value);
    this.toastService.info('Your post was save as draft', 'Draft');
    this.dialogRef.close();
  }
}
