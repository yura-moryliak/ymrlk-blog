import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoaderPriorityEnum} from './enums/loader-priority.enum';

@Component({
  selector: 'ym-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule],
})
export class LoaderComponent {

  @Input() priority: 'primary' | 'secondary' = 'primary';

  showLoader = false;

  show(priority: LoaderPriorityEnum): void {
    if (this.priority !== priority) {
      return;
    }

    this.showLoader = true;
  }

  hide(priority: LoaderPriorityEnum): void {
    if (this.priority !== priority) {
      return;
    }

    this.showLoader = false;
  }

}
