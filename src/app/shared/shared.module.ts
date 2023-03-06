import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { MenuComponent } from './menu/menu.component';
import { PieComponent } from './pie/pie.component';
import { RouterModule } from '@angular/router';
import { ModalComponent } from './modal/modal.component';
import { MaterialModule } from '../material/material.module';
import { ModalLoginComponent } from './modal-login/modal-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalErrorUserComponent } from './modal-error-user/modal-error-user.component';
import { ModalRecuperarPassComponent } from './modal-recuperar-pass/modal-recuperar-pass.component';

@NgModule({
  declarations: [
    CabeceraComponent,
    MenuComponent,
    PieComponent,
    ModalComponent,
    ModalLoginComponent,
    ModalErrorUserComponent,
    ModalRecuperarPassComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  exports: [CabeceraComponent, MenuComponent, PieComponent],
})
export class SharedModule {}
