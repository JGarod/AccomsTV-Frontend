import { Component, HostListener } from '@angular/core';
import { LoginService } from '../../../services/auth/login.service';
import { CommonModule } from '@angular/common';
import { CanalesService } from '../../../services/canales/canales.service';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../../models/canales/canales.model';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AlertaServiceService } from '../../../services/alertas/alerta-service.service';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule, SweetAlert2Module, CarouselModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  public placeholderStreams: any = []
  // public usuarioActual!: Usuario;
  public sidebarOpened = false;
  public responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 5,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 5,
      numScroll: 1
    }
  ];
  // Ejemplo de datos para las transmisiones

  constructor(
    private canalesService: CanalesService,
  ) {
    // Constructor donde se puede inicializar el formulario si es necesario
  }

  ngOnInit(): void {
    // PRUEBA
    this.cargado();
  }

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }



  async cargado() {
    try {
      const canalesObservable = await this.canalesService.getCanales(); // Espera a que se resuelva la promesa
      canalesObservable.subscribe({
        next: (response) => {
          this.placeholderStreams = response.canales;
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
