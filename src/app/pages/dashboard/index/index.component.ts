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
import { CanalesInterface } from '../../../interfeces/canales/canales.interface';
import { environment } from '../../../../environments/environment';
import { CarruselComponent } from '../carrusel/carrusel.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule, SweetAlert2Module, CarruselComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

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
    private loginService: LoginService,
  ) {
    // Constructor donde se puede inicializar el formulario si es necesario
  }

  ngOnInit(): void {
    // PRUEBA

  }

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }




}
