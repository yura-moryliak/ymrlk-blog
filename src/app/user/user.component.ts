import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StaticUsersList, UserStatic} from "../core/static-models/user.static";

@Component({
  selector: 'ym-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule]
})
export class UserComponent {

  admin: UserStatic = StaticUsersList.admin;

}
