import { Routes } from '@angular/router';
import { adminGuard } from '@auth/guards/admin.guard';
import { LoginPage } from '@auth/pages/login-page/login-page';
import { RegisterPage } from '@auth/pages/register-page/register-page';
import { PlaylistPage } from '@playlist/pages/playlist-page/playlist-page';
import { StoreFrontLayout } from './layouts/store-front-layout/store-front-layout';
import { AdminPage } from './pages/admin-page/admin-page';
import { GenrePage } from './pages/genre-page/genre-page';
import { HomePage } from './pages/home-page/home-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { SongPage } from './pages/song-page/song-page';

export const StoreFrontRoutes: Routes = [
  {
    path: '',
    component: StoreFrontLayout,
    children: [
      { path: '', component: HomePage },
      { path: 'playlist', component: PlaylistPage },
      { path: 'auth/login', component: LoginPage },
      { path: 'auth/register', component: RegisterPage },
      { path: 'admin', component: AdminPage, canActivate: [adminGuard] },
      { path: 'genre/:genre', component: GenrePage },
      { path: 'song/:idSlug', component: SongPage },
      { path: '**', component: NotFoundPage },
    ],
  },
  { path: '**', redirectTo: '' },
];
export default StoreFrontRoutes;
