import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LoginService } from '../auth/login.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { changePassword } from '../../models/canales/config-user/auth-stream.model';

@Injectable({
  providedIn: 'root'
})
export class PasswordUserService {
  private apiURL = environment.apiURL;

  constructor(private http: HttpClient,
    private router: Router,
    private loginService: LoginService
  ) { }


  async changePassword(formData: changePassword): Promise<Observable<any>> {
    const userData = await this.loginService.getItems(); // Espera los datos del usuario
    const token = userData?.token || null;

    if (!token) {
      this.router.navigate(['/']); // Redirige si no hay token
      return throwError(() => new Error('No estás autorizado para realizar esta operación'));
    }

    // Enviar los datos correctamente en el cuerpo de la solicitud
    return this.http.post<any>(
      `${this.apiURL}/config/change_password/usuario`,
      formData,  // Enviar directamente formData (sin envolverlo en un objeto adicional)
      {
        headers: {
          Authorization: `Bearer ${token}` // Incluye el token en el encabezado
        }
      }
    ).pipe(
      map(response => response), // Mapeo del response (puedes personalizarlo si es necesario)
      catchError(error => {
        return throwError(() => error); // Re-lanza el error para manejarlo en el componente si es necesario
      })
    );
  }

}
