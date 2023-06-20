import {Routes} from '@angular/router';

import {authGuard} from './core/guards/auth.guard';
import {loggedInGuard} from './core/guards/loggedin.guard';
import {publicProfileGuard} from './core/guards/public-profile.guard';

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
    path: 'profile/current',
    loadComponent: () => import('./profile/profile.component')
      .then((cmp) => cmp.ProfileComponent),
    children: profileChildRoutes,
    canActivate: [authGuard]
  },
  {
    path: 'profile/:profileUUIDOrSubdomain',
    loadComponent: () => import('./profile/profile.component')
      .then((cmp) => cmp.ProfileComponent),
    children: profileChildRoutes,
    data: { isPublic: true },
    canActivate: [publicProfileGuard]
  },
  {
    path: 'account-settings',
    loadComponent: () => import('./account/account.component')
      .then((cmp) => cmp.AccountComponent),
    canActivate: [authGuard]
  },
  {
    path: 'user/:sub',
    loadComponent: () => import('./user/user.component')
      .then((cmp) => cmp.UserComponent),
  },
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found.component')
      .then((cmp) => cmp.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
