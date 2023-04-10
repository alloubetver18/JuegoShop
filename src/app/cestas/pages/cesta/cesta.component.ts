import { Component, ViewChild } from '@angular/core';
import { JuegoShort } from 'src/app/juegos/interfaces/juegos.interfaces';
import { JuegosService } from 'src/app/juegos/services/juegos.service';
import { MatTable } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/auth/interfaces/usuarios.interfaces';
import { Cesta } from '../../interfaces/cesta.interface';

export interface DatosCesta {
  IdJuego: number;
  NombreJuego: string;
  IdPlataforma: number;
  Precio: number;
  Cantidad: number;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

let ELEMENT_CART: DatosCesta[] = [];

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-cesta',
  templateUrl: './cesta.component.html',
  styleUrls: ['./cesta.component.css'],
})
export class CestaComponent {
  @ViewChild(MatTable)
  table!: MatTable<PeriodicElement>;

  cantidad: Food[] = [
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' },
    { value: '4', viewValue: '4' },
    { value: '5', viewValue: '5' },
  ];

  cantidadActual: string[] = [];
  posicionCesta: number = 0;

  displayedColumns: string[] = [
    'NombreJuego',
    'IdPlataforma',
    'Precio',
    'Cantidad',
    'Borrar',
  ];
  dataSource = ELEMENT_CART;

  cesta: boolean = true;
  usuarioLogueado: boolean = false;
  datosUsuarioLogueado: Usuario = {
    id: '',
    Nombre: '',
    Email: '',
    Pass: '',
  };
  cestaLlena: string = '';
  elementosCesta: string[] = [];
  datosElementosCesta: string[] = [];
  datosElementosCestaFormateados: DatosCesta[] = [];
  infoDatosCesta: DatosCesta = {
    IdJuego: 0,
    NombreJuego: '',
    IdPlataforma: 0,
    Precio: 0.0,
    Cantidad: 0,
  };

  datosJuegosCestaLlena: JuegoShort[] = [];
  datosJuegoCesta: JuegoShort = {
    IdJuego: 0,
    NombreJuego: '0',
    IdPlataforma: 0,
    Precio: 0,
  };

  precioTotal: number = 0;

  constructor(private router: Router) {
    console.log(this.router.url);
    this.comprobarUsuario();
    this.obtenerDatosCesta();
    /* let fechaHoy = new Date();
    let fechaActualFormateada =
      fechaHoy.getFullYear().toString() +
      '/' +
      (fechaHoy.getMonth() + 1).toString() +
      '/' +
      fechaHoy.getDate().toString();
    console.log(fechaActualFormateada); */
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('saliendo');
    this.vaciarTabla();
  }

  //Si el usuario está logueado, recuperamos sus datos y cambiamos la variable booleana de control.
  comprobarUsuario() {
    if (sessionStorage.getItem('user') == null) this.usuarioLogueado = false;
    else {
      console.log(sessionStorage.getItem('user'));
      this.datosUsuarioLogueado = JSON.parse(
        sessionStorage.getItem('user') || ''
      );
      this.usuarioLogueado = true;
    }
  }

  obtenerDatosCesta() {
    //Paso 1: Revisamos LS. Si no tiene datos, sale. Si los tiene, los recupera.
    if (localStorage.getItem('cart') == null) this.cesta = false;
    else {
      this.formatearDatosLocalStorage();
      this.cargarCestaEnMemoria();
      this.calcularPrecioFinal();
      this.cesta = true;
    }
  }

  //Buscamos los datos del carro en el LS, los formateamos mediante una interfaz de tipo DatosCesta
  //Que contiene los siguientes datos:
  //idJuego
  //idPlataforma
  //Precio
  //y los almacena en un array para los datos formateados llamado datosElementosCestaFormateados
  formatearDatosLocalStorage() {
    if (localStorage.getItem('cart'))
      this.datosElementosCestaFormateados = JSON.parse(
        localStorage.getItem('cart') || ''
      );
  }
  //Función que, para cada elemento de datosElementosCestaFormateados, llamará al servicio y obtendrá,
  //en base a su IdJuego, su NombreJuego y, utilizando el nombre y los datos de cada elemento de
  //datosElementosCestaFormateados, llenará un nuevo array de tipo juegoShort que contendrá todos los
  //datos del juego mas su nombre.
  cargarCestaEnMemoria() {
    this.datosElementosCestaFormateados.forEach((elementoCesta) => {
      console.log(elementoCesta);
      ELEMENT_CART.push(elementoCesta);
      this.cantidadActual[this.posicionCesta] =
        elementoCesta.Cantidad.toString();
      this.posicionCesta++;
    });
  }

