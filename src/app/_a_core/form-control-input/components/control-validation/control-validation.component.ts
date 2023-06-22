import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'ym-control-validation',
  templateUrl: './control-validation.component.html',
  styleUrls: ['./control-validation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule],
})
export class ControlValidationComponent {

  @Input({ required: true }) control!: FormControl;
  @Input() maxLength!: number;

}
