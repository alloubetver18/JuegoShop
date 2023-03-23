import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { JuegoShort } from 'src/app/juegos/interfaces/juegos.interfaces';
import { JuegosService } from 'src/app/juegos/services/juegos.service';

/* let ELEMENT_DATA: JuegoShort[] = [
  {
    IdJuego: 1,
    NombreJuego: 'Resident Evil 3',
    IdPlataforma: 3,
    Precio: 19.95,
  },
  {
    IdJuego: 2,
    NombreJuego: 'The Legend of Zelda: Breath of the Wild',
    IdPlataforma: 1,
    Precio: 49.95,
  },
]; */

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
export class CestaComponent implements OnInit {
  ELEMENT_DATA: JuegoShort[] = [
    {
      IdJuego: 1,
      NombreJuego: 'Resident Evil 3',
      IdPlataforma: 3,
      Precio: 19.95,
    },
    {
      IdJuego: 2,
      NombreJuego: 'The Legend of Zelda: Breath of the Wild',
      IdPlataforma: 1,
      Precio: 49.95,
    },
  ];

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
  dataToDisplay: JuegoShort[] = [];

  dataSource = new ExampleDataSource(this.ELEMENT_DATA);

  constructor(private juegosService: JuegosService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    if (localStorage.getItem('cart') == null) this.cesta = false;
    else {
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
      this.juegosService
        .getJuegoPorId(this.datosElementosCestaFormateados[0].idJuego)
        .subscribe((juego) => {
          this.datosJuegoCesta = {
            IdJuego: this.datosElementosCestaFormateados[0].idJuego,
            NombreJuego: juego[0].NombreJuego,
            IdPlataforma: this.datosElementosCestaFormateados[0].idPlataforma,
            Precio: this.datosElementosCestaFormateados[0].Precio,
          };
          this.ELEMENT_DATA.push(this.datosJuegoCesta);
        });
      this.dataToDisplay = [...this.ELEMENT_DATA];
      console.log('Datos a mostrar en ngOnInit: ', this.ELEMENT_DATA);
      this.dataSource.setData(this.ELEMENT_DATA);
      console.log(this.dataSource);
      this.cesta = true;
    }
  }

  obtenerDatosCesta() {
    if (localStorage.getItem('cart') == null) this.cesta = false;
    else {
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

      this.juegosService
        .getJuegoPorId(this.datosElementosCestaFormateados[0].idJuego)
        .subscribe((juego) => {
          this.datosJuegoCesta = {
            IdJuego: this.datosElementosCestaFormateados[0].idJuego,
            NombreJuego: juego[0].NombreJuego,
            IdPlataforma: this.datosElementosCestaFormateados[0].idPlataforma,
            Precio: this.datosElementosCestaFormateados[0].Precio,
          };
          this.guardarDatosTablaCarro(this.datosJuegoCesta);
        });
      this.dataToDisplay = [...this.ELEMENT_DATA];

      this.dataSource = new ExampleDataSource(this.dataToDisplay);
    }
  }

  guardarDatosTablaCarro(juego: JuegoShort) {
    console.log(this.ELEMENT_DATA);
    this.ELEMENT_DATA.push(juego);
  }

  borrarJuego(idJuegoBorrar: number) {
    console.log('Borrando juego con id: ', idJuegoBorrar);
    const resultado = this.dataToDisplay.filter(
      (Juego) => Juego.IdJuego != idJuegoBorrar
    );
    this.dataToDisplay = resultado;
    this.dataSource.setData(this.dataToDisplay);
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
