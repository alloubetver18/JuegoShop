import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarrouselComponent } from './pages/carrousel/carrousel.component';
import { DatosJuegoComponent } from './pages/datos-juego/datos-juego.component';
import { ListadoComponent } from './pages/listado/listado.component';
import { ModificarJuegoComponent } from './pages/modificar-juego/modificar-juego.component';

const routes: Routes = [
  {
    path: '',
    component: CarrouselComponent,
  },
  {
    path: ':id',
    component: ListadoComponent,
  },
  {
    path: 'juego/:id',
    component: DatosJuegoComponent,
  },
  {
    path: 'juego/editar/:id',
    component: ModificarJuegoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuegosRoutingModule {}
