import { Component, ViewChild } from '@angular/core';
import { JuegoShort } from 'src/app/juegos/interfaces/juegos.interfaces';
import { JuegosService } from 'src/app/juegos/services/juegos.service';
import { MatTable } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';

export interface DatosCesta {
  idJuego: number;
  idPlataforma: number;
  Precio: number;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

let ELEMENT_CART: JuegoShort[] = [];

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
    'Borrar',
  ];
  dataSource = ELEMENT_CART;

  cesta: boolean = false;
  cestaLlena: string = '';
  elementosCesta: string[] = [];
  datosElementosCesta: string[] = [];
  datosElementosCestaFormateados: DatosCesta[] = [];
  infoDatosCesta: DatosCesta = {
    idJuego: 0,
    idPlataforma: 0,
    Precio: 0.0,
  };

  datosJuegosCestaLlena: JuegoShort[] = [];
  datosJuegoCesta: JuegoShort = {
    IdJuego: 0,
    NombreJuego: '0',
    IdPlataforma: 0,
    Precio: 0,
  };

  precioTotal: number = 0;

  constructor() {
    this.obtenerDatosCesta();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log('Entra en AfterViewInit');
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
    this.datosJuegosCestaLlena = JSON.parse(localStorage.getItem('cart') || '');
  }
  //Función que, para cada elemento de datosElementosCestaFormateados, llamará al servicio y obtendrá,
  //en base a su IdJuego, su NombreJuego y, utilizando el nombre y los datos de cada elemento de
  //datosElementosCestaFormateados, llenará un nuevo array de tipo juegoShort que contendrá todos los
  //datos del juego mas su nombre.
  cargarCestaEnMemoria() {
    this.datosJuegosCestaLlena.forEach((elementoCesta) => {
      ELEMENT_CART.push(elementoCesta);
    });
  }

  borrarJuego(idJuegoBorrar: number) {
    console.log('Borrando juego con id: ', idJuegoBorrar);

    const resultado = this.datosJuegosCestaLlena.filter(
      (Juego) => Juego.IdJuego != idJuegoBorrar
    );
    this.datosJuegosCestaLlena = resultado;
    localStorage.setItem('cart', JSON.stringify(this.datosJuegosCestaLlena));
    this.vaciarTabla();
    this.formatearDatosLocalStorage();
    this.cargarCestaEnMemoria();
    this.calcularPrecioFinal();
    this.table.renderRows();
  }

  vaciarTabla() {
    this.datosJuegosCestaLlena.length = 0;
    ELEMENT_CART.length = 0;
    this.precioTotal = 0;
  }

  calcularPrecioFinal() {
    this.precioTotal = 0;
    this.datosJuegosCestaLlena.forEach((element) => {
      if (element.Precio != undefined) this.precioTotal += element.Precio;
    });
  }
}
