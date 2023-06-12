import {Routes} from '@angular/router';

export const profileChildRoutes: Routes = [
  {
    path: 'about',
    loadComponent: () => import('../profile/components/about/about.component')
      .then((cmp) => cmp.AboutComponent)
  },
  {
    path: 'posts',
    loadComponent: () => import('../profile/components/posts/posts.component')
      .then((cmp) => cmp.PostsComponent)
  },
  {
    path: 'subscriptions',
    loadComponent: () => import('../profile/components/subscriptions/subscriptions.component')
      .then((cmp) => cmp.SubscriptionsComponent)
  },
  {
    path: 'followers',
    loadComponent: () => import('../profile/components/followers/followers.component')
      .then((cmp) => cmp.FollowersComponent)
  },
  {
    path: '**',
    redirectTo: 'about',
    pathMatch: 'full'
  }
];
