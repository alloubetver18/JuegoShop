import { Component, Input, OnInit } from '@angular/core';
import { JuegosService } from '../../services/juegos.service';
import { Juego, JuegoShort } from '../../interfaces/juegos.interfaces';

@Component({
  selector: 'app-juego-datos',
  templateUrl: './juego-datos.component.html',
  styleUrls: ['./juego-datos.component.css'],
})
export class JuegoDatosComponent {
  //TODO: Recibirá datos de una consulta e irá generando una serie de tarjetas
  //con los datos de cada juego.
  @Input() infojuego!: JuegoShort;
  @Input() estaEnElPadre = true;
  ruta!: string;
  constructor() {}
}
