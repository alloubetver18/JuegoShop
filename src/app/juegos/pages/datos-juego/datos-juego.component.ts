import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
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
  juego: boolean = false;
  juegoConsultado: Juego = {
    IdJuego: 0,
    NombreJuego: '',
    GeneroJuego: '',
    JugadoresMaximos: 0,
    Descripcion: '',
    Online: true,
    FechaLanzamiento: '',
    Imagen: '',
    Precio: 0,
  };
  plataformasJuego: JuegosPlataforma[] = [];
  plataformas: Plataforma[] = [];
  indiceplataforma: number = 0;
  nuevaplataforma: Plataforma = {
    IdPlataforma: 0,
    NombrePlataforma: '',
  };
  rutaimagen: String = '../../../../assets/';
  durationInSeconds = 2;
  constructor(
    private activatedRoute: ActivatedRoute,
    private juegosService: JuegosService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.obtenerDatosdeJuegoporsuId();
  }

  openSnackBar() {
    this._snackBar.openFromComponent(JuegoencestaComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
  //Recibiendo desde la URL la iddeJuego, llama al servicio y recupera todos sus datos
  obtenerDatosdeJuegoporsuId() {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.juegosService.getJuegoPorId(id)))
      .subscribe((juego) => {
        this.juegoConsultado = {
          IdJuego: juego[0].IdJuego,
          NombreJuego: juego[0].NombreJuego,
          GeneroJuego: juego[0].GeneroJuego,
          JugadoresMaximos: juego[0].JugadoresMaximos,
          Descripcion: juego[0].Descripcion,
          Online: juego[0].Online,
          FechaLanzamiento: juego[0].FechaLanzamiento,
          Imagen: juego[0].Imagen,
        };
        this.juego = true;
        this.obtenerPlataformasdeunJuegoporIdJuego(
          this.juegoConsultado.IdJuego
        );
      });
  }
  //Recibiendo como parámetro la iddeJuego, llama al servicio y recupera las plataformas para las
  // que dicho juego está disponible
  obtenerPlataformasdeunJuegoporIdJuego(iddeJuego: number) {
    this.juegosService
      .getPlataformasdeJuegoporId(iddeJuego)
      .subscribe((plataformasJuego) => {
        this.plataformasJuego = plataformasJuego;
        this.juegoConsultado.Precio = this.plataformasJuego[0].Precio;
        this.obtenerListadePlataformasdeJuego(this.plataformasJuego);
      });
  }
  //Recibiendo como parámetro el array de pares de un juego y sus plataformas, llama al servicio
  //por cada una y recupera los datos de las plataformas para dicho juego.
  obtenerListadePlataformasdeJuego(plataformasJuego: JuegosPlataforma[]) {
    plataformasJuego.forEach((parjuegoplataforma) => {
      this.juegosService
        .getPlataformaporId(parjuegoplataforma.IdPlataforma)
        .subscribe((plataformas) => {
          this.nuevaplataforma = {
            IdPlataforma: plataformas[0].IdPlataforma,
            NombrePlataforma: plataformas[0].NombrePlataforma,
          };
          if (this.plataformas.indexOf(this.nuevaplataforma) === -1) {
            this.plataformas.push(this.nuevaplataforma);
          }
        });
    });
  }
}
