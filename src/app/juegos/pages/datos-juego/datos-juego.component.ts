import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Usuario } from 'src/app/auth/interfaces/usuarios.interfaces';
import { ModalLoginComponent } from 'src/app/shared/modal-login/modal-login.component';
import {
  Juego,
  JuegoShort,
  JuegosPlataforma,
  Plataforma,
} from '../../interfaces/juegos.interfaces';
import { JuegosService } from '../../services/juegos.service';

export interface DatosCesta {
  IdJuego: number;
  NombreJuego: string;
  IdPlataforma: number;
  Precio?: number;
  Cantidad: number;
}

export interface IdJuegoPlataforma {
  IdJuego: number;
  IdPlataforma: number;
  cadena: string;
}

@Component({
  selector: 'app-datos-juego',
  templateUrl: './datos-juego.component.html',
  styleUrls: ['./datos-juego.component.css'],
})
export class DatosJuegoComponent {
  juegoRecibidoParam = {
    IdJuego: 0,
    IdPlataforma: 0,
  };
  cadenaJuegoRecibidoParam: string = '';
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

  cestaDeLaCompra: JuegoShort[] = [];
  cestaDeLaCompraPrima: DatosCesta[] = [];
  juegoParaLaCestaPrima: DatosCesta = {
    IdJuego: 0,
    NombreJuego: '',
    IdPlataforma: 0,
    Precio: 0.0,
    Cantidad: 0,
  };
  juegoParaLaCesta: JuegoShort = {
    IdJuego: 0,
    NombreJuego: '',
    IdPlataforma: 0,
    Precio: 0,
  };
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
  idJuegoPlataforma: IdJuegoPlataforma[] = [];
  indiceplataforma: number = 0;
  nuevaplataforma: Plataforma = {
    IdPlataforma: 0,
    NombrePlataforma: '',
  };
  rutaimagen: String = '../../../../assets/';
  durationInSeconds = 2;

  juegosGuardados: string = '';

