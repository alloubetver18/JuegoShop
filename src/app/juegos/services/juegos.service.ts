import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Juego,
  Plataforma,
  JuegosPlataforma,
  Codigos,
} from '../interfaces/juegos.interfaces';

@Injectable({
  providedIn: 'root',
})
export class JuegosService {
  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) {}

  //TODO Obtener de la base de datos un listado de juegos. A ser posible, solo los 12
  //más recientes
  getJuegos(): Observable<Juego[]> {
    return this.http.get<Juego[]>(`${this.baseURL}/Juegos?_limit=12`);
  }

  //Obtener juego por su id
  getJuegoPorId(IdJuego: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(`${this.baseURL}/Juegos?IdJuego=${IdJuego}`);
  }

  //Obtener una lista de juegos por nombre o parte de un nombre
  getJuegosPorNombre(Nombre: string): Observable<Juego[]> {
    return this.http.get<Juego[]>(
      `${this.baseURL}/Juegos?NombreJuego_like=${Nombre}`
    );
  }

  //Sin recibir parámetros, tomará la fecha del sistema y devolverá el listado con los 12 juegos
  //más recientes de la base de datos, ordenados por su fecha de lanzamiento
  getJuegosRecientes(): Observable<Juego[]> {
    const fechaActual = new Date();
    let month = fechaActual.getMonth() + 1;
    let day = fechaActual.getDate();
    let daystr = '';
    let monthstr = '';
    if (day < 10) daystr = '0';
    daystr += day.toString();
    if (month < 10) monthstr = '0';
    monthstr += month.toString();
    const fechaFormateada =
      fechaActual.getFullYear() + '-' + monthstr + '-' + daystr;
    return this.http.get<Juego[]>(
      `${this.baseURL}/Juegos?FechaLanzamiento_lte=${fechaFormateada}
        &_sort=FechaLanzamiento&_order=desc&_limit=12`
    );
  }

  //TODO Obtener de la base de datos un listado con los 12 juegos más vendidos hasta
  //ahora
  getJuegosMasVendidos() {}

  //Sin recibir parámetros, tomará la fecha del sistema y devolverá el listado con los 12 juegos
  //más próximos a salir de la base de datos, ordenados por su fecha de lanzamiento, excluyendo los
  //que salgan hoy (que irén en estrenos recientes)
  getJuegosProximos(): Observable<Juego[]> {
    const fechaActual = new Date();
    let month = fechaActual.getMonth() + 1;
    let day = fechaActual.getDate();
    let daystr = '';
    let monthstr = '';
    if (day < 10) daystr = '0';
    daystr += day.toString();
    if (month < 10) monthstr = '0';
    monthstr += month.toString();
    const fechaFormateada =
      fechaActual.getFullYear() + '-' + monthstr + '-' + daystr;
    return this.http.get<Juego[]>(
      `${this.baseURL}/Juegos?FechaLanzamiento_gte=${fechaFormateada}
        &_sort=FechaLanzamiento&_order=asc&_limit=12&FechaLanzamiento_ne=${fechaFormateada}`
    );
  }

  //TODO Obtener todas las plataformas para las que existe un juego concreto
  getPlataformasdeJuegoporId(idJuego: number): Observable<JuegosPlataforma[]> {
    return this.http.get<JuegosPlataforma[]>(
      `${this.baseURL}/JuegosPlataformas?IdJuego=${idJuego}`
    );
  }

  //TODO Obtener los datos de una plataforma
  getPlataformaporId(IdPlataforma: number): Observable<Plataforma[]> {
    return this.http.get<Plataforma[]>(
      `${this.baseURL}/Plataformas?IdPlataforma=${IdPlataforma}`
    );
  }

  //TODO Obtener los juegos de una plataforma o pareja de plataformas específica
  getJuegosporPlataformas(
    IdPlataforma: number
  ): Observable<JuegosPlataforma[]> {
    return this.http.get<JuegosPlataforma[]>(
      `${this.baseURL}/JuegosPlataformas?IdPlataforma=${IdPlataforma}`
    );
  }

  //TODO Obtener Id de plataformas por su descriptor

  getPlataformasporDescriptor(descriptor: string): Observable<Plataforma[]> {
    return this.http.get<Plataforma[]>(
      `${this.baseURL}/Plataformas?NombrePlataforma_like=${descriptor}`
    );
  }

  //TODO Teniendo un id de juego y un id de plataforma, obtener todos los códigos correspondientes a
  //dicho juego

  getCodigosporJuegoyPlataforma(
    idJuego: number,
    idPlataforma: number
  ): Observable<Codigos[]> {
    return this.http.get<Codigos[]>(
      `${this.baseURL}/Codigos?IdJuegoCodigo=${idJuego}&IdJuegoPlataforma=${idPlataforma}&Disponible=true`
    );
  }

  //Obtener precio de un juego por su IdJuego y su IdPlataforma
  getPreciosJuegosporJuegoyPlataforma(
    idJuego: number,
    idPlataforma: number
  ): Observable<JuegosPlataforma[]> {
    return this.http.get<JuegosPlataforma[]>(
      `${this.baseURL}/JuegosPlataformas?IdJuego=${idJuego}&IdPlataforma=${idPlataforma}`
    );
  }

  //TODO Métodos para el Admin: Agregar, Modificar y Borrar juegos
  //NOTA Esto probablemente irá en la sección protected
  agregarJuego() {}
  actualizarJuego() {}
  borrarJuego() {}
}
