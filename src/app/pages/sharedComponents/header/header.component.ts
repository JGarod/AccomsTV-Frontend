import { Component, HostListener, Input } from '@angular/core';
import { UserDataExpansiva } from '../../../interfeces/usuario/usuario.interface';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertaServiceService } from '../../../services/alertas/alerta-service.service';
import { LoginService } from '../../../services/auth/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() usuarioActual!: UserDataExpansiva | null;
  public menuOpen: boolean = false;
  public isSearchVisible = false;
  constructor(
    private alertaServiceService: AlertaServiceService,
    private router: Router,
    private loginService: LoginService,
  ) {

  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.me-3')) {
      this.menuOpen = false;
    }
  }

  ngOnInit() {
  }

  async cerrarSesion() {
    try {
      this.alertaServiceService.exito('Cerraste sesión con exito');
      this.router.navigate(['/']);
      this.loginService.eliminarLocalStorage();
    } catch (error) {

    }
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
    const searchContainer = document.querySelector('.search-container') as HTMLElement;
    if (searchContainer) {
      searchContainer.style.display = this.isSearchVisible ? 'flex' : 'none';
    }
  }


  toggleMenu(event: Event) {
    event.stopPropagation(); // Evita que el clic se propague
    this.menuOpen = !this.menuOpen;
    console.log('Menu estado:', this.menuOpen); // Para depuración
  }

  @HostListener('document:click', ['$event'])
  closeMenuOutside(event: Event) {
    if (this.menuOpen && !(event.target as HTMLElement).closest('.user-menu-container')) {
      this.menuOpen = false;
      console.log('Menu cerrado desde fuera:', this.menuOpen); // Para depuración
    }
  }

  irAPerfil() {
    // Navegar a la misma ruta
    if (this.usuarioActual) {
      this.router.navigate(['/dashboard']).then(() => {
        this.router.navigate(['/tv', this.usuarioActual?.nombre]);
      });
    }

  }

  irAjustes() {
    // Navegar a la misma ruta
    if (this.usuarioActual) {
      this.router.navigate(['/config']);
    }

  }
}
