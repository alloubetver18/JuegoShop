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

@Component({
  selector: 'app-cesta',
  templateUrl: './cesta.component.html',
  styleUrls: ['./cesta.component.css'],
})
export class CestaComponent {
  ELEMENT_DATA: JuegoShort[] = [];

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

  displayedColumns: string[] = [
    'NombreJuego',
    'IdPlataforma',
    'Precio',
    'Borrar',
  ];

  /* dataSource = [...this.datosElementosCestaFormateados]; */
  dataSource!: ExampleDataSource;
  dataToDisplay: JuegoShort[] = [];

  @ViewChild(MatTable) table!: MatTable<JuegoShort>;

  constructor(private juegosService: JuegosService) {
    this.dataSource = new ExampleDataSource([...this.datosJuegosCestaLlena]);
    this.obtenerDatosCesta();
    /* console.log('Datos en el constructor: ', this.datosJuegosCestaLlena);
    this.dataSource.setData(this.datosJuegosCestaLlena); */
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

  obtenerDatosCesta() {
    //Paso 1: Revisamos LS. Si no tiene datos, sale. Si los tiene, los recupera.
    if (localStorage.getItem('cart') == null) this.cesta = false;
    else {
      this.formatearDatosLocalStorage();
      //Aquí, ya tenemos los datos que se mostrarán en la cesta, pero sin el nombre del juego
      //correspondiente. Ahora, buscaremos el nombre del juego y lo añadiremos
      //a cada elemento. Luego, con los datos correctos, iremos llenando un nuevo array, esta vez con
      //todos los datos.
      this.cargarCestaEnMemoria();
      console.log('Cesta de la compra: ', this.datosJuegosCestaLlena);
      //Una vez con todos los datos, debemos refrescar la pantalla para que los datos se hagan visibles.
      //TODO Encontrar la forma de refrescar adecuadamente.

      this.cesta = true;

      this.dataSource.setData(this.datosJuegosCestaLlena);
    }
  }

  //Buscamos los datos del carro en el LS, los formateamos mediante una interfaz de tipo DatosCesta
  //Que contiene los siguientes datos:
  //idJuego
  //idPlataforma
  //Precio
  //y los almacena en un array para los datos formateados llamado datosElementosCestaFormateados
  formatearDatosLocalStorage() {
    this.cestaLlena = localStorage.getItem('cart') || '';
    this.cestaLlena = this.cestaLlena.replaceAll('Y', '');
    this.elementosCesta = this.cestaLlena.split('X');
    this.elementosCesta.forEach((elementoCesta) => {
      this.datosElementosCesta = elementoCesta.split('/');
      this.infoDatosCesta = {
        idJuego: parseInt(this.datosElementosCesta[0]),
        idPlataforma: parseInt(this.datosElementosCesta[1]),
        Precio: parseFloat(this.datosElementosCesta[2]),
      };
      this.datosElementosCestaFormateados.push(this.infoDatosCesta);
    });
  }
  //Función que, para cada elemento de datosElementosCestaFormateados, llamará al servicio y obtendrá,
  //en base a su IdJuego, su NombreJuego y, utilizando el nombre y los datos de cada elemento de
  //datosElementosCestaFormateados, llenará un nuevo array de tipo juegoShort que contendrá todos los
  //datos del juego mas su nombre.
  cargarCestaEnMemoria() {
    this.datosElementosCestaFormateados.forEach((element) => {
      this.juegosService.getJuegoPorId(element.idJuego).subscribe((juego) => {
        this.datosJuegoCesta = {
          IdJuego: element.idJuego,
          NombreJuego: juego[0].NombreJuego,
          IdPlataforma: element.idPlataforma,
          Precio: element.Precio,
        };
        this.datosJuegosCestaLlena.push(this.datosJuegoCesta);
      });
    });
  }

  borrarJuego(idJuegoBorrar: number) {
    console.log('Borrando juego con id: ', idJuegoBorrar);
    const resultado = this.datosJuegosCestaLlena.filter(
      (Juego) => Juego.IdJuego != idJuegoBorrar
    );
    this.datosJuegosCestaLlena = resultado;
    this.dataSource.setData(this.datosJuegosCestaLlena);
  }
}

class ExampleDataSource extends DataSource<JuegoShort> {
  private _dataStream = new ReplaySubject<JuegoShort[]>();

  constructor(initialData: JuegoShort[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<JuegoShort[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: JuegoShort[]) {
    this._dataStream.next(data);
  }
}
