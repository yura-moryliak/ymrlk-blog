import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';

import {backendRequestProvider} from './core/providers/backend-request.provider';
import {NavbarComponent} from './core/shared-components/navbar/navbar.component';

@Component({
  selector: 'ym-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent
  ],
  providers: [backendRequestProvider]
})
export class AppComponent { }
