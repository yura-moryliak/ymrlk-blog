import {CommonModule} from '@angular/common';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';

import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs';

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
export class NavbarComponent implements OnInit {

  isLoggedIn$!: Observable<boolean>;

  private authService: AuthService = inject(AuthService);

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  logOut(): void {
    this.authService.logOut();
  }
}
