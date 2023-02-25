import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarrouselComponent } from './juegos/pages/carrousel/carrousel.component';

const routes: Routes = [
  {
    path: '',
    component: CarrouselComponent,
  },
  {
    path: 'listado',
    loadChildren: () =>
      import('./juegos/juegos.module').then((m) => m.JuegosModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
