import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CestasService {
  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) {}

  //TODO En base a la Id de un usuario, recuperar la cesta cuyo id coincida y que posea un valor de
  //CompraFinalizada en false

  //TODO Crear una nueva cesta de la compra en base a:
  /* - IdCesta: el siguiente registro posible
     - IdUsuario: el id del usuario logueado
     - Email: el email del usuario, o por defecto aquel al que el propio usuario pidió mandar el
       codigo del producto comprado
     - Fecha: la fecha en la que se crea/modifica la cesta
     - CompraFinalizada: un booleano que indica si la compra ha sido finalizada o no.*/

  //TODO En base a una id de cesta, recuperamos todos los juegos de la lista de dicha cesta, para después
  //introducirlos de nuevo en la interfaz

  //TODO Una vez que salimos del sistema o compramos, guardaremos los datos de la cesta modificados
}
