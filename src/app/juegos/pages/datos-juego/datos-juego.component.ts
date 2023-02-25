import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { JuegoencestaComponent } from '../../components/juegoencesta/juegoencesta.component';
import {
  Juego,
  JuegosPlataforma,
  Plataforma,
} from '../../interfaces/juegos.interfaces';
import { JuegosService } from '../../services/juegos.service';

@Component({
  selector: 'app-datos-juego',
  templateUrl: './datos-juego.component.html',
  styleUrls: ['./datos-juego.component.css'],
})
export class DatosJuegoComponent {
  juego!: Juego[];
  plataformasJuego: JuegosPlataforma[] = [];
  plataformas: Plataforma[] = [];
  indiceplataforma: number = 0;
  nuevaplataforma: Plataforma = {
    IdPlataforma: 0,
    NombrePlataforma: '',
  };
  rutaimagen: String = '../../../../assets/';
  constructor(
    private activatedRoute: ActivatedRoute,
    private juegosService: JuegosService,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => console.log(id));

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.juegosService.getJuegoPorId(id)))
      .subscribe((juego) => {
        this.juego = juego;
        this.juegosService
          .getPlataformasdeJuegoporId(this.juego[0].IdJuego)
          .subscribe((plataformasJuego) => {
            this.plataformasJuego = plataformasJuego;
            this.plataformasJuego.forEach((juego) => {
              this.juegosService
                .getPlataformaporId(juego.IdPlataforma)
                .subscribe((plataformas) => {
                  this.nuevaplataforma = {
                    IdPlataforma: plataformas[0].IdPlataforma,
                    NombrePlataforma: plataformas[0].NombrePlataforma,
                  };
                  console.log('Plataforma a añadir: ', this.nuevaplataforma);
                  console.log(
                    'Si vale -1 no está en el array: ',
                    this.plataformas.indexOf(this.nuevaplataforma)
                  );

                  if (this.plataformas.indexOf(this.nuevaplataforma) === -1) {
                    console.log('Añadiendo...');
                    this.plataformas.push(this.nuevaplataforma);
                    console.log(this.plataformas);
                    console.log('Añadido!');
                  }
                  /* console.log(this.nuevaplataforma); */

                  console.log(this.plataformas);
                  /* this.plataformas = plataformas; */
                  /* if (this.plataformas.length < this.plataformasJuego.length)
                    this.plataformas.push(plataformas[0]); */
                });
            });
          });
      });
  }
  durationInSeconds = 2;

  openSnackBar() {
    this._snackBar.openFromComponent(JuegoencestaComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
}
