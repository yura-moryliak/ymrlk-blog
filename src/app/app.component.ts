import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';

import {NavbarComponent} from './core/components/navbar/navbar.component';
import {backendRequestProvider} from './core/providers/backend-request.provider';

@Component({
  selector: 'ym-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent
  ],
  providers: [backendRequestProvider]
})
export class AppComponent { }
