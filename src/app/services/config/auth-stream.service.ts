import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../auth/login.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserKeyData } from '../../interfeces/config-user/config-user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthStreamService {
  private apiURL = environment.apiURL;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService
  ) { }

  async getDataStream(): Promise<Observable<any>> {
    const userData = await this.loginService.getItems(); // Espera a que se resuelvan los datos del usuario
    const token = userData?.token || null;

    if (!token) {
      this.router.navigate(['/']); // Redirige si no hay token
      return throwError(() => new Error('No autorizado')); // Lanza un error
    }
    return this.http.get<UserKeyData>(`${this.apiURL}/stream_config/get_keys`, {
      headers: {
        Authorization: `Bearer ${token}` // Incluye el token en el encabezado
      }
    }).pipe(
      map(response => {
        return response.usuario;
      }),
      catchError((error) => {
        this.router.navigate(['/']);
        return throwError(() => error); // Re-lanza el error para manejarlo en el componente si es necesario
      })
    );
  }

  async getKey(): Promise<Observable<any>> {
    const userData = await this.loginService.getItems(); // Espera a que se resuelvan los datos del usuario
    const token = userData?.token || null;

    if (!token) {
      this.router.navigate(['/']); // Redirige si no hay token
      return throwError(() => new Error('No autorizado')); // Lanza un error
    }
    return this.http.get<any>(`${this.apiURL}/stream_config/generate_Key`, {
      headers: {
        Authorization: `Bearer ${token}` // Incluye el token en el encabezado
      }
    }).pipe(
      map(response => {
        return response
      }),
      catchError((error) => {
        this.router.navigate(['/']);
        return throwError(() => error); // Re-lanza el error para manejarlo en el componente si es necesario
      })
    );
  }
}
