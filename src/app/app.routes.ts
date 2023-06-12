import {Routes} from '@angular/router';

import {authGuard} from './core/guards/auth.guard';
import {loggedInGuard} from './core/guards/loggedin.guard';

import {profileChildRoutes} from './profile/profile-child.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feed/feed.component')
      .then((cmp) => cmp.FeedComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component')
      .then((cmp) => cmp.LoginComponent),
    canActivate: [loggedInGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component')
      .then((cmp) => cmp.RegisterComponent),
    canActivate: [loggedInGuard]
  },
  {
    path: 'reset-password/:accountId',
    loadComponent: () => import('./reset-password/reset-password.component')
      .then((cmp) => cmp.ResetPasswordComponent),
    canActivate: [loggedInGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component')
      .then((cmp) => cmp.ProfileComponent),
    children: profileChildRoutes,
    canActivate: [authGuard]
  },
  {
    path: 'user/:sub',
    loadComponent: () => import('./user/user.component')
      .then((cmp) => cmp.UserComponent),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
