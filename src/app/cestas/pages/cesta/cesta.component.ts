import { Component, ViewChild } from '@angular/core';
import { JuegoShort } from 'src/app/juegos/interfaces/juegos.interfaces';
import { JuegosService } from 'src/app/juegos/services/juegos.service';
import { MatTable } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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

@Component({
  selector: 'app-cesta',
  templateUrl: './cesta.component.html',
  styleUrls: ['./cesta.component.css'],
})
export class CestaComponent {
  @ViewChild(MatTable)
  table!: MatTable<PeriodicElement>;

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
    });
  }

  borrarJuego(idJuegoBorrar: number) {
    console.log('Borrando juego con id: ', idJuegoBorrar);
    console.log('Array a modificar: ', this.datosElementosCestaFormateados);

    const resultado = this.datosElementosCestaFormateados.filter(
      (Juego) => Juego.IdJuego != idJuegoBorrar
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

  vaciarTabla() {
    this.datosElementosCestaFormateados.length = 0;
    ELEMENT_CART.length = 0;
    this.precioTotal = 0;
  }

  calcularPrecioFinal() {
    this.precioTotal = 0;
    this.datosElementosCestaFormateados.forEach((element) => {
      if (element.Precio != undefined)
        this.precioTotal += element.Precio * element.Cantidad;
    });
    console.log('Precio total: ', this.precioTotal);
  }
}
