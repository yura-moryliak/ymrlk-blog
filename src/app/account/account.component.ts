import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {Subscription, tap} from 'rxjs';

import {UsersService} from '../_a_core/services/users.service';
import {UserInterface} from '../_a_core/interfaces/user/user.interface';

import {TabInterface} from '../_a_core/shared-components/tabs/interfaces/tab.interface';
import {NavbarComponent} from '../_a_core/shared-components/navbar/navbar.component';
import {TabsComponent} from '../_a_core/shared-components/tabs/tabs.component';
import {MetadataService} from '../_a_core/services/metadata.service';
import {GeneralInfoComponent} from './components/general-info/general-info.component';
import {EditProfileComponent} from './components/edit-profile/edit-profile.component';
import {PasswordsChangeComponent} from './components/passwords-change/passwords-change.component';
import {SocialNetworksComponent} from './components/social-networks/social-networks.component';

@Component({
  selector: 'ym-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, NavbarComponent, TabsComponent],
})
export class AccountComponent implements OnInit, OnDestroy {

  accountTabList: TabInterface[] = [
    {
      id: 'general',
      component: GeneralInfoComponent,
      componentType: GeneralInfoComponent,
      title: 'General'
    },
    {
      id: 'edit-profile',
      component: EditProfileComponent,
      componentType: EditProfileComponent,
      title: 'Edit profile'
    },
    {
      id: 'passwords',
      component: PasswordsChangeComponent,
      componentType: PasswordsChangeComponent,
      title: 'Password'
    },
    {
      id: 'social-networks',
      component: SocialNetworksComponent,
      componentType: SocialNetworksComponent,
      title: 'Social profiles'
    }
  ];

  private usersService: UsersService = inject(UsersService);
  private metaDataService: MetadataService = inject(MetadataService);

  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const userStateSubscription: Subscription = this.usersService.userState$.pipe(
      tap((user: UserInterface) => this.initMetaData(user))
    ).subscribe({
      next: (userState: UserInterface) => this.accountTabList.forEach((tab: TabInterface) => tab.data = { user: userState })
    });

    this.subscriptions.add(userStateSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initMetaData(user: UserInterface): void {
    this.metaDataService.setPageMetadata({
      title: `${ user.firstName } ${ user.lastName }'s account settings`
    });
  }
}
