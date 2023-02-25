import { Component, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { DatosJuegoComponent } from '../../pages/datos-juego/datos-juego.component';
@Component({
  selector: 'app-juegoencesta',
  templateUrl: './juegoencesta.component.html',
  styleUrls: ['./juegoencesta.component.css'],
})
export class JuegoencestaComponent {
  snackBarRef = inject(MatSnackBarRef);
}
