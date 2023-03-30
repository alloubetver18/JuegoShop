import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
    id: '',
    Nombre: '',
    Email: '',
    Pass: '',
    ImgPerfil: '',
    Recordar: false,
  };
  usuarioEncontrado: Usuario[] = [];
  usuarioLogueado: boolean = false;

  constructor(public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (
      localStorage.getItem('user') != null ||
      sessionStorage.getItem('user') != null
    ) {
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
        if (result.Recordar)
          localStorage.setItem('user', this.usuarioVacio.id + '');
        else sessionStorage.setItem('user', this.usuarioVacio.id + '');
        console.log('Logueado desde: ', this.router.url);
        this.router.navigate([this.router.url]);
      }
    });
  }

  SalirSistema() {
    this.usuarioLogueado = false;
    if (localStorage.getItem('user') != null) localStorage.removeItem('user');
    if (sessionStorage.getItem('user') != null)
      sessionStorage.removeItem('user');
    console.log('Deslogueado desde: ', this.router.url);
    this.router.navigate([this.router.url]);
  }
}
