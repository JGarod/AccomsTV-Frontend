import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ConfigUserData } from '../../../../../../interfeces/config-user/config-user.interface';
import { AlertaServiceService } from '../../../../../../services/alertas/alerta-service.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../../environments/environment';
import { AuthStreamService } from '../../../../../../services/config/auth-stream.service';
import { UsuarioKey } from '../../../../../../models/canales/config-user/auth-stream.model';

@Component({
  selector: 'app-auth-stream',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-stream.component.html',
  styleUrl: './auth-stream.component.css'
})
export class AuthStreamComponent {
  @Input() usuarioActual!: ConfigUserData | null;
  public password: string = '';
  public apiURLRTMP = environment.apiRTMP;
  public enlace: string = '';
  public showPassword: boolean = false;
  public cargando: boolean = true;
  public copiado: boolean = false;

  constructor(private alertaServiceService: AlertaServiceService,
    private authStreamService: AuthStreamService,
  ) { }


  ngOnInit(): void {
    this.cargando = true;
    console.log(this.usuarioActual);
    this.getDataUser();
    // this.enlace = `${this.apiURLRTMP}/live/${this.usuarioActual?.nombre}`;
  }

  copyToClipboard() {
    const textarea = document.createElement('textarea');
    textarea.value = this.password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    this.copiado = true;
    this.alertaServiceService.exito('La Key fue copiada con éxito.');
    setTimeout(() => {
      this.copiado = false;
    }, 5000);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async getDataUser() {
    const usuarioObservable = await this.authStreamService.getDataStream(); // Espera a que se resuelva la promesa
    usuarioObservable.subscribe({
      next: (response: UsuarioKey) => {
        console.log(response);
        let streamKey = '';
        this.enlace = `${this.apiURLRTMP}`;
        if (![null, '', undefined].includes(response.streamKey)) {
          streamKey = `${response.nombre}?key=${response.streamKey}`;
        }
        this.password = streamKey;
        this.cargando = false;
      },
      error: (err) => {
      }
    });
  }

  async generateKey() {
    const usuarioObservable = await this.authStreamService.getKey(); // Espera a que se resuelva la promesa
    usuarioObservable.subscribe({
      next: (response: UsuarioKey) => {
        console.log(response);
        this.cargando = true;

        let streamKey = '';
        this.enlace = `${this.apiURLRTMP}`;
        if (![null, '', undefined].includes(response.streamKey)) {
          streamKey = `${response.nombre}?key=${response.streamKey}`;
        }
        if (response.msg) {
          this.alertaServiceService.exito(response.msg);
        }
        this.password = streamKey;
        this.cargando = false;

      },
      error: (err) => {
      }
    });
  }
}


