import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';

import {Observable, Subscription} from 'rxjs';

import {AuthService} from '../../services/auth.service';
import {UsersService} from '../../services/users.service';
import {UserInterface} from '../../interfaces/user/user.interface';
import {LoaderComponent} from '../loader/loader.component';

@Component({
  selector: 'ym-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LoaderComponent
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  user$!: Observable<UserInterface>;
  isLoggedIn$!: Observable<boolean>;
  isNavbarExpanded = false;

  private authService: AuthService = inject(AuthService);
  private usersService: UsersService = inject(UsersService);
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.user$ = this.usersService.userState$;
    this.observeNavbarResize();
  }

  logOut(): void {
    this.authService.logOut();
  }

  toggleNavbar(): void {
    this.isNavbarExpanded = !this.isNavbarExpanded;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private observeNavbarResize(): void {
    const breakpointsSubscription: Subscription = this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((state: BreakpointState): void => {
      if (!state.matches) {
        this.isNavbarExpanded = false;
      }
    });

    this.subscriptions.add(breakpointsSubscription);
  }
}
