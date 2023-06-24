import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';

import {NavbarComponent} from './_a_core/shared-components/navbar/navbar.component';
import {backendRequestProvider} from './_a_core/providers/backend-request.provider';

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
