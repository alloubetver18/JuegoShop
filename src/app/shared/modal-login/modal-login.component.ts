import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Usuario } from '../../auth/interfaces/usuarios.interfaces';
import { ModalErrorUserComponent } from '../modal-error-user/modal-error-user.component';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.css'],
})
export class ModalLoginComponent {
  usuario: string = '';
  pass: string = '';
  data!: Usuario;
  miFormulario: FormGroup = this.fb.group({
    usuario: [, []],
    pass: [, []],
    /* usuario: [, [Validators.required, Validators.minLength(3)]],
    pass: [, [Validators.required, Validators.min(0)]], */
  });

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalLoginComponent>
  ) {}

  //Obteniendo los datos del Formulario Reactivo miFormulario, llama la servicio y recupera
  //El usuario deseado, o un usuario vacio de no haberlo. Si se obtiene un usuario vacio,
  //Llama a mostrarMensajeError(); Si se obtiene un usuario válido, lo guarda en una
  //Variable y cierra el formulario, mandando los datos.
  entrar() {
    this.usuario = this.miFormulario.controls['usuario'].value;
    this.pass = this.miFormulario.controls['pass'].value;
    this.authService
      .getUsuarioporNombreUsuarioyContraseniaUsuario(this.usuario, this.pass)
      .subscribe((usuario) => {
        if (usuario.length == 0) {
          this.mostrarMensajeError();
        } else {
          this.guardarDatosUsuario(usuario[0]);
          this.dialogRef.close(this.data);
        }
      });
  }

  //Recibiendo los datos de un Usuario como parámetro, los guarda en una variable del componente
  //llamada data.
  guardarDatosUsuario(usuario: Usuario) {
    this.data = {
      idUsuario: usuario.idUsuario,
      Nombre: usuario.Nombre,
      Email: usuario.Email,
      Pass: usuario.Pass,
      ImgPerfil: usuario.ImgPerfil,
    };
  }
  //Muestra un modal con un mensaje de error.
  mostrarMensajeError() {
    let dialogRefError = this.dialog.open(ModalErrorUserComponent, {
      disableClose: true,
    });
  }
}
