import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CestasRoutingModule } from './cestas-routing.module';
import { CestaComponent } from './pages/cesta/cesta.component';


@NgModule({
  declarations: [
    CestaComponent
  ],
  imports: [
    CommonModule,
    CestasRoutingModule
  ]
})
export class CestasModule { }
