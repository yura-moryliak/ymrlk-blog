import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Data, RouterLink} from '@angular/router';
import {Dialog, DialogRef} from '@angular/cdk/dialog';

import {combineLatest, map, Observable, Subscription} from 'rxjs';

import {NavbarComponent} from '../core/shared-components/navbar/navbar.component';
import {TabInterface} from '../core/shared-components/tabs/interfaces/tab.interface';
import {UserInterface} from '../core/interfaces/user/user.interface';
import {TabsComponent} from '../core/shared-components/tabs/tabs.component';
import {AboutComponent} from './components/about/about.component';
import {PostsComponent} from './components/posts/posts.component';
import {SubscriptionsComponent} from './components/subscriptions/subscriptions.component';
import {FollowersComponent} from './components/followers/followers.component';
import {AvatarComponent} from '../core/shared-components/avatar/avatar.component';
import {AuthService, USER_UUID_KEY} from '../core/services/auth.service';
import {UsersService} from '../core/services/users.service';
import {LocalStorageService} from '../core/services/local-storage.service';
import {AuthWarningDialogComponent} from './dialogs/auth-warning-dialog/auth-warning-dialog.component';

@Component({
  selector: 'ym-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, TabsComponent, AvatarComponent],
})
export class ProfileComponent implements OnInit, OnDestroy {

  @ViewChild('tabsComponent', { static: true, read: TabsComponent })
  tabsComponent!: TabsComponent;

  user!: UserInterface;
  isPublicProfile = false;
  isMe = false;
  isLoggedIn = false;

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

  private authService: AuthService = inject(AuthService);
  private usersService: UsersService = inject(UsersService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private localStorageService: LocalStorageService = inject(LocalStorageService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private dialog: Dialog = inject(Dialog);

  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.initProfileData();
  }

  follow(): void {
    if (this.isLoggedIn) {
      return this.processFollowing();
    }

    this.openLoginDialog();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initProfileData(): void {
    const combinedLatestDataSubscription: Subscription = combineLatest([
      this.authService.isLoggedIn$,
      this.getActivatedData(),
      this.getProfile(),
      this.usersService.userState$,
      this.tabsComponent.activeTab$,
    ]).subscribe({
      next: (combinedData: [boolean, boolean, UserInterface, UserInterface, TabInterface]) => {
        const [ isLoggedIn, isProfilePublic, profile, userState, selectedTab ] = combinedData;

        this.isLoggedIn = isLoggedIn;
        this.user = isProfilePublic ? profile : userState;
        this.isPublicProfile = isProfilePublic;
        this.isMe = this.checkIsMe(isProfilePublic ? profile : userState);
        selectedTab.data = isProfilePublic ? {...profile} : {...userState};
        this.cdr.detectChanges();
      }
    });

    this.subscriptions.add(combinedLatestDataSubscription);
  }

  private getActivatedData(): Observable<boolean> {
    return this.activatedRoute.data.pipe(
      map((data: { isPublic: boolean } | Data) => !data.isPublic ? false : data.isPublic)
    );
  }

  private getProfile(): Observable<any> {
    return this.usersService.profile$;
  }

  private checkIsMe(profile: UserInterface): boolean {
    return profile.uuid === this.localStorageService.getData(USER_UUID_KEY);
  }

  private openLoginDialog(): void {
    const dialogRef: DialogRef<any, AuthWarningDialogComponent> = this.dialog.open(AuthWarningDialogComponent, {
      width: '550px',
      maxWidth: '90vw',
      height: '350px',
      closeOnDestroy: true,
      closeOnNavigation: true,
      closeOnOverlayDetachments: true,
      disableClose: true,
      panelClass: 'ym-dialog-common-wrapper'
    });

    const dialogResultSubscription: Subscription = dialogRef.closed.subscribe({
      next: (result) => result && this.processFollowing()
    });

    this.subscriptions.add(dialogResultSubscription);
  }

  private processFollowing(): void {
    console.error('PROCESS FOLLOWING with usersService.follow()');
  }
}
