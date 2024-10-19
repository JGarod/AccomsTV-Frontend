import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../services/auth/login.service';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService, UserData } from '../../../services/local-storage.service';
import { CanalModel } from '../../../models/canales/canales.model';
import { UsuarioInterface } from '../../../interfeces/canales/canales.interface';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-component.component.html',
  styleUrl: './login-component.component.css'
})
export class LoginComponentComponent {
  public loginForm!: FormGroup; // Define la propiedad del formulario
  public showPassword: boolean = false;
  public mensajeError = '';
  public isLoading: boolean = false;
  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    // Inicializa el formulario reactivo
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Requerido
      password: ['', [Validators.required, Validators.minLength(6)]], // Requerido y longitud mínima
    });
  }

  onSubmit(): void {
    this.mensajeError = '';

    if (this.loginForm.valid) {
      this.isLoading = true; // Mueve esto antes de hacer la llamada
      console.log('Intentando iniciar sesión con:', this.loginForm.value);

      this.loginService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: (response: UsuarioInterface) => {
          console.log('Respuesta del servidor:', response); // Verifica la respuesta
          this.isLoading = false; // Aquí es correcto
          let usuario: UserData = {
            token: response.token,
            idUsuario: response.usuario.id.toString(),
            nombreUsuario: response.usuario.nombre,
          }
          this.localStorageService.setUserData(usuario).then(() =>
            this.router.navigate(['/dashboard'])
          );
        },
        error: (err) => {
          this.isLoading = false; // Asegúrate de que esto se llame
          this.mensajeError = err.error.msg || 'Error desconocido'; // Muestra el mensaje de error
          this.loginService.eliminarLocalStorage();
        }
      });
    } else {
      console.error('Form is invalid', this.loginForm.errors);
    }
  }

}
