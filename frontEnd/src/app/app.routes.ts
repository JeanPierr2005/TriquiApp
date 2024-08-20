import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PlayComponent } from './pages/play/play.component';
import { ChangeNameComponent } from './pages/change-name/change-name.component';
import { needNameGuard } from './guards/need-name.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [needNameGuard],
  },
  {
    path: 'play',
    component: PlayComponent,
    canActivate: [needNameGuard],
  },
  {
    path: 'play/:id',
    component: PlayComponent,
    canActivate: [needNameGuard],
  },
  {
    path: 'private-play',
    component: PlayComponent,
    canActivate: [needNameGuard],
    data:{isPrivated: true}
  },
  {
    path: 'change-name',
    component: ChangeNameComponent,
  },
];
