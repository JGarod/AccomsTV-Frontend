import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CanalModel } from '../../models/canales/canales.model';
import { CanalesInterface, CanalInterface } from '../../interfeces/canales/canales.interface';
import { LoginService } from '../auth/login.service';

@Injectable({
  providedIn: 'root'
})
export class CanalesService {

  private apiURL = environment.apiURL;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService
  ) { }

  // Usa async/await para esperar a los datos de usuario
  async getCanales(): Promise<Observable<any>> {
    const userData = await this.loginService.getItems(); // Espera a que se resuelvan los datos del usuario
    const token = userData?.token || null;

    if (!token) {
      this.router.navigate(['/']); // Redirige si no hay token
      return throwError(() => new Error('No autorizado')); // Lanza un error
    }

    return this.http.get<CanalesInterface>(`${this.apiURL}/channels/canalesOnline`, {
      headers: {
        Authorization: `Bearer ${token}` // Incluye el token en el encabezado
      }
    }).pipe(
      map(response => {
        const canales = response.canales.map(canal =>
          new CanalModel(canal.id, canal.nombre, canal.logo ?? 'assets/user/profile.jpg')
        );
        // Transforma la respuesta a la interfaz Canal
        return {
          canales: canales,
          usuario: response.usuario,
          msg: response.msg
        };
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.loginService.eliminarLocalStorage();
          this.router.navigate(['/']); // Redirigir si hay error de autorización
        }
        return throwError(() => error); // Re-lanza el error para manejarlo en el componente si es necesario
      })
    );
  }

  // No necesitas async/await si no accedes a datos del LocalStorage en este método
  getCanal(nombre: string): Observable<any> {
    return this.http.get<CanalInterface>(`${this.apiURL}/channels/canal/${nombre}`).pipe(
      map(response => {
        // Transformar la respuesta a la interfaz Canal
        return {
          canal: response.canal,
        };
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.loginService.eliminarLocalStorage();
          this.router.navigate(['/']);
        }
        return throwError(() => error);
      })
    );
  }
}
