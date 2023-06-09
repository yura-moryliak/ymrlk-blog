import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';

import {Observable, Subscription} from 'rxjs';

import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'ym-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  isLoggedIn$!: Observable<boolean>;
  isNavbarExpanded = false;

  private authService: AuthService = inject(AuthService);
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
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
