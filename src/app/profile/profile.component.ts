import {ChangeDetectorRef, Component, inject, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

import {NavbarComponent} from '../core/shared-components/navbar/navbar.component';
import {TabInterface} from '../core/shared-components/tabs/interfaces/tab.interface';
import {UserInterface} from '../core/interfaces/user/user.interface';
import {TabsComponent} from '../core/shared-components/tabs/tabs.component';
import {AboutComponent} from './components/about/about.component';
import {PostsComponent} from './components/posts/posts.component';
import {SubscriptionsComponent} from './components/subscriptions/subscriptions.component';
import {FollowersComponent} from './components/followers/followers.component';
import {AvatarComponent} from '../core/shared-components/avatar/avatar.component';


@Component({
  selector: 'ym-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, TabsComponent, AvatarComponent],
})
export class ProfileComponent {

  user!: UserInterface;
  profileTabs: TabInterface[] = [
    {
      id: 'about',
      title: 'About',
      component: AboutComponent,
      routerLink: 'about'
    },
    {
      id: 'posts',
      title: 'Posts',
      component: PostsComponent,
      routerLink: 'posts'
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions',
      component: SubscriptionsComponent,
      routerLink: 'subscriptions'
    },
    {
      id: 'followers',
      title: 'Followers',
      component: FollowersComponent,
      routerLink: 'followers'
    }
  ];

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  initUser(user: UserInterface): void {
    this.user = user;
    this.cdr.detectChanges();
  }
}
