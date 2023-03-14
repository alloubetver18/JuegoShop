import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailValidatorService } from 'src/app/shared/validators/email-validator.service';
import { ValidatorService } from 'src/app/shared/validators/validator.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuarios.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  nuevoUsuario: Usuario = {
    id: '',
    Nombre: '',
    Email: '',
    Pass: '',
    ImgPerfil: 'Ruta',
  };
  formularioRegistro: FormGroup = this.fb.group(
    {
      nombre: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailvalidator],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]],
    },
    {
      validators: [
        this.validatorService.camposIguales('password', 'password2'),
      ],
    }
  );

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private emailvalidator: EmailValidatorService,
    private validatorService: ValidatorService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (
      localStorage.getItem('user') != null ||
      sessionStorage.getItem('user') != null
    )
      this.router.navigate(['/']);
  }

  //Registrar: Si todos los campos son válidos, reiniciará sus campos, creará un nuevo usuario
  //con los datos del formulario de registro
  registrar() {
    this.obtenerIdUltimoUsuario();
  }

  //obtenerIdUltimoUsuario: Llama al servicio para obtener todos los usuarios y obtiene el id
  //del último usuario registrado. Luego, crea un nuevo usuario con los datos del formulario
  //y los manda a la función crearNuevoUsuario
  obtenerIdUltimoUsuario() {
    this.authService.getUsuarios().subscribe((usuario) => {
      let nuevaId = Number(usuario[0].id) + 1;
      this.nuevoUsuario = {
        id: nuevaId.toString(),
        Nombre: this.formularioRegistro.get('nombre')?.value,
        Email: this.formularioRegistro.get('email')?.value,
        Pass: this.formularioRegistro.get('password')?.value,
        ImgPerfil: 'Ruta',
      };
      this.crearNuevoUsuario(this.nuevoUsuario);
    });
  }
  //crearNuevoUsuario: Introduciendo como parámetro los datos de un nuevo usuario, los introduce
  //en la BD.
  crearNuevoUsuario(nuevoUsuario: Usuario) {
    this.authService.setNuevoUsuario(nuevoUsuario).subscribe((usuario) => {
      this.formularioRegistro.markAllAsTouched();
      this.router.navigate(['/']);
      this.mostrarSnackBar('Nuevo usuario creado.');
    });
  }

  //Muestra un mensaje cuando el usuario nuevo se ha registrado.
  mostrarSnackBar(mensaje: string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 1500,
    });
  }

  //Devuelve cuando el campo seleccionado es válido o no, con el fin de mostrar mensajes de error
  //en caso de ser necesario
  campoNoValido(campo: string) {
    return (
      this.formularioRegistro.get(campo)?.invalid &&
      this.formularioRegistro.get(campo)?.touched
    );
  }

  //En el caso de que el email presente un error, el mensaje que mostrará será uno de los siguientes.
  get emailErrorsMsg() {
    const errors = this.formularioRegistro.get('email')?.errors;
    if (errors?.['required']) {
      return 'El campo email es obligatorio';
    } else if (errors?.['pattern']) {
      return 'El formato del email no es el correcto';
    } else if (errors?.['emailTomado']) {
      return 'El email escrito ya está siendo usado por otro usuario';
    } else {
      return '';
    }
  }
}
