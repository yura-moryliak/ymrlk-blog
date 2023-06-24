import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NavbarComponent} from '../_a_core/shared-components/navbar/navbar.component';
import {defaultPageMetaData, MetadataService} from '../_a_core/services/metadata.service';

@Component({
  selector: 'ym-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, NavbarComponent]
})
export class FeedComponent implements OnInit {

  private metadataService: MetadataService = inject(MetadataService);

  ngOnInit(): void {
    this.metadataService.setPageMetadata(defaultPageMetaData);
  }

}
