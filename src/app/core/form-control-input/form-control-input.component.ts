import {Component, forwardRef, Input, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'ym-form-control-input',
  templateUrl: './form-control-input.component.html',
  styleUrls: ['./form-control-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormControlInputComponent),
      multi: true
    }
  ]
})
export class FormControlInputComponent implements ControlValueAccessor {

  @Input({ required: true }) label!: string | number;
  @Input({ required: true }) forId!: string | number;
  @Input() type: 'password' | 'text' | 'date' | 'email' | 'file' | 'number' | 'url' | 'tel' | 'textarea' = 'text';
  @Input() placeholder!: string;

  value!: string;
  isDisabled = false;

  onChange: any;
  onTouched: any;

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(outsideValue: string): void {
    this.value = outsideValue;
  }

  updateValue(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
