import { Component, HostListener } from '@angular/core';
import { LoginService } from '../../../services/auth/login.service';
import { CommonModule } from '@angular/common';
import { CanalesService } from '../../../services/canales/canales.service';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../../models/canales/canales.model';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AlertaServiceService } from '../../../services/alertas/alerta-service.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule, SweetAlert2Module],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  public placeholderStreams: any = []
  public usuarioActual!: Usuario;
  public sidebarOpened = false;
  public menuOpen: boolean = false;
  // Ejemplo de datos para las transmisiones

  constructor(
    private canalesService: CanalesService,
    private alertaServiceService: AlertaServiceService,
    private router: Router,
    private loginService: LoginService,
  ) {
    // Constructor donde se puede inicializar el formulario si es necesario
  }

  ngOnInit(): void {
    console.log('Hola desde IndexComponent');
    // PRUEBA
    this.cargado();
  }

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.me-3')) {
      this.menuOpen = false;
    }
  }

  async cerrarSesion() {
    try {
      this.alertaServiceService.exito('Cerraste sesión con exito');
      this.router.navigate(['/']);
      this.loginService.eliminarLocalStorage();
    } catch (error) {

    }
  }

  async cargado() {
    try {
      const canalesObservable = await this.canalesService.getCanales(); // Espera a que se resuelva la promesa
      canalesObservable.subscribe({
        next: (response) => {
          this.placeholderStreams = response.canales;
          this.usuarioActual = response.usuario;
          console.log('-----', response);
        },
        error: (err) => {
          console.error('Error en la obtención del perfil:', err);
          // Aquí puedes manejar el error, como mostrar un mensaje al usuario
        }
      });
    } catch (error) {
      console.error('Error al obtener los canales:', error);
      // Maneja cualquier error al resolver la promesa
    }
  }
}
