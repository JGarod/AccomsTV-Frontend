import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserDataComponent } from './components/user-data/user-data.component';
import { PasswordComponent } from './components/password/password.component';
import { AuthStreamComponent } from './components/auth-stream/auth-stream.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [RouterModule, AuthStreamComponent, PasswordComponent, UserDataComponent, CommonModule],
  templateUrl: './ajustes.component.html',
  styleUrl: './ajustes.component.css'
})
export class AjustesComponent {
  public TabSeleccionado: string = '';

  constructor(
    // private canalesService: CanalesService,
  ) {
    // Constructor donde se puede inicializar el formulario si es necesario
  }

  ngOnInit(): void {
    // PRUEBA
    this.cargado('Cuenta');
  }

  async cargado(tabSeleccionado: string) {
    this.TabSeleccionado = tabSeleccionado;
  }
}
