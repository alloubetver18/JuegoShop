import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  preciosporNombre: number[] = [];
  juegosporGenero: Juego[] = [];
  preciosporGenero: number[] = [];
  juegosporPrecio: Juego[] = [];
  preciosporPrecio: number[] = [];
  juegosporNumeroJugadores: Juego[] = [];
  preciosporNumeroJugadores: number[] = [];
  checked = false;
  filtrosaAplicar: string[] = [];

  value = '';
  precioMinimo = 10;
  precioMaximo = 200;
  jugadores = 1;
  jugadoresMinimo = 1;
  jugadoresMaximo = 4;

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
    for (let i = 0; i < listaIdsJuegos.length; i++) {
      this.juegosService.getJuegoPorId(listaIdsJuegos[i]).subscribe((juego) => {
        this.juegosEncontrados.push(juego[0]);
        if (i == listaIdsJuegos.length - 1)
          this.guardaryCargarJuegos(this.juegosEncontrados, listaPrecios);
      });
    }
  }

  //En base a una lista de juegos encontrados, una lista de precios y un filtro de géneros,
  //mostraremos la lista de juegos por pantalla.
  guardaryCargarJuegos(
    listaJuegosEncontrados: Juego[],
    listaPrecios: number[]
  ) {
    this.juegosporGenero = [];
    this.preciosporGenero = [];
    this.juegosporNombre = [];
    this.preciosporNombre = [];
    this.juegosporPrecio = [];
    this.preciosporPrecio = [];
    this.juegosporNumeroJugadores = [];
    this.preciosporNumeroJugadores = [];

    this.filtrarJuegos(listaJuegosEncontrados, listaPrecios);
  }

  //Se toma el nombre y se busca dentro del array de Juegos. Si hay una conicidencia
  //total o parcial del nombre, se guarda en un array de juegos filtrador por nombre,
  //mientras que el precio se guarda en un array específico para los precios.
  guardarJuegosporNombre(
    listaJuegosEncontrados: Juego[],
    listaPrecios: number[]
  ) {
    for (let i = 0; i < listaJuegosEncontrados.length; i++) {
      if (
        listaJuegosEncontrados[i].NombreJuego.toLowerCase().includes(
          this.value.trim().toLowerCase()
        )
      ) {
        this.juegosporNombre.push(listaJuegosEncontrados[i]);
        this.preciosporNombre.push(listaPrecios[i]);
      }
    }
  }
  //Se toma, o bien el array con todos los juegos encontrados, o bien el array con los
  //nombres filtrados, y se filtran los datos por Género. De la misma forma, se guarda en
  //un array específico para juegos por género y precios por género.
  guardarJuegosporGenero(
    listaJuegosEncontrados: Juego[],
    listaPrecios: number[]
  ) {
    for (let i = 0; i < listaJuegosEncontrados.length; i++) {
      if (
        this.filtroGeneros.indexOf(listaJuegosEncontrados[i].GeneroJuego) != -1
      ) {
        this.juegosporGenero.push(listaJuegosEncontrados[i]);
        this.preciosporGenero.push(listaPrecios[i]);
      }
    }
  }

  //Se toma, o bien el array con todos los juegos encontrados, o bien el array con los
  //nombres filtrados, o bien el array con los géneros filtrados, y se filtran por precios
  //mínimos y máximos
  guardarJuegosporPrecios(
    listaJuegosEncontrados: Juego[],
    listaPrecios: number[]
  ) {
    for (let i = 0; i < listaJuegosEncontrados.length; i++) {
      if (
        listaPrecios[i] >= this.precioMinimo &&
        listaPrecios[i] <= this.precioMaximo
      ) {
        this.juegosporPrecio.push(listaJuegosEncontrados[i]);
        this.preciosporPrecio.push(listaPrecios[i]);
      }
    }
  }
  //Se toma, o bien el array con todos los juegos encontrados, o bien el array con los
  //nombres filtrados, o bien el array con los géneros filtrados, o bien el array con los
  //precios filtrados,  y se filtran por numero de jugadores
  //mínimos y máximos
  guardarJuegosporNumeroJugadores(
    listaJuegosEncontrados: Juego[],
    listaPrecios: number[]
  ) {
    for (let i = 0; i < listaJuegosEncontrados.length; i++) {
      if (
        listaJuegosEncontrados[i].JugadoresMaximos >= this.jugadoresMinimo &&
        listaJuegosEncontrados[i].JugadoresMaximos <= this.jugadoresMaximo
      ) {
        this.juegosporNumeroJugadores.push(listaJuegosEncontrados[i]);
        this.preciosporNumeroJugadores.push(listaPrecios[i]);
      }
    }
  }

  //Al cambiar los filtros, guardar el genero añadido. Luego, empieza a filtrar por ellos.
  filtrarporGeneroJuego(genero: string) {
    if (this.filtroGeneros.indexOf(genero) != -1) {
      //Si lo encuentra, lo borra
      const resultado = this.filtroGeneros.filter(
        (generoEliminar) => generoEliminar != genero
      );
      this.filtroGeneros = resultado;
    } else {
      this.filtroGeneros.push(genero);
    }

    if (
      this.filtroGeneros.length > 0 &&
      this.filtrosaAplicar.indexOf('genero') == -1
    )
      this.filtrosaAplicar.push('genero');
    else if (this.filtroGeneros.length == 0) {
      const eliminarFiltro = this.filtrosaAplicar.filter(
        (filtros) => filtros != 'genero'
      );
      this.filtrosaAplicar = eliminarFiltro;
    }

    console.log(this.filtrosaAplicar);

    this.listaJuegos = [];
    this.guardaryCargarJuegos(this.juegosEncontrados, this.listaPrecios);
  }

  //Al cambiar el nombre, vacía la lista de juegos en pantalla y empieza a filtrarla.
  filtrarporNombreJuego() {
    if (this.value.length > 0 && this.filtrosaAplicar.indexOf('nombre') == -1)
      this.filtrosaAplicar.push('nombre');
    else if (this.value.length == 0) {
      const eliminarFiltro = this.filtrosaAplicar.filter(
        (filtros) => filtros != 'nombre'
      );
      this.filtrosaAplicar = eliminarFiltro;
    }

    console.log(this.filtrosaAplicar);

    this.listaJuegos = [];
    this.guardaryCargarJuegos(this.juegosEncontrados, this.listaPrecios);
  }

  //Cuando pulsamos el botón de limpiar caja de texto, se borra su valor y se vuelve a cargar los juegos
  limpiarValorNombre() {
    this.value = '';
    this.filtrarporNombreJuego();
  }

  //Al cambiar el numero de jugadores, vaciamos la lista de juegos en pantalla y filtramos
  //por aquellos juegos que tengan un numero de jugadores entre los 2 valores
  filtrarporNumeroJugadoresJuego() {
    if (
      (this.jugadoresMinimo > 1 ||
        this.jugadoresMaximo <= 4 ||
        this.jugadoresMinimo == this.jugadoresMaximo) &&
      this.filtrosaAplicar.indexOf('numerojugadores') == -1
    )
      this.filtrosaAplicar.push('numerojugadores');
    else if (this.jugadoresMinimo == 1 && this.jugadoresMaximo == 4) {
      const eliminarFiltro = this.filtrosaAplicar.filter(
        (filtros) => filtros != 'numerojugadores'
      );
      this.filtrosaAplicar = eliminarFiltro;
    }

    console.log(this.filtrosaAplicar);

    this.listaJuegos = [];
    this.guardaryCargarJuegos(this.juegosEncontrados, this.listaPrecios);
  }

  //Al cambiar el valor del precio, vaciamos la lista de juegos en pantalla y filtramos por
  //aquellos juegos cuyo precio sea...
  //o mayor que el número minimo
  //y menor que el número máximo
  filtrarporPrecioJuego() {
    if (
      (this.precioMinimo > 10 || this.precioMaximo < 200) &&
      this.filtrosaAplicar.indexOf('precio') == -1
    )
      this.filtrosaAplicar.push('precio');
    else if (this.precioMinimo == 10 && this.precioMaximo == 200) {
      const eliminarFiltro = this.filtrosaAplicar.filter(
        (filtros) => filtros != 'precio'
      );
      this.filtrosaAplicar = eliminarFiltro;
    }

    console.log(this.filtrosaAplicar);

    this.listaJuegos = [];
    this.guardaryCargarJuegos(this.juegosEncontrados, this.listaPrecios);
  }

  //Pasando un array de Juegos y un array de numeros, cargamos la lista de los juegos en pantalla
  cargarListaJuegos(listaJuegos: Juego[], listaPrecios: number[]) {
    let juegonuevo: JuegoShort;
    for (let i = 0; i < listaJuegos.length; i++) {
      juegonuevo = {
        IdJuego: listaJuegos[i].IdJuego,
        NombreJuego: listaJuegos[i].NombreJuego,
        Precio: listaPrecios[i],
      };
      this.listaJuegos.push(juegonuevo);
    }
  }

  //Obteniendo como parámetros una lista de juegos completa y una lista de precios,
  //comprobará si existen filtros a aplicar sobre dicha lista de juegos.
  //En caso de no haberlos, cargará toda la lista de juegos.
  //En el caso de si haberlos, creará una copia local, irá filtrando en base a ella, y cuando
  //acabe de filtrar, la mostrará por pantalla.
  filtrarJuegos(listaJuegosEncontrados: Juego[], listaPrecios: number[]) {
    if (this.filtrosaAplicar.length == 0) {
      this.cargarListaJuegos(listaJuegosEncontrados, listaPrecios);
    } else {
      let listaJuegosFiltrados: Juego[] = listaJuegosEncontrados;
      let listaPreciosFiltrados: number[] = listaPrecios;
      this.filtrosaAplicar.forEach((filtro) => {
        switch (filtro) {
          case 'genero':
            this.guardarJuegosporGenero(
              listaJuegosFiltrados,
              listaPreciosFiltrados
            );
            listaJuegosFiltrados = this.juegosporGenero;
            listaPreciosFiltrados = this.preciosporGenero;
            break;
          case 'nombre':
            this.guardarJuegosporNombre(
              listaJuegosFiltrados,
              listaPreciosFiltrados
            );
            listaJuegosFiltrados = this.juegosporNombre;
            listaPreciosFiltrados = this.preciosporNombre;
            break;
          case 'precio':
            this.guardarJuegosporPrecios(
              listaJuegosFiltrados,
              listaPreciosFiltrados
            );
            listaJuegosFiltrados = this.juegosporPrecio;
            listaPreciosFiltrados = this.preciosporPrecio;
            break;
          case 'numerojugadores':
            this.guardarJuegosporNumeroJugadores(
              listaJuegosFiltrados,
              listaPreciosFiltrados
            );
            listaJuegosFiltrados = this.juegosporNumeroJugadores;
            listaPreciosFiltrados = this.preciosporNumeroJugadores;
            break;
        }
      });
      this.cargarListaJuegos(listaJuegosFiltrados, listaPreciosFiltrados);
    }
  }
}
