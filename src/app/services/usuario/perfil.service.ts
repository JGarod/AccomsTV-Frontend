import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../auth/login.service';
@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiURL = environment.apiURL;

  constructor(private http: HttpClient,
    private router: Router,
    private loginService: LoginService,
  ) { }

  getUser(nombre: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiURL}/channels/canalesOnline`, {
      headers: {
        Authorization: `Bearer ${token}` // Incluye el token en el encabezado
      }
    }).pipe(
      catchError((error) => {
        // Si el error es 401 (no autorizado) o cualquier otro que signifique token inválido
        if (error.status === 401) {
          // Redirigir al login y eliminar el token
          this.loginService.eliminarLocalStorage();
          this.router.navigate(['/']); // Asegúrate de que esta sea la ruta de inicio de sesión
        }
        return throwError(() => error); // Re-lanza el error para manejarlo en el componente si es necesario
      })
    );
  }
}