  stockJuego!: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private juegosService: JuegosService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerDatosdeJuegoporsuId();
  }
  //TODO Mediante JSON.stringify, convertir un array de objetos en una cadena JSON. Para recuperarlo,
  //utilizar JSON.parse();
  openSnackBar() {
    if (sessionStorage.getItem('user') == null) {
      this._snackBar.open(
        'No está logueado en el sistema. Por favor, loguéese',
        'Aceptar',
        {
          duration: this.durationInSeconds * 1000,
        }
      );
    } //TODO Si está el usuario en el sistema, comprobamos el inventario de la tienda.
    //Para ello, debemos inyectar un servicio de... Juegos, que contendrá también una función
    //para recuperar el inventario de codigos en base a un juego Y una plataforma.
    //En el caso de recuperar un array de códigos con respecto a juego y plataforma con una
    //longitud de 0, no podrás añadir juegos a la lista (PORQUE el botón no estará visible).
    else if (localStorage.getItem('cart') == null) {
      this.juegoParaLaCestaPrima = {
        IdJuego: this.juegoConsultado.IdJuego,
        NombreJuego: this.juegoConsultado.NombreJuego,
        IdPlataforma: this.juegoRecibidoParam.IdPlataforma,
        Precio: this.juegoConsultado.Precio,
        Cantidad: 1,
      };
      this.cestaDeLaCompraPrima.push(this.juegoParaLaCestaPrima);
      this._snackBar.open('Juego metido en el carro de la compra', 'Aceptar', {
        duration: this.durationInSeconds * 1000,
      });
    } else {
      this.cestaDeLaCompraPrima = JSON.parse(
        localStorage.getItem('cart') || ''
      );
      if (
        this.buscarElementoCesta(
          this.cestaDeLaCompraPrima,
          this.juegoConsultado.IdJuego,
          this.juegoRecibidoParam.IdPlataforma
        ) != -1
      ) {
        this.aumentarInventarioCarrito(
          this.cestaDeLaCompraPrima,
          this.juegoConsultado.IdJuego,
          this.juegoRecibidoParam.IdPlataforma
        );
      } else {
        this.juegoParaLaCestaPrima = {
          IdJuego: this.juegoConsultado.IdJuego,
          NombreJuego: this.juegoConsultado.NombreJuego,
          IdPlataforma: this.juegoRecibidoParam.IdPlataforma,
          Precio: this.juegoConsultado.Precio,
          Cantidad: 1,
        };

        this.cestaDeLaCompraPrima.push(this.juegoParaLaCestaPrima);
        this._snackBar.open(
          'Juego metido en el carro de la compra',
          'Aceptar',
          {
            duration: this.durationInSeconds * 1000,
          }
        );
      }
    }
    localStorage.setItem('cart', JSON.stringify(this.cestaDeLaCompraPrima));
  }

  //Buscamos dentro del array de la cesta si ya hay un juego dentro con su id. De haberlo, aumenta la
  //cantidad. En caso contrario, devuelve -1
  // Busca el primer elemento con la edad indicada, sino devuelve -1
  buscarElementoCesta(
    cesta: DatosCesta[],
    IdJuego: number,
    IdPlataforma: number
  ) {
    for (let i = 0; i < cesta.length; i++) {
      const element = cesta[i];
      if (
        element.IdJuego === IdJuego &&
        element.IdPlataforma === IdPlataforma
      ) {
        return element;
      }
    }
    return -1;
  }

  //Ya encontrado el juego en el array de la cesta, aumentamos su cantidad.
  aumentarInventarioCarrito(
    cesta: DatosCesta[],
    IdJuego: number,
    IdPlataforma: number
  ) {
    for (let i = 0; i < cesta.length; i++) {
      const element = cesta[i];
      if (
        element.IdJuego === IdJuego &&
        element.IdPlataforma === IdPlataforma
      ) {
        if (element.Cantidad == 5)
          this._snackBar.open(
            'Lo sentimos. Solo se permite la compra de un máximo de 5 copias del mismo producto en una sola compra.',
            'Aceptar',
            {
              duration: this.durationInSeconds * 1000,
            }
          );
        else {
          element.Cantidad++;
          this._snackBar.open(
            'Juego metido en el carro de la compra',
            'Aceptar',
            {
              duration: this.durationInSeconds * 1000,
            }
          );
        }
      }
    }
  }

  //Recibiendo desde la URL la iddeJuego, llama al servicio y recupera todos sus datos
  obtenerDatosdeJuegoporsuId() {
    this.activatedRoute.paramMap.subscribe((id) => {
      this.cadenaJuegoRecibidoParam = id.get('id') || '';
      this.juegoRecibidoParam = JSON.parse(this.cadenaJuegoRecibidoParam);
      this.comprobarStock();
    });
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) =>
          this.juegosService.getJuegoPorId(this.juegoRecibidoParam.IdJuego)
        )
      )
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
    this.comprobarStock();
  }
  //Recibiendo como parámetro la iddeJuego, llama al servicio y recupera las plataformas para las
  // que dicho juego está disponible
  obtenerPlataformasdeunJuegoporIdJuego(iddeJuego: number) {
    this.juegosService
      .getPlataformasdeJuegoporId(iddeJuego)
      .subscribe((plataformasJuego) => {
        this.plataformasJuego = plataformasJuego;
        this.plataformasJuego.forEach((element) => {
          if (element.IdPlataforma == this.juegoRecibidoParam.IdPlataforma)
            this.juegoConsultado.Precio = element.Precio;
        });
        this.obtenerListadePlataformasdeJuego(this.plataformasJuego);
      });
  }
  //Recibiendo como parámetro el array de pares de un juego y sus plataformas, llama al servicio
  //por cada una y recupera los datos de las plataformas para dicho juego.
  obtenerListadePlataformasdeJuego(plataformasJuego: JuegosPlataforma[]) {
    if (this.idJuegoPlataforma.length > 0) this.idJuegoPlataforma.length = 0;
    plataformasJuego.forEach((parjuegoplataforma) => {
      this.juegosService
        .getPlataformaporId(parjuegoplataforma.IdPlataforma)
        .subscribe((plataformas) => {
          this.nuevaplataforma = {
            IdPlataforma: plataformas[0].IdPlataforma,
            NombrePlataforma: plataformas[0].NombrePlataforma,
          };
          this.idJuegoPlataforma.push({
            IdJuego: this.juegoRecibidoParam.IdJuego,
            IdPlataforma: plataformas[0].IdPlataforma,
            cadena: JSON.stringify({
              IdJuego: this.juegoRecibidoParam.IdJuego,
              IdPlataforma: plataformas[0].IdPlataforma,
            }),
          });
          if (this.plataformas.indexOf(this.nuevaplataforma) === -1) {
            this.plataformas.push(this.nuevaplataforma);
          }
          //Ordenar array de plataformas para que aparezca ordenado por la IdPlataforma
          this.idJuegoPlataforma.sort(function (a, b) {
            if (a.IdPlataforma < b.IdPlataforma) return -1;
            else if (a.IdPlataforma > b.IdPlataforma) return 1;
            else return 0;
          });
        });
    });
  }

  //Buscamos, en función del juego y la plataforma seleccionadas, si hay inventario del juego en stock
  //Si lo hay, la propiedad stockJuego pasará a ser True. Si no, pasará a ser False.
  comprobarStock() {
    this.juegosService
      .getCodigosporJuegoyPlataforma(
        this.juegoRecibidoParam.IdJuego,
        this.juegoRecibidoParam.IdPlataforma
      )
      .subscribe((cod) => {
        if (cod.length > 0) this.stockJuego = true;
        else this.stockJuego = false;
      });
  }
}
