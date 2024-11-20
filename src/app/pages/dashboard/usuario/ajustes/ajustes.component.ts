import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserDataComponent } from './components/user-data/user-data.component';
import { PasswordComponent } from './components/password/password.component';
import { AuthStreamComponent } from './components/auth-stream/auth-stream.component';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../../services/config/user-data.service';
import { ConfigUserData } from '../../../../interfeces/config-user/config-user.interface';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [RouterModule, AuthStreamComponent, PasswordComponent, UserDataComponent, CommonModule],
  templateUrl: './ajustes.component.html',
  styleUrl: './ajustes.component.css'
})
export class AjustesComponent {
  public TabSeleccionado: string = '';
  public DataUsuario!: ConfigUserData;
  public apiIMG = environment.apiImagenes;
  constructor(
    // private canalesService: CanalesService,
    private userDataService: UserDataService,
  ) {
    // Constructor donde se puede inicializar el formulario si es necesario
  }

  ngOnInit(): void {
    // PRUEBA
    this.getDataUser();
  }

  async cargado(tabSeleccionado: string) {
    this.TabSeleccionado = tabSeleccionado;
  }

  async getDataUser() {
    const usuarioObservable = await this.userDataService.getPerfil(); // Espera a que se resuelva la promesa
    usuarioObservable.subscribe({
      next: (response: ConfigUserData) => {
        console.log(response);
        if (response && response.logo) {
          response.logo = this.apiIMG + response.logo;
        }
        if (response && response.portada) {
          response.portada = this.apiIMG + response.portada;
        }
        this.DataUsuario = response;
        if (this.DataUsuario) {
          this.cargado('Cuenta');
        }
      },
      error: (err) => {
      }
    });
  }
}
