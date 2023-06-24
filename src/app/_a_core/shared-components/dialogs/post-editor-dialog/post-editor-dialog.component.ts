import {
  Component,
  inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation
} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import {DialogRef} from '@angular/cdk/dialog';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {EditorModule} from 'primeng/editor';

import * as QuillNamespace from 'quill';

import {SanitizeHtmlPipe} from '../../../pipes/sanitize-html.pipe';
import {FormControlInputComponent} from '../../../form-control-input/form-control-input.component';
import {
  ControlValidationComponent
} from '../../../form-control-input/components/control-validation/control-validation.component';

@Component({
  selector: 'ym-post-editor-dialog',
  templateUrl: './post-editor-dialog.component.html',
  styleUrls: ['./post-editor-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, EditorModule, SanitizeHtmlPipe, FormControlInputComponent, ControlValidationComponent, ReactiveFormsModule],
})
export class PostEditorDialogComponent implements OnInit, OnDestroy {

  Quill: any = QuillNamespace;

  isPreviewMode = false;

  form: FormGroup<{ postDescription: FormControl<string | null>; content: FormControl<string | null> }> = new FormGroup<{postDescription: FormControl; content: FormControl<string | null>}>({
    postDescription: new FormControl<string | null>('', Validators.compose([
      Validators.required,
      Validators.maxLength(100)
    ])),
    content: new FormControl<string | null>('', Validators.required)
  })

  private dialogRef: DialogRef = inject(DialogRef);
  private renderer: Renderer2 = inject(Renderer2);
  private document: Document = inject(DOCUMENT);

  ngOnInit(): void {
    this.initEditorFontSizes();
    this.handleBodyScroll();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  togglePreview(): void {
    this.isPreviewMode = !this.isPreviewMode;
  }

  createPost(): void {
    console.log(this.form.value);
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
}
