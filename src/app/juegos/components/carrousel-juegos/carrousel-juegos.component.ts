import { Component, Input } from '@angular/core';
import { Juego, JuegoShort } from '../../interfaces/juegos.interfaces';
import { JuegosService } from '../../services/juegos.service';

@Component({
  selector: 'app-carrousel-juegos',
  templateUrl: './carrousel-juegos.component.html',
  styleUrls: ['./carrousel-juegos.component.css'],
})
export class CarrouselJuegosComponent {
  @Input() idcarrousel!: string;
  marcaidCarrousel!: string;
  tagid!: string;
  juego!: Juego;
  juegoshort!: JuegoShort;

  listajuegosshortp1: JuegoShort[] = [];
  listajuegosshortp2: JuegoShort[] = [];
  listajuegosshortp3: JuegoShort[] = [];

  listajuegos: Juego[] = [
    {
      IdJuego: 3,
      NombreJuego: 'Super Mario Oddisey',
      GeneroJuego: 'Plataformas',
      JugadoresMaximos: 1,
      Descripcion: 'Bienvenido al reino champiñon',
      Online: false,
      FechaLanzamiento: '20/10/2019',
      Imagen: '../../../../assets/img2.png',
    },
    {
      IdJuego: 4,
      NombreJuego: 'Super Mario Oddisey',
      GeneroJuego: 'Plataformas',
      JugadoresMaximos: 1,
      Descripcion: 'Bienvenido al reino champiñon',
      Online: false,
      FechaLanzamiento: '20/10/2019',
      Imagen: '../../../../assets/img2.png',
    },
    {
      IdJuego: 5,
      NombreJuego: 'Super Mario Oddisey',
      GeneroJuego: 'Plataformas',
      JugadoresMaximos: 1,
      Descripcion: 'Bienvenido al reino champiñon',
      Online: false,
      FechaLanzamiento: '20/10/2019',
      Imagen: '../../../../assets/img2.png',
    },
    {
      IdJuego: 6,
      NombreJuego: 'Super Mario Oddisey',
      GeneroJuego: 'Plataformas',
      JugadoresMaximos: 1,
      Descripcion: 'Bienvenido al reino champiñon',
      Online: false,
      FechaLanzamiento: '20/10/2019',
      Imagen: '../../../../assets/img2.png',
    },
    {
      IdJuego: 7,
      NombreJuego: 'Super Mario Oddisey',
      GeneroJuego: 'Plataformas',
      JugadoresMaximos: 1,
      Descripcion: 'Bienvenido al reino champiñon',
      Online: false,
      FechaLanzamiento: '20/10/2019',
      Imagen: '../../../../assets/img2.png',
    },
    {
      IdJuego: 8,
      NombreJuego: 'Super Mario Oddisey',
      GeneroJuego: 'Plataformas',
      JugadoresMaximos: 1,
      Descripcion: 'Bienvenido al reino champiñon',
      Online: false,
      FechaLanzamiento: '20/10/2019',
      Imagen: '../../../../assets/img2.png',
    },
    {
      IdJuego: 9,
      NombreJuego: 'Super Mario Oddisey',
      GeneroJuego: 'Plataformas',
      JugadoresMaximos: 1,
      Descripcion: 'Bienvenido al reino champiñon',
      Online: false,
      FechaLanzamiento: '20/10/2019',
      Imagen: '../../../../assets/img2.png',
    },
    {
      IdJuego: 10,
      NombreJuego: 'Super Mario Oddisey',
      GeneroJuego: 'Plataformas',
      JugadoresMaximos: 1,
      Descripcion: 'Bienvenido al reino champiñon',
      Online: false,
      FechaLanzamiento: '20/10/2019',
      Imagen: '../../../../assets/img2.png',
    },
    {
      IdJuego: 11,
      NombreJuego: 'Super Mario Oddisey',
      GeneroJuego: 'Plataformas',
      JugadoresMaximos: 1,
      Descripcion: 'Bienvenido al reino champiñon',
      Online: false,
      FechaLanzamiento: '20/10/2019',
      Imagen: '../../../../assets/img2.png',
    },
    {
      IdJuego: 12,
      NombreJuego: 'Super Mario Oddisey',
      GeneroJuego: 'Plataformas',
      JugadoresMaximos: 1,
      Descripcion: 'Bienvenido al reino champiñon',
      Online: false,
      FechaLanzamiento: '20/10/2019',
      Imagen: '../../../../assets/img2.png',
    },
  ];

  constructor(private JuegosService: JuegosService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.marcaidCarrousel = this.idcarrousel;
    this.tagid = '#' + this.marcaidCarrousel;
    if (this.listajuegosshortp1.length == 0) {
      this.JuegosService.getJuegos().subscribe((juegos) => {
        for (let i = 0; i < 12; i++) {
          this.juegoshort = {
            IdJuego: juegos[i].IdJuego,
            NombreJuego: juegos[i].NombreJuego,
            Precio: 59.95,
          };
          if (i >= 0 && i < 4) this.listajuegosshortp1.push(this.juegoshort);
          if (i >= 4 && i < 8) this.listajuegosshortp2.push(this.juegoshort);
          if (i >= 8 && i < 12) this.listajuegosshortp3.push(this.juegoshort);
        }
      });
    }
  }

  //TODO Función que busque los juegos más vendido. Para ello, necesitará cruzar varias consultas:
  //- Contar el número de ejemplares vendido en los últimos 30 dias
  //- Tomar los 12 que hayan sido los más vendidos por su Id
  //- Tomar la lista y buscar sus datos en la BD

  //TODO Función que busque los 12 juegos lanzados más recientemente a partir de la fecha del
  //Sistema. Para ello, buscaremos por la fecha de hoy hacia atras y recuperamos 12 juegos.
  //Luego, buscaremos los datos de dichos 12 juegos en su tabla y los cargaremos en el
  //carrousel

  //TODO Función que busque los 12 juegos que saldrán próximamente a partir de la fecha del
  //Sistema. Para ello, buscaremos por la fecha de hoy hacia delante y recuperamos 12 juegos.
  //Luego, buscaremos los datos de dichos 12 juegos en su tabla y los cargaremos en el
  //carrousel
}
