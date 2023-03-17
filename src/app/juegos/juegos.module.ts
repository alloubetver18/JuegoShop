import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JuegosRoutingModule } from './juegos-routing.module';
import { ListadoComponent } from './pages/listado/listado.component';
import { DatosJuegoComponent } from './pages/datos-juego/datos-juego.component';
import { ModificarJuegoComponent } from './pages/modificar-juego/modificar-juego.component';
import { CarrouselJuegosComponent } from './components/carrousel-juegos/carrousel-juegos.component';
import { JuegoDatosComponent } from './components/juego-datos/juego-datos.component';
import { ConfirmarComponent } from './components/confirmar/confirmar.component';
import { CarrouselComponent } from './pages/carrousel/carrousel.component';
import { ImagenPipe } from './pipes/imagen.pipe';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { IconoPipe } from './pipes/icono.pipe';

@NgModule({
  declarations: [
    ListadoComponent,
    DatosJuegoComponent,
    ModificarJuegoComponent,
    CarrouselJuegosComponent,
    JuegoDatosComponent,
    ConfirmarComponent,
    CarrouselComponent,
    ImagenPipe,
    IconoPipe,
  ],
  imports: [CommonModule, JuegosRoutingModule, MaterialModule, FormsModule],
  exports: [JuegosRoutingModule],
})
export class JuegosModule {}
