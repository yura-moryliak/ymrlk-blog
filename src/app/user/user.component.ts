import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NavbarComponent} from '../core/shared-components/navbar/navbar.component';

@Component({
  selector: 'ym-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, NavbarComponent]
})
export class UserComponent { }
