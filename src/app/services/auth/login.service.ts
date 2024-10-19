import { Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService, UserData } from '../local-storage.service';
import { UsuarioInterface } from '../../interfeces/canales/canales.interface';

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

  // Obtener perfil de usuario
  getPerfil(): Observable<any> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return this.http.get(`${this.apiURL}/auth/perfil`, {
        headers: {
          Authorization: `Bearer ${token}` // Incluye el token en el encabezado
        }
      }).pipe(
        catchError((error) => {
          // Si el error es 401 (no autorizado)
          if (error.status === 401) {
            this.eliminarLocalStorage();
            this.router.navigate(['/']);
          }
          return throwError(() => error);
        })
      );
    } else {
      return throwError(() => 'No se puede acceder');
    }
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
