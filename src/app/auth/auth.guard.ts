import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService, UserData } from '../services/local-storage.service';
import { LoginService } from '../services/auth/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    if (typeof window !== 'undefined') {
      // Espera a que se resuelvan los datos del usuario
      const data: UserData | null = await this.loginService.getItems();
      const token = data?.token || null;

      console.log('Datos del guard:', data);

      if (token) {
        return true; // Permite el acceso si el token es válido
      } else {
        // Redirige si no hay token
        this.router.navigate(['/']);
        return false; // Deniega el acceso
      }
    }

    return false; // Deniega el acceso si no está en el navegador
  }
}  