  //Tomando la id del juego a borrar, lo eliminamos del array del cual carga la tabla. Al mismo
  //tiempo, lo borramos de LS y volvemos a cargar los datos.
  borrarJuego(idJuegoBorrar: number, idPlataformaBorrar: number) {
    console.log('Borrando juego con id: ', idJuegoBorrar);
    console.log('Borrar juego de plataforma: ', idPlataformaBorrar);
    console.log('Array a modificar: ', this.datosElementosCestaFormateados);
    this.datosElementosCestaFormateados.forEach((element) => {
      if (
        element.IdJuego === idJuegoBorrar &&
        element.IdPlataforma === idPlataformaBorrar
      )
        element.IdPlataforma = 0;
    });
    const resultado = this.datosElementosCestaFormateados.filter(
      (Juego) => Juego.IdPlataforma != 0
    );
    this.datosElementosCestaFormateados = resultado;
    if (this.datosElementosCestaFormateados.length > 0)
      localStorage.setItem(
        'cart',
        JSON.stringify(this.datosElementosCestaFormateados)
      );
    else localStorage.removeItem('cart');
    this.vaciarTabla();
    this.formatearDatosLocalStorage();
    this.cargarCestaEnMemoria(); /**/
    this.calcularPrecioFinal();
    this.table.renderRows();
  }

  //Limpiamos los datos contenidos en el Mat-table
  vaciarTabla() {
    this.datosElementosCestaFormateados.length = 0;
    ELEMENT_CART.length = 0;
    this.precioTotal = 0;
  }

  //En base a los juegos que existen dentro de la cesta, calculamos su precio total.
  calcularPrecioFinal() {
    this.precioTotal = 0;
    this.datosElementosCestaFormateados.forEach((element) => {
      if (element.Precio != undefined)
        this.precioTotal += element.Precio * element.Cantidad;
    });
    console.log('Precio total: ', this.precioTotal);
  }

  //Incrementamos la cantidad de unidades de un determinado juego que hay en la cesta. Se actualiza tanto
  //en la tabla como en LS
  incrementarCantidad(
    idJuegoActualizar: number,
    idPlataformaActualizar: number
  ) {
    this.datosElementosCestaFormateados.forEach((elementoCesta) => {
      if (
        elementoCesta.IdJuego == idJuegoActualizar &&
        elementoCesta.IdPlataforma == idPlataformaActualizar &&
        elementoCesta.Cantidad < 5
      )
        elementoCesta.Cantidad++;
    });
    localStorage.setItem(
      'cart',
      JSON.stringify(this.datosElementosCestaFormateados)
    );
    this.vaciarTabla();
    this.formatearDatosLocalStorage();
    this.cargarCestaEnMemoria(); /**/
    this.calcularPrecioFinal();
    this.table.renderRows();
  }
  //Decrementamos la cantidad de unidades de un determinado juego que hay en la cesta. Se actualiza tanto
  //en la tabla como en LS
  decrementarCantidad(
    idJuegoActualizar: number,
    idPlataformaActualizar: number
  ) {
    this.datosElementosCestaFormateados.forEach((elementoCesta) => {
      if (
        elementoCesta.IdJuego == idJuegoActualizar &&
        elementoCesta.IdPlataforma == idPlataformaActualizar &&
        elementoCesta.Cantidad > 1
      )
        elementoCesta.Cantidad--;
    });
    localStorage.setItem(
      'cart',
      JSON.stringify(this.datosElementosCestaFormateados)
    );
    this.vaciarTabla();
    this.formatearDatosLocalStorage();
    this.cargarCestaEnMemoria(); /**/
    this.calcularPrecioFinal();
    this.table.renderRows();
  }

