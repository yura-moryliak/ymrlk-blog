import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LinkifyPipe} from '../../../core/pipes/linkify.pipe';
import {UserInterface} from '../../../core/interfaces/user/user.interface';
import {LinkifyLinkDirective} from '../../../core/directives/linkify-link.directive';

@Component({
  selector: 'ym-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, LinkifyPipe, LinkifyLinkDirective],
})
export class AboutComponent {

  @Input() set data(user: UserInterface) {

    if (!user) {
      return;
    }

    this.user = user;
    this.mapSocialProfiles(user?.socialProfiles);
  }

  user!: UserInterface;
  hasSocialProfilesAdded = false;

  private mapSocialProfiles(socialProfiles: Array<{title: string; url: string}> | undefined): void {
    this.hasSocialProfilesAdded = <boolean>socialProfiles?.some((socialProfile: {title: string; url: string} ) =>
      socialProfile.url.length
    );
  }
}
