import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from 'src/app/auth/interfaces/usuarios.interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ModalErrorUserComponent } from '../modal-error-user/modal-error-user.component';

interface datos {
  tipo: string;
  mensaje?: string;
}

@Component({
  selector: 'app-modal-recuperar-pass',
  templateUrl: './modal-recuperar-pass.component.html',
  styleUrls: ['./modal-recuperar-pass.component.css'],
})
export class ModalRecuperarPassComponent {
  email: string = '';
  tipoError: string = 'email';
  miFormulario: FormGroup = this.fb.group({
    email: [, []],
    /* usuario: [, [Validators.required, Validators.minLength(3)]],
    pass: [, [Validators.required, Validators.min(0)]], */
  });

  mensajeRecuperacionContrasenia: string = '';

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalRecuperarPassComponent>
  ) {}
  //Se conecta a la BD y manda la petición de email. Si hay un usuario con ese email, recupera
  //todos los datos, monta un email y lo manda.
  buscarEmail() {
    this.buscarDatosUsuarioporEmail();
  }

  //Llamada al servicio para el email
  buscarDatosUsuarioporEmail() {
    this.email = this.miFormulario.controls['email'].value;
    this.authService
      .getDatosUsuarioporEmail(this.email)
      .subscribe((usuario) => {
        if (usuario.length == 0) {
          this.mostrarMensajeError(this.tipoError);
        } else {
          this.enviarEmail(usuario[0]);
          this.tipoError = 'emailEncontrado';
          this.mostrarMensajeDatosEmail(this.tipoError);
          this.dialogRef.close();
        }
      });
  }

  //Montar el email y mandarlo
  enviarEmail(usuario: Usuario) {
    this.mensajeRecuperacionContrasenia =
      'Buenas tardes ' +
      usuario.Nombre +
      '. Su contraseña es: ' +
      usuario.Pass +
      '.';
    console.log(this.mensajeRecuperacionContrasenia);
  }

  //Si no encontró el email, mostrar mensaje de error
  mostrarMensajeError(tipoError: string) {
    let dialogRefError = this.dialog.open(ModalErrorUserComponent, {
      disableClose: true,
      data: {
        tipo: tipoError,
        mensaje: '',
      },
    });
  }

  //Cuando encuentra el email, muestra un modal con la información de ingreso.
  //TODO Cambiar cuando sepa enviar emails con o sin servidor.
  mostrarMensajeDatosEmail(tipoError: string) {
    let dialogRefError = this.dialog.open(ModalErrorUserComponent, {
      disableClose: true,
      data: {
        tipo: tipoError,
        mensaje: this.mensajeRecuperacionContrasenia,
      },
    });
  }
}
