import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { UserDataExpansiva } from '../../interfeces/usuario/usuario.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { LoginService } from '../auth/login.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private apiURL = environment.apiURL;
  private userData = new BehaviorSubject<UserDataExpansiva | null>(null);
  public currentUserData = this.userData.asObservable();
  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService
  ) { }


  // Método para actualizar los datos del usuario (por ejemplo, después de hacer login
  updateUserData(data: UserDataExpansiva) {
    this.userData.next(data);
  }


  async getPerfil(): Promise<Observable<any>> {
    const userData = await this.loginService.getItems(); // Espera a que se resuelvan los datos del usuario
    const token = userData?.token || null;

    if (!token) {
      // this.router.navigate(['/']); // Redirige si no hay token
      return throwError(() => new Error('No autorizado')); // Lanza un error
    }
    console.log(token);
    return this.http.get<UserDataExpansiva>(`${this.apiURL}/auth/perfil`, {
      headers: {
        Authorization: `Bearer ${token}` // Incluye el token en el encabezado
      }
    }).pipe(
      map(response => {
        return response
      }),
      catchError((error) => {
        return throwError(() => error); // Re-lanza el error para manejarlo en el componente si es necesario
      })
    );
  }


}