  comprarProductosCestaCompra() {
    let nuevaIdCesta = 0;
    let idUsuarioActivo = parseInt(this.datosUsuarioLogueado.id);
    let emailUsuarioActivo = this.datosUsuarioLogueado.Email;
    let fechaActual = new Date();
    let fechaActualFormateada =
      fechaActual.getFullYear().toString +
      '/' +
      (fechaActual.getMonth() + 1).toString +
      '/' +
      fechaActual.getDate().toString;
    let precioTotal = this.precioTotal;
    let compraExitosa = true;
    let cestaCompraCompleta = this.datosElementosCestaFormateados;
    let listaIdsCodigos: number[] = [];
    let InfoNuevaCesta: Cesta = {
      idCesta: 0,
      idUsuario: 0,
      Email: '',
      Fecha: '',
      PrecioTotal: 0,
      CompraFinalizada: false,
    };

    //1.1 Obtenemos la última IdCesta que exista
    /* nuevaIdCesta = obtenerUltimaIdCesta() + 1; */
    //1.2 Creamos una nueva cesta y la recuperamos
    InfoNuevaCesta = {
      idCesta: nuevaIdCesta,
      idUsuario: idUsuarioActivo,
      Email: emailUsuarioActivo,
      Fecha: fechaActualFormateada,
      PrecioTotal: precioTotal,
      CompraFinalizada: true,
    };

    //1.3 La guardamos en la BD
    /* guardarCompraenelSistema(InfoNuevaCesta); */
    //2.1 Tomamos el Array de la cesta de la compra
    //Por cada elemento de la cesta (un bucle por cada elemento de la cesta):
    //Un bucle por la cantidad de cada elemento de la cesta
    //En cada iteración, recuperamos el id de un código válido para el juego y la plataforma correctas.
    //Para que esté disponible, Su valor de Disponible debe ser True
    //En el caso de no haberlo, ¿cancelar el proceso? No, porque si no hay suficiente, no deja añadirlo.
    //Las comprobaciones las realiza en la página del juego.
    //El identificador del código se almacena en un array de codigos a comprar
    //2.2 Una vez almacenado, cambiar el valor de Disponible a False
    //3.1 Obtenemos el id del último CodigoCesta
    //3.2 A partir de él, y utilizando el IdCesta almacenado, recorremos el array de Códigos asignados
    //Para la cesta los vamos añadiendo en CodigosCesta con los siguientes datos:
    //IdCodigo: Iteración del bucle
    //IdCesta: El almacenado en memoria.
  }

  /* TODO Teniendo una serie de elementos, programar que se almacene en la BD la compra de uno
  o más productos añadidos a la cesta de la compra. Para ello, se seguirá el siguiente procedimiento:
  1.- Tomamos los siguientes datos del sistema:
    - Último ID de cesta disponible (para generar una id nueva, o bien crear una nueva id a partir de
      ciertos datos. Como en estos momentos la id de la cesta es numérica, opto por recuperar
      la última id existente).
    - La Id del usuario activo.
    - El email del usuario activo.
    - La fecha de hoy
    - El precio total de la compra
    - Una variable booleana que apuntará a que la compra ha sido exitosa

    Con estos datos, creamos un nuevo registro en la tabla Cestas. Guardamos la id de la cesta, porque
    nos hará falta.

  2.- Teniendo el array con la lista de juegos, lo recorremos uno a uno. Utilizando los siguientes datos:
    - Id del Juego
    - Id de la plataforma
    - Cantidad

    Buscaremos dentro de la tabla que relaciona los juegos y sus plataformas con los códigos de los
    juegos, y buscaremos tantos códigos válidos como pueda. Teniendo en cuenta que, los posibles
    valores de tabla son:
    - IdCodigo
    - IdJuego (lo tenemos)
    - IdPlataforma (lo tenemos)
    - Valido (DEBE SER TRUE, y después cambiar a False)
    - Código (dato que nos interesa)

  3.- Cada código que seleccionemos se relacionará directamente en una nueva tabla llamada
    CodigosCesta, para la cual necesitaremos, por cada código obtenido:
    - IdCodigoCesta (se creará a partir del último asignado)
    - IdCodigo (cada uno de los obtenidos)
    - IdCesta (lo tenemos de antes)*/
}
