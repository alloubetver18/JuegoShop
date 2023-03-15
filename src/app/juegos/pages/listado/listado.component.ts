import { Component, OnInit } from '@angular/core';
import {
  Juego,
  JuegoShort,
  Plataforma,
} from '../../interfaces/juegos.interfaces';
import { FormBuilder } from '@angular/forms';
import { JuegosService } from '../../services/juegos.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  filtroGeneros: string[] = [];
  nombreJuegoBuscado: string = '';
  juegosEncontrados: Juego[] = [];
  juegosporNombre: Juego[] = [];
  checked = false;

  value = '';
  precio = 10;
  jugadores = 1;

  constructor(
    private _formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private juegosService: JuegosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //TODO: Obteniendo el identificador parcial de la plataforma de la URL, usarlo para obtener
    //todas las plataformas con nombre similar.
    this.filtroGeneros = [];
    this.obtenerDescriptordePlataformadeRuta();
  }

  //Limpiamos todos los datos sobrantes tras terminar las búsquedas.
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

  //Obtiene la id de la plataforma a partir del parámetro recibido en el navegador
  obtenerDescriptordePlataformadeRuta() {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.idPlatafoma = id;
      this.obtenerListadePlataformasporelDescriptordePlataforma(
        this.idPlatafoma
      );
      this.reiniciar();
    });
  }

  //Recibiendo un identificador de plataforma, devuelve todas las plataformas que
  //coincidan total o parcialmente con dicha id (TODO: Cambiar por buscar la única que
  //recibe, ya que el modal aún no está creado).
  obtenerListadePlataformasporelDescriptordePlataforma(
    descriptorPlataforma: string
  ) {
    this.juegosService
      .getPlataformasporDescriptor(descriptorPlataforma)
      .subscribe((plataformas) => {
        this.listaPlataformas = plataformas;
        if (this.listaPlataformas.length == 0) {
          this.router.navigate(['/']);
        } else {
          this.obtenerListaIdsJuegosporListadePlataformas(
            this.listaPlataformas
          );
        }
        this.reiniciar();
      });
  }

  //Recibiendo una lista de plataformas (TODO: cambiar a 'recibiendo una id de plataforma'),
  //devuelve todos los ids de juegos que pertenezcan a dicha plataforma, sin mostrarlos duplicados.
  //NOTA: Por lo general, estará mal: si está para un conjunto de plataformas, cada juego de
  //cada plataforma debería identificarlo de forma única. Por ello, una búsqueda por una sola
  //plataforma es preferible. Modificar cuando tenga el Modal.
  obtenerListaIdsJuegosporListadePlataformas(listaPlataformas: Plataforma[]) {
    let listaidjuegosplataforma = new Array<number>();
    listaPlataformas.forEach((element) => {
      //obtener juegos por plataforma

      this.juegosService
        .getJuegosporPlataformas(element.IdPlataforma)
        .subscribe((juegos) => {
          juegos.forEach((element) => {
            if (!listaidjuegosplataforma.includes(element.IdJuego)) {
              listaidjuegosplataforma.push(element.IdJuego);
              this.listaPrecios.push(element.Precio);
            }
          });
          const valoresRepetidos: number[] = [];
          listaidjuegosplataforma.forEach((value) => {
            if (this.listaidjuegos.includes(value)) {
              valoresRepetidos.push(value);
            }
          });
          listaidjuegosplataforma = listaidjuegosplataforma.filter(
            (value) => !valoresRepetidos.includes(value)
          );

          if (this.listaidjuegos.length > 0) {
            this.listaidjuegos = this.listaidjuegos.concat(
              listaidjuegosplataforma
            );
          } else {
            this.listaidjuegos = JSON.parse(
              JSON.stringify(listaidjuegosplataforma)
            );
          }

          this.obtenerListadeJuegosporListaIdsJuegos(
            listaidjuegosplataforma,
            this.listaPrecios
          );
          listaidjuegosplataforma = [];
        });
    });
  }

  //Recibiendo una lista de ids de juegos (number[]), devuelve los datos de cada juego (JuegoShort)
  //y los guarda en una lista de juegos (JuegoShort[]).
  obtenerListadeJuegosporListaIdsJuegos(
    listaIdsJuegos: number[],
    listaPrecios: number[]
  ) {
    this.juegosEncontrados = [];
    let juegonuevo: JuegoShort;
    for (let i = 0; i < listaIdsJuegos.length; i++) {
      this.juegosService.getJuegoPorId(listaIdsJuegos[i]).subscribe((juego) => {
        this.juegosEncontrados.push(juego[0]);
        if (i == listaIdsJuegos.length - 1)
          this.mostrarJuegos(
            this.juegosEncontrados,
            this.filtroGeneros,
            listaPrecios
          );
      });
    }
  }

  //En base a una lista de juegos encontrados, una lista de precios y un filtro de géneros,
  //mostraremos la lista de juegos por pantalla.
  mostrarJuegos(
    listaJuegosEncontrados: Juego[],
    filtroDeGeneros: string[],
    listaPrecios: number[]
  ) {
    let juegonuevo: JuegoShort;

    //Si la longitud del texto de la caja de texto es mayor que 0, filtramos los nombres
    /* if (this.value.length > 0) {
      for (let i = 0; i < listaJuegosEncontrados.length; i++){
        if (
          listaJuegosEncontrados[i].NombreJuego.toLowerCase().includes(
            this.value.toLowerCase()
          )
        ) {this.juegosporNombre.push(listaJuegosEncontrados[i]);}
      }
      if (filtroDeGeneros.length > 0){
        for (let i = 0; i < this.juegosporNombre.length; i++){
          if (
            filtroDeGeneros.indexOf(this.juegosporNombre[i].GeneroJuego) != -1
          ) {
            juegonuevo = {
              IdJuego: listaJuegosEncontrados[i].IdJuego,
              NombreJuego: listaJuegosEncontrados[i].NombreJuego,
              Precio: listaPrecios[i],
            };
            this.listaJuegos.push(juegonuevo);
          }
        }
      }else{
        for (let i = 0; i < this.juegosporNombre.length; i++){
            juegonuevo = {
              IdJuego: this.juegosporNombre[i].IdJuego,
              NombreJuego: this.juegosporNombre[i].NombreJuego,
              Precio: listaPrecios[i],
            };
            this.listaJuegos.push(juegonuevo);
        }
      }

    } */

    for (let i = 0; i < listaJuegosEncontrados.length; i++) {
      if (this.value.length > 0) {
        if (
          listaJuegosEncontrados[i].NombreJuego.toLowerCase().includes(
            this.value.toLowerCase()
          )
        ) {
          this.juegosporNombre.push(listaJuegosEncontrados[i]);
          /* juegonuevo = {
            IdJuego: listaJuegosEncontrados[i].IdJuego,
            NombreJuego: listaJuegosEncontrados[i].NombreJuego,
            Precio: listaPrecios[i],
          };
          this.listaJuegos.push(juegonuevo); */
        }
      }
      if (filtroDeGeneros.length > 0) {
        if (
          filtroDeGeneros.indexOf(listaJuegosEncontrados[i].GeneroJuego) != -1
        ) {
          juegonuevo = {
            IdJuego: listaJuegosEncontrados[i].IdJuego,
            NombreJuego: listaJuegosEncontrados[i].NombreJuego,
            Precio: listaPrecios[i],
          };
          this.listaJuegos.push(juegonuevo);
        }
      } else {
        juegonuevo = {
          IdJuego: listaJuegosEncontrados[i].IdJuego,
          NombreJuego: listaJuegosEncontrados[i].NombreJuego,
          Precio: listaPrecios[i],
        };
        this.listaJuegos.push(juegonuevo);
      }
    }
    /* console.log(this.juegosporNombre);
    if (this.juegosporNombre.length > 0)
      this.listaJuegos = this.juegosporNombre; */
  }

  //Al cambiar los filtros, guardar el genero añadido.
  guardarGenero(genero: string) {
    if (this.filtroGeneros.indexOf(genero) != -1) {
      //Si lo encuentra, lo borra
      const resultado = this.filtroGeneros.filter(
        (generoEliminar) => generoEliminar != genero
      );
      this.filtroGeneros = resultado;
    } else {
      this.filtroGeneros.push(genero);
    }

    this.listaJuegos = [];
    this.mostrarJuegos(
      this.juegosEncontrados,
      this.filtroGeneros,
      this.listaPrecios
    );
    //Llamar a la consulta y cambiar los datos mostrados.
    /* this.obtenerDescriptordePlataformadeRuta(); */
  }

  buscarPorNombre() {
    /* this.listaJuegos = [];
    this.juegosporNombre = [];
    this.mostrarJuegos(
      this.juegosEncontrados,
      this.filtroGeneros,
      this.listaPrecios
    ); */
  }

  //De entre todos los juegos de la plataforma seleccionada, mostrar solo aquellos que
  //Coincidan parcialmente con el nombre del juego introducido.
  obtenerListadoJuegosporListaIdsJuegosyNombre(
    listaIdsJuegos: number[],
    listaPrecios: number[],
    nombreJuegoBuscado: string
  ) {
    let juegonuevo: JuegoShort;
    for (let i = 0; i < listaIdsJuegos.length; i++) {
      this.juegosService.getJuegoPorId(listaIdsJuegos[i]).subscribe((juego) => {
        if (true) {
          juegonuevo = {
            IdJuego: juego[0].IdJuego,
            NombreJuego: juego[0].NombreJuego,
            Precio: listaPrecios[i],
          };
          this.listaJuegos.push(juegonuevo);
        }
      });
    }
  }
}
