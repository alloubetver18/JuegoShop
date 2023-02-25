import { NumberSymbol } from '@angular/common';

export interface DBJuegoshopBeta {
  Juegos: Juego[];
  Plataformas: Plataforma[];
  JuegosPlataformas: JuegosPlataforma[];
  Codigos: Codigo[];
  Usuarios: Usuario[];
  Cestas: Cesta[];
  CodigosCestas: CodigosCesta[];
}

export interface Cesta {
  idCesta: number;
  idUsuario: number;
  Email: string;
  Fecha: string;
}

export interface Codigo {
  idJuegoCodigo: number;
  IdJuegoPlataforma: number;
  Codigo: number;
}

export interface CodigosCesta {
  idCodigosCestas: number;
  idCesta: number;
  idJuegoCodigo: number;
}

export interface JuegoShort {
  IdJuego: number;
  NombreJuego: string;
  Precio: number;
  IdPlataforma?: string;
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
  precio?: number;
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

export interface Usuario {
  idUsuario: number;
  Nombre: string;
  Email: string;
  Pass: string;
  ImgPerfil: string;
}
