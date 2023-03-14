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

  //getUsuarioporNombreUsuarioyContraseniaUsuario: Pasando como parámetros un nombre
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

  //getDatosUsuarioporEmail: Pasando como parámetro un email válido, devuelve un
  //observable de tipo array de usuario con sus datos, o un array vacio
  getDatosUsuarioporEmail(email: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseURL}/Usuarios?Email=${email}`);
  }

  //getDatosUsuarioporNombre: Pasando como parámetro un nombre válido, devuelve un
  //observable de tipo array de usuario con sus datos, o un array vacio
  getDatosUsuarioporNombre(nombre: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(
      `${this.baseURL}/Usuarios?Nombre=${nombre}`
    );
  }

  //setNuevoUsuario: Pasando como parámetro un objeto de tipo Usuario, lo guarda en la BD
  setNuevoUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseURL}/Usuarios`, usuario);
  }

  //getUsuarios: Obtiene todos los usuarios del sistema. Del último al primero, en ese orden
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(
      `${this.baseURL}/Usuarios?_sort=id&_order=desc`
    );
  }
}
