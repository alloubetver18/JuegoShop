import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/auth/interfaces/usuarios.interfaces';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { ModalComponent } from '../modal/modal.component';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  usuarioVacio: Usuario = {
    idUsuario: 0,
    Nombre: '',
    Email: '',
    Pass: '',
    ImgPerfil: '',
  };
  usuarioEncontrado: Usuario[] = [];
  usuarioLogueado: boolean = false;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (localStorage.getItem('user') != null) {
      this.usuarioLogueado = true;
    }
  }

  openDialogEnConstruccion() {
    const dialogRef = this.dialog.open(ModalComponent);
  }

  openDialogLogin() {
    const dialogRef = this.dialog.open(ModalLoginComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: Usuario) => {
      if (result) {
        this.usuarioVacio = result;
        this.usuarioLogueado = true;
        localStorage.setItem('user', this.usuarioVacio.idUsuario + '');
      }
    });
  }

  SalirSistema() {
    this.usuarioLogueado = false;
    localStorage.removeItem('user');
  }
}
