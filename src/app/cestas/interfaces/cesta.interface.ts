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
