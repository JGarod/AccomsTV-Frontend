import { Component, Input } from '@angular/core';
import { ConfigUserData } from '../../../../../../interfeces/config-user/config-user.interface';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertaServiceService } from '../../../../../../services/alertas/alerta-service.service';
import { UserDataService } from '../../../../../../services/config/user-data.service';
import { environment } from '../../../../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})
export class UserDataComponent {
  @Input() usuarioActual!: ConfigUserData | null;
  public configForm!: FormGroup;
  public usuarioActualLocal!: ConfigUserData | null;
  public cambioLogo: boolean = false;
  public cambioMuro: boolean = false;
  public cargadoComponente: boolean = false;
  public profileImage!: File | null;
  public wallImage!: File | null;
  public mensajeError: string = '';
  public apiIMG = environment.apiImagenes;
  constructor(private fb: FormBuilder,
    private alertaServiceService: AlertaServiceService,
    private userDataService: UserDataService,

  ) {
  }


  ngOnInit(): void {
    // Inicializa el formulario reactivo
    if (this.usuarioActual) {
      this.usuarioActualLocal = {
        nombre: this.usuarioActual.nombre,
        id: this.usuarioActual.id,
        logo: this.usuarioActual.logo,
        portada: this.usuarioActual.portada,
        correo: this.usuarioActual.correo
      };
      this.configForm = this.fb.group({
        email: [this.usuarioActualLocal?.correo, [Validators.required, Validators.email]],
        profileName: [this.usuarioActualLocal?.nombre, [Validators.required, this.singleWordValidator()]]
      });
      this.cargadoComponente = true;
    } else {
      this.cargadoComponente = false;
    }
  }


  //Guardar la informacion
  async onSubmit() {
    this.mensajeError = ''
    if (this.configForm.valid) {
      if (this.usuarioActual && this.usuarioActual.correo) {
        if (this.configForm.value.email !== this.usuarioActual.correo) {
          const password = await this.alertaServiceService.solicitarContraseña();

          if (password) {
            const observable = await this.userDataService.validatePassword(password); // Espera a obtener el Observable
            observable.subscribe({
              next: () => {
                this.realizarCambiosCuenta();
              },
              error: (err) => {
                if (err?.error?.msg) {
                  this.alertaServiceService.error(err?.error?.msg);
                } else {
                  this.alertaServiceService.error('Ha ocurrido un error');
                }
                // Manejo del error
              },
            });
          }
        } else {
          this.realizarCambiosCuenta();
        }
      } else {
        this.realizarCambiosCuenta();
      }


    }
  }

  //SUBIR IMAGEN VALIDAR
  subirPerfil(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar si el archivo es una imagen con los tipos MIME permitidos
      const tiposValidos = ['image/png', 'image/jpeg', 'image/jpg'];

      if (tiposValidos.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log(this.usuarioActualLocal);
          if (this.usuarioActualLocal) {
            this.cambioLogo = true;
            this.profileImage = file;
            this.usuarioActualLocal.logo = e.target.result;
          }
          console.log(this.usuarioActualLocal);
        };
        reader.readAsDataURL(file); // Carga la imagen como una URL de datos (base64)
      } else {
        // Si no es una imagen válida, muestra un mensaje de error
        this.alertaServiceService.info('Por favor, seleccione una imagen en formato PNG, JPG o JPEG.');
      }
    }
  }

  //SUBIR MURO VALIDAR
  subirMuro(event: any) {
    const file = event.target.files[0];

    if (file) {
      // Validar si el archivo es una imagen con los tipos MIME permitidos
      const tiposValidos = ['image/png', 'image/jpeg', 'image/jpg'];

      if (tiposValidos.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log(this.usuarioActualLocal);
          if (this.usuarioActualLocal) {
            this.cambioMuro = true;
            this.wallImage = file;
            this.usuarioActualLocal.portada = e.target.result;  // Asigna la imagen al campo 'portada'
          }
          console.log(this.usuarioActualLocal);
        };
        reader.readAsDataURL(file); // Carga la imagen como una URL de datos (base64)
      } else {
        // Si no es una imagen válida, muestra un mensaje de error
        this.alertaServiceService.info('Por favor, seleccione una imagen en formato PNG, JPG o JPEG.');
      }
    }
  }


  singleWordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9_]+$/.test(control.value);
      return valid ? null : { 'singleWord': { value: control.value } };
    };
  }

  removeImg(tipo: string) {
    if (this.usuarioActualLocal && this.usuarioActual) {
      console.log('usuarioActualLocal', this.usuarioActualLocal);
      console.log('usuarioActual', this.usuarioActual);
      if (tipo === 'logo') {
        console.log(this.usuarioActual);
        this.usuarioActualLocal.logo = this.usuarioActual.logo;
        this.cambioLogo = false;
        this.profileImage = null;
      } else if (tipo === 'muro') {
        this.usuarioActualLocal.portada = this.usuarioActual.portada;
        this.cambioMuro = false;
        this.wallImage = null;

      }
    }

  }

  realizarCambiosCuenta() {
    let username = this.configForm.value.profileName;
    let email = this.configForm.value.email;
    let perfil = null;
    let wall = null;
    if (this.cambioLogo && this.profileImage) {
      perfil = this.profileImage
    }
    if (this.cambioMuro && this.wallImage) {
      wall = this.wallImage
    }
    this.userDataService.putDataUser(username, perfil, wall, email).then(response => {
      this.alertaServiceService.exito('Datos actualizados correctamente');
      setTimeout(() => {
        location.reload();
      }, 500);
    }).catch(err => {
      if (err?.error?.msg) {
        this.mensajeError = err.error.msg;
      } else {
        this.mensajeError = 'Ha ocurrido un error';
      }
    });
  }
}
