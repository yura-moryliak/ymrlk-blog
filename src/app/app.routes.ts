import {Routes} from '@angular/router';

import {authGuard} from './core/guards/auth.guard';
import {loggedInGuard} from './core/guards/loggedin.guard';

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
    path: 'user/:id',
    loadComponent: () => import('./user/user.component')
      .then((cmp) => cmp.UserComponent),
    canActivate: [authGuard] // for example only
  },

  // TODO Here will come path as /account/moryliak.y
  // TODO add canActivate: [authGuard]

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
