import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';
import { UserDataExpansiva } from '../../../interfeces/usuario/usuario.interface';
import { SharedService } from '../../../services/shared/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet, CommonModule],
  templateUrl: './shared.component.html',
  styleUrl: './shared.component.css'
})
export class SharedComponent {

  public dataUsuario!: UserDataExpansiva | null; // Declaramos la variable con el tipo `UserData`
  public cargadoData: boolean = false;
  constructor(private sharedService: SharedService) { }

  ngOnInit() {

    this.cargadoUsuarioActual();
    // Nos suscribimos a los cambios de los datos del usuario
    // this.sharedService.currentUserData.subscribe((data: UserDataExpansiva | null) => {
    //   this.user = data;
    //   if (this.user) {
    //     console.log('Datos del usuario:', this.user);
    //   }
    // });
  }


  async cargadoUsuarioActual() {
    try {
      this.cargadoData = false;
      const usuarioObservable = await this.sharedService.getPerfil(); // Espera a que se resuelva la promesa
      usuarioObservable.subscribe({
        next: (response: UserDataExpansiva) => {
          this.dataUsuario = response;
          this.cargadoData = true;
        },
        error: (err) => {
          this.dataUsuario = null;
          this.cargadoData = true;
          console.error('Error en la obtención del perfil:', err);
          // Aquí puedes manejar el error, como mostrar un mensaje al usuario
        }
      });
    } catch (error) {
      this.dataUsuario = null;
      console.error('Error al obtener los canales:', error);
      // Maneja cualquier error al resolver la promesa
    }
  }

  // let dataUsuarioCompartida: UserDataExpansiva = {
  //   nombre: response.usuario.nombre,
  //   logo: response.usuario.logo,
  //   id: response.usuario.id,
  // }
  // this.sharedService.updateUserData(dataUsuarioCompartida);

}
