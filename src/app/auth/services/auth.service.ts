import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../interfaces/usuarios.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) {}

  //TODO getUsuarioporNombreUsuarioyContraseniaUsuario: Pasando como parámetros un nombre
  //de usuario válido y una contrasenia, devuelve un observable de tipo array de usuario
  //con sus datos.
  getUsuarioporNombreUsuarioyContraseniaUsuario(
    nombreUsuario: string,
    password: string
  ): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(
      `${this.baseURL}/Usuarios?Nombre=${nombreUsuario}&Pass=${password}`
    );
  }
}
