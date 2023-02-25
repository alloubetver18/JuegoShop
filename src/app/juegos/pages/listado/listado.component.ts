import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import {
  JuegoShort,
  Plataforma,
  JuegosPlataforma,
} from '../../interfaces/juegos.interfaces';
import { FormBuilder } from '@angular/forms';
import { JuegosService } from '../../services/juegos.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { pairwise, scan, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css'],
})
export class ListadoComponent implements OnInit {
  infojuego: JuegoShort = {
    IdJuego: 1,
    NombreJuego: 'Zelda Breath of the Wild',
    Precio: 59.99,
  };
  listaJuegos: JuegoShort[] = [];
  listaPlataformas: Plataforma[] = [];
  listaidjuegos: number[] = [];
  listaPrecios: number[] = [];
  idPlatafoma: string = '';
  numjuego: number = 0;
  posprecio: number = 0;
  juegolista: number = 0;

  value = '';
  precio = 10;
  jugadores = 1;

  /* toppings = this._formBuilder.group({
    pepperoni: false,
    extracheese: false,
    mushroom: false,
  }); */

  constructor(
    private _formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private juegosService: JuegosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //TODO: Obteniendo el identificador parcial de la plataforma de la URL, usarlo para obtener
    //todas las plataformas con nombre similar
    this.activatedRoute.params.subscribe(({ id }) => {
      this.idPlatafoma = id;
      this.buscar();
      this.reiniciar();
    });

    //TODO: Una vez tengas la lista de plataformas, usar cada una de ellas para obtener todos
    //los ids de los juegos de las plataformas pertinentes
    //TODO: Con la lista de los ids, usarla para obtener un array con las versiones Short de
    //todos los juegos de dicha lista de ids
  }

  reiniciar() {
    this.listaJuegos = [];
    this.listaPlataformas = [];
    this.listaidjuegos = [];
    this.listaPrecios = [];
    this.idPlatafoma = '';
    this.numjuego = 0;
    this.posprecio = 0;
    this.juegolista = 0;
  }

  buscar() {
    //Llama el servicio y devuelve un array con todas las plataformas.
    let idjuegosplat = new Array<number>();

    this.juegosService
      .getPlataformasporDescriptor(this.idPlatafoma)
      .subscribe((plataformas) => {
        this.listaPlataformas = plataformas;
        if (this.listaPlataformas.length == 0) {
          this.router.navigate(['/']);
        }

        //Toma la lista de plataformas y busca todos los juegos que pertenecen a ellas,
        //sin repetirlos
        this.listaPlataformas.forEach(async (element) => {
          //obtener juegos por plataforma
          this.juegosService
            .getJuegosporPlataformas(element.IdPlataforma)
            .subscribe((juegos) => {
              juegos.forEach((element) => {
                if (!idjuegosplat.includes(element.IdJuego)) {
                  idjuegosplat.push(element.IdJuego);
                  this.listaPrecios.push(element.Precio);
                }
              });
              const valoresRepetidos: number[] = [];
              idjuegosplat.forEach((value) => {
                if (this.listaidjuegos.includes(value)) {
                  valoresRepetidos.push(value);
                }
              });
              idjuegosplat = idjuegosplat.filter(
                (value) => !valoresRepetidos.includes(value)
              );

              if (this.listaidjuegos.length > 0) {
                this.listaidjuegos = this.listaidjuegos.concat(idjuegosplat);
              } else {
                this.listaidjuegos = JSON.parse(JSON.stringify(idjuegosplat));
              }

              let juegonuevo: JuegoShort;
              for (let i = 0; i < idjuegosplat.length; i++) {
                this.juegosService
                  .getJuegoPorId(idjuegosplat[i])
                  .subscribe((juego) => {
                    juegonuevo = {
                      IdJuego: juego[0].IdJuego,
                      NombreJuego: juego[0].NombreJuego,
                      Precio: this.listaPrecios[this.posprecio],
                    };
                    this.listaJuegos.push(juegonuevo);
                  });
              }
            });
        });
      });
  }
}
