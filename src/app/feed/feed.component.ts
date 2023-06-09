import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NavbarComponent} from '../core/shared-components/navbar/navbar.component';

@Component({
  selector: 'ym-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, NavbarComponent]
})
export class FeedComponent {

}
