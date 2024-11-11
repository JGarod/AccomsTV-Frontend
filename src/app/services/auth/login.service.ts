import { Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { UsuarioInterface } from '../../interfeces/canales/canales.interface';
import { UserData } from '../../interfeces/usuario/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiURL = environment.apiURL;

  constructor(private http: HttpClient, private router: Router, private localStorageService: LocalStorageService) { }

  login(nombre: string, password: string): Observable<any> {
    return this.http.post<UsuarioInterface>(`${this.apiURL}/auth/login`, { nombre, password });
  }

  register(nombre: string, password: string, passwordDos: string, correo: string): Observable<any> {
    return this.http.post(`${this.apiURL}/auth/registro`, { nombre, password, passwordDos, correo });
  }


  // Eliminar datos del LocalStorage
  eliminarLocalStorage(): void {
    this.localStorageService.removeItem('userData');
  }

  // Método ajustado para manejar promesas
  async getItems(): Promise<UserData | null> {
    const datos = await this.localStorageService.getItem('userData');
    console.log('Datos obtenidos:', datos);
    return datos;
  }
}
