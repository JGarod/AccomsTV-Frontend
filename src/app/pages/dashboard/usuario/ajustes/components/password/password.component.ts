import { Component, Input } from '@angular/core';
import { ConfigUserData } from '../../../../../../interfeces/config-user/config-user.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../../../../services/config/user-data.service';
import { AlertaServiceService } from '../../../../../../services/alertas/alerta-service.service';
import { RouterModule } from '@angular/router';
import { PasswordUserService } from '../../../../../../services/config/password-user.service';
import { changePassword } from '../../../../../../models/canales/config-user/auth-stream.model';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {
  @Input() usuarioActual!: ConfigUserData | null;
  public configForm!: FormGroup;
  public showcontrasenaActual: boolean = false;
  public showcontrasena: boolean = false;
  public showcontrasenaDos: boolean = false;
  public passwordDiferentes: boolean = false;
  public mensajeError = '';
  public isLoading: boolean = false;
  constructor(private fb: FormBuilder,
    private alertaService: AlertaServiceService,
    private passwordUserService: PasswordUserService,

  ) {
  }


  ngOnInit(): void {
    // Inicializa el formulario reactivo
    this.configForm = this.fb.group({
      contrasenaActual: ['', [Validators.required, Validators.minLength(6)]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      contrasenaDos: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  confirmarClaves() {
    try {
      if (this.configForm.value.contrasenaDos === this.configForm.value.contrasena) {
        this.passwordDiferentes = false;
      } else {
        this.passwordDiferentes = true;
        this.mensajeError = '';
      }
    } catch (error) {

    }
  }


  async onSubmit() {
    try {
      this.mensajeError = ''
      if (this.configForm.valid) {
        this.isLoading = true;
        let cambioClaves: changePassword = {
          passwordActual: this.configForm.value.contrasenaActual,
          password: this.configForm.value.contrasena,
          passwordDos: this.configForm.value.contrasenaDos,
        }
        const observable = await this.passwordUserService.changePassword(cambioClaves);
        observable.subscribe({
          next: (res) => {
            let data: any = res;
            this.configForm.reset();
            this.isLoading = false;
            this.alertaService.exito(data.msg);
          },
          error: (err) => {
            this.isLoading = false;
            this.mensajeError = err.error.msg;
            this.passwordDiferentes = false;
          }
        });
        // Aquí puedes manejar la lógica para iniciar sesión
      } else {
        console.error('Form is invalid');
      }
    } catch (error) {

    }
  }
}
