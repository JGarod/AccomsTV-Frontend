import { Component, HostListener, Input } from '@angular/core';
import { UserDataExpansiva } from '../../../interfeces/usuario/usuario.interface';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertaServiceService } from '../../../services/alertas/alerta-service.service';
import { LoginService } from '../../../services/auth/login.service';
import { SharedService } from '../../../services/shared/shared.service';
import { CanalModel } from '../../../models/canales/canales.model';
import { CanalesInterface } from '../../../interfeces/canales/canales.interface';
import { environment } from '../../../../environments/environment';
import { ChatSocketsService } from '../../../services/sockets/chat-sockets.service';

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
  public nombreSeleccionado: string = "";
  public nombreSeleccionadoValidador: string = "";
  public resultados: CanalModel[] = [];
  public seleccionoCanal = false;
  public apiIMG = environment.apiImagenes;

  constructor(
    private alertaServiceService: AlertaServiceService,
    private router: Router,
    private loginService: LoginService,
    private sharedService: SharedService,
    private chatSocketsService: ChatSocketsService
  ) {

  }

  // @HostListener('document:click', ['$event'])
  // clickOutside(event: Event) {
  //   const target = event.target as HTMLElement;

  //   // Si no se hace clic en el área del menú
  //   if (!target.closest('.me-3')) {
  //     this.menuOpen = false;
  //   }

  //   // Si no se hace clic en la lista de resultados, cerramos la lista
 
  // }

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
    if (!this.seleccionoCanal && !(event.target as HTMLElement).closest('.clasePrueba')) {
      console.log('Clic fuera de resultados-lista');
      this.seleccionoCanal = true;
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

  manejarKeyup(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const nombre = inputElement.value;
    this.busquedaCanal(nombre);
  }

  async busquedaCanal(nombre: string) {
    this.seleccionoCanal = false;
    this.nombreSeleccionadoValidador = nombre;
    if (nombre.length > 3) {
      if (this.nombreSeleccionado !== this.nombreSeleccionadoValidador) {
        this.nombreSeleccionado = this.nombreSeleccionadoValidador;
        console.log(nombre);
        const canalesObservable = await this.sharedService.getCanalNombre(this.nombreSeleccionadoValidador); // Espera a que se resuelva la promesa
        canalesObservable.subscribe({
          next: async (response: CanalesInterface) => {
            await Promise.all(response.canales.map((canal) => {
              console.log(canal);
              if (canal && canal.logo) {
                canal.logo = this.apiIMG + canal.logo;
              }
              if (canal && canal.portada) {
                canal.portada = this.apiIMG + canal.portada;
              }
            }));
            this.resultados = response.canales;
          },
          error: (err) => {
            this.resultados = [];
            console.error('Error en la obtención del perfil:', err);
            this.loginService.eliminarLocalStorage();

            // Aquí puedes manejar el error, como mostrar un mensaje al usuario
          }
        });
      }
    } else {
      this.resultados = [];
    }
  }

  seleccionarCanal(resultado: string) {
    this.router.navigate(['/tv', resultado]);
    // Limpia los resultados para cerrar la lista
    this.seleccionoCanal = true;
  }


}
