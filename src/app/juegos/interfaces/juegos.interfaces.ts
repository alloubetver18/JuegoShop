import { NumberSymbol } from '@angular/common';

export interface DBJuegoshopBeta {
  Juegos: Juego[];
  Plataformas: Plataforma[];
  JuegosPlataformas: JuegosPlataforma[];
  Codigos: Codigos[];
  Cestas: Cesta[];
  CodigosCestas: CodigosCesta[];
}

export interface Cesta {
  idCesta: number;
  idUsuario: number;
  Email: string;
  Fecha: string;
}

export interface Codigos {
  idCodigo: number;
  idJuegoCodigo: number;
  IdJuegoPlataforma: number;
  Codigo: number;
  Disponible: boolean;
}

export interface CodigosCesta {
  idCodigosCestas: number;
  idCesta: number;
  idJuegoCodigo: number;
}

export interface JuegoShort {
  IdJuego: number;
  NombreJuego: string;
  Precio?: number;
  IdPlataforma?: number;
}

export interface Juego {
  IdJuego: number;
  NombreJuego: string;
  GeneroJuego: string;
  JugadoresMaximos: number;
  Descripcion: string;
  Online: boolean;
  FechaLanzamiento: string;
  Imagen: string;
  Precio?: number;
}

export interface JuegosPlataforma {
  idJuegoPlataforma: number;
  IdJuego: number;
  IdPlataforma: number;
  Precio: number;
}

export interface Plataforma {
  IdPlataforma: number;
  NombrePlataforma: string;
}
