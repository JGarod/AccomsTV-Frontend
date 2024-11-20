import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, map, Observable, throwError } from 'rxjs';
import { LoginService } from '../auth/login.service';
import { environment } from '../../../environments/environment';
import { ConfigUserData } from '../../interfeces/config-user/config-user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private apiURL = environment.apiURL;
  // private userData = new BehaviorSubject<ConfigUserData | null>(null);
  // public currentUserData = this.userData.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService
  ) { }

  async getPerfil(): Promise<Observable<any>> {
    const userData = await this.loginService.getItems(); // Espera a que se resuelvan los datos del usuario
    const token = userData?.token || null;

    if (!token) {
      this.router.navigate(['/']); // Redirige si no hay token
      return throwError(() => new Error('No autorizado')); // Lanza un error
    }
    return this.http.get<ConfigUserData>(`${this.apiURL}/config/get_perfil`, {
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


  putDataUser(username: string, perfil: File | null, wall: File | null, email: string): Promise<any> {
    return this.loginService.getItems().then(userData => {
      const token = userData?.token || null;

      if (!token) {
        this.router.navigate(['/']);
        throw new Error('No autorizado');
      }

      const formData = new FormData();

      if (perfil) {
        formData.append('profile', perfil);
      }
      if (wall) {
        formData.append('wall', wall);
      }

      formData.append('username', username);
      formData.append('email', email);

      // Usamos firstValueFrom() para convertir el Observable en una Promise
      return firstValueFrom(
        this.http.post(`${this.apiURL}/config/upload/usuario`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    });
  }

  //validar clave del usuario
  async validatePassword(password: string): Promise<Observable<any>> {
    const userData = await this.loginService.getItems(); // Espera a que se resuelvan los datos del usuario
    const token = userData?.token || null;

    if (!token) {
      this.router.navigate(['/']); // Redirige si no hay token
      return throwError(() => new Error('No estas autorizado para realizar esta operación')); // Lanza un error
    }

    return this.http.post<any>(
      `${this.apiURL}/config/comparate_password/usuario`,
      { password },
      {
        headers: {
          Authorization: `Bearer ${token}` // Incluye el token en el encabezado
        }
      }
    ).pipe(
      map(response => {
        return response;
      }),
      catchError((error) => {
        return throwError(() => error); // Re-lanza el error para manejarlo en el componente si es necesario
      })
    );
  }




}
