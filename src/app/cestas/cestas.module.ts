import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CestasRoutingModule } from './cestas-routing.module';
import { CestaComponent } from './pages/cesta/cesta.component';
import { MaterialModule } from '../material/material.module';
import { IconoIdPlataformaPipe } from '../juegos/pipes/icono-id-plataforma.pipe';

@NgModule({
  declarations: [CestaComponent, IconoIdPlataformaPipe],
  imports: [CommonModule, CestasRoutingModule, MaterialModule],
})
export class CestasModule {}
