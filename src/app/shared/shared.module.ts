import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { MenuComponent } from './menu/menu.component';
import { PieComponent } from './pie/pie.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CabeceraComponent, MenuComponent, PieComponent],
  imports: [CommonModule, RouterModule],
  exports: [CabeceraComponent, MenuComponent, PieComponent],
})
export class SharedModule {}
