import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface datos {
  tipo: string;
  mensaje?: string;
}

@Component({
  selector: 'app-modal-error-user',
  templateUrl: './modal-error-user.component.html',
  styleUrls: ['./modal-error-user.component.css'],
})
export class ModalErrorUserComponent {
  errorEmail: boolean = false;
  errorLogin: boolean = false;
  nuevoUsuario: boolean = false;
  emailEncontrado: boolean = false;
  mensajeRecibido: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: datos) {
    if (data.tipo === 'login') this.errorLogin = true;
    if (data.tipo === 'email') this.errorEmail = true;
    if (data.tipo === 'emailEncontrado') {
      this.emailEncontrado = true;
      this.mensajeRecibido = data.mensaje || '';
    }
  }
}
