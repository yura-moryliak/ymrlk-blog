import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'ym-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule]
})
export class FeedComponent {

}
