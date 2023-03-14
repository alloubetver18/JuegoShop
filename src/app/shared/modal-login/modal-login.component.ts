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
import { ModalRecuperarPassComponent } from '../modal-recuperar-pass/modal-recuperar-pass.component';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.css'],
})
export class ModalLoginComponent {
  usuario: string = '';
  pass: string = '';
  data!: Usuario;
  tipoError: string = 'login';
  miFormulario: FormGroup = this.fb.group({
    usuario: [, []],
    pass: [, []],
    recordarUsuario: [, []],
    /* usuario: [, [Validators.required, Validators.minLength(3)]],
    pass: [, [Validators.required, Validators.min(0)]], */
  });
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;

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
          this.mostrarMensajeError(this.tipoError);
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
      id: usuario.id,
      Nombre: usuario.Nombre,
      Email: usuario.Email,
      Pass: usuario.Pass,
      ImgPerfil: usuario.ImgPerfil,
      Recordar: this.miFormulario.controls['recordarUsuario'].value,
    };
  }
  //Muestra un modal con un mensaje de error.
  mostrarMensajeError(tipoError: string) {
    let dialogRefError = this.dialog.open(ModalErrorUserComponent, {
      disableClose: true,
      data: {
        tipo: tipoError,
        mensaje: '',
      },
    });
  }

  //Muestra un modal con una caja de texto que pedirá un email válido. Luego, cuando lo reciba,
  //buscará en la BD si existe un usuario registrado con dicho Email. De existir, mandará un
  //Email al usuario correspondiente para que le recuerde su contraseña almacenada.
  recuperarContrasenia() {
    let dialogRefError = this.dialog.open(ModalRecuperarPassComponent, {
      disableClose: false,
    });
  }
}
