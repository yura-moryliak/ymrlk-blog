import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component')
      .then((cmp) => cmp.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component')
      .then((cmp) => cmp.RegisterComponent)
  },
  {
    path: 'user/:id',
    loadComponent: () => import('./user/user.component')
      .then((cmp) => cmp.UserComponent)
  },
  {
    path: 'feed',
    loadComponent: () => import('./feed/feed.component')
      .then((cmp) => cmp.FeedComponent)
  },
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full'
  }
];
