import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Juego,
  Plataforma,
  JuegosPlataforma,
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
    return this.http.get<Juego[]>(`${this.baseURL}/Juegos`);
  }

  //Obtener juego por su id
  /* getJuegoPorId(IdJuego: number): Observable<Juego> {
    return this.http.get<Juego>(`${this.baseURL}/Juegos?IdJuego=${IdJuego}`);
  } */

  getJuegoPorId(IdJuego: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(`${this.baseURL}/Juegos?IdJuego=${IdJuego}`);
  }

  //TODO Obtener de la base de datos un listado con los últimos 12 lanzamientos de
  //cualquier plataforma
  getJuegosRecientes() {}

  //TODO Obtener de la base de datos un listado con los 12 juegos más vendidos hasta
  //ahora
  getJuegosMasVendidos() {}

  //TODO Obtener de la base de datos un listado con los próximos 12 lanzamientos de
  //cualquier plataforma
  getJuegosProximos() {}

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

  //TODO Métodos para el Admin: Agregar, Modificar y Borrar juegos
  //NOTA Esto probablemente irá en la sección protected
  agregarJuego() {}
  actualizarJuego() {}
  borrarJuego() {}
}
