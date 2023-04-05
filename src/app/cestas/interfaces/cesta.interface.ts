export interface Cesta {
  idCesta: number;
  idUsuario: number;
  Email: string;
  Fecha: string;
  PrecioTotal: number;
  CompraFinalizada: boolean;
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
