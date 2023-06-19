import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {Observable, tap} from 'rxjs';

import {UserInterface} from '../../../core/interfaces/user/user.interface';
import {UsersService} from '../../../core/services/users.service';
import {LinkifyPipe} from '../../../core/pipes/linkify.pipe';
import {LinkifyLinkDirective} from '../../../core/directives/linkify-link.directive';

@Component({
  selector: 'ym-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, LinkifyPipe, LinkifyLinkDirective],
})
export class AboutComponent implements OnInit {

  user$!: Observable<UserInterface>;
  hasSocialProfilesAdded = false;

  private usersService: UsersService = inject(UsersService);

  ngOnInit(): void {
    this.user$ = this.usersService.userState$.pipe(
      tap((user: UserInterface) => this.mapSocialProfiles(user.socialProfiles))
    );
  }

  private mapSocialProfiles(socialProfiles: Array<{title: string; url: string}> | undefined): void {
    this.hasSocialProfilesAdded = <boolean>socialProfiles?.some((socialProfile: {title: string; url: string} ) =>
      socialProfile.url.length
    );
  }
}
