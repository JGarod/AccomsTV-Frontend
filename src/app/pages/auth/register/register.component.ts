import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { LoginService } from '../../../services/auth/login.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public registerForm!: FormGroup; // Define la propiedad del formulario
  public showcontrasena: boolean = false;
  public showcontrasenaDos: boolean = false;
  public passwordDiferentes: boolean = false;
  public mensajeError = '';
  public isLoading: boolean = false;
  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
  }
  ngOnInit(): void {
    // Inicializa el formulario reactivo
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, this.singleWordValidator]], // Requerido
      contrasena: ['', [Validators.required, Validators.minLength(6)]], // Requerido y longitud mínima
      contrasenaDos: ['', [Validators.required, Validators.minLength(6)]], // Requerido y longitud mínima
      correo: ['', [Validators.required, Validators.email]], // Requerido y longitud mínima
    });
  }

  onSubmit(): void {
    try {
      this.mensajeError = ''
      if (this.registerForm.valid) {
        this.isLoading = true;
        this.loginService.register(this.registerForm.value.nombre,
          this.registerForm.value.contrasena, this.registerForm.value.contrasenaDos, this.registerForm.value.correo).subscribe(
            response => {
              // Manejo de la respuesta exitosa
              this.router.navigate(['/']);
              this.isLoading = false;

            },
            err => {
              this.isLoading = false;
              this.mensajeError = err.error.msg;
              // Aquí puedes manejar el error, como mostrar un mensaje al usuario
            }
          );
        // Aquí puedes manejar la lógica para iniciar sesión
      } else {
        console.error('Form is invalid');
      }
    } catch (error) {

    }
  }

  confirmarClaves() {
    try {
      if (this.registerForm.value.contrasenaDos === this.registerForm.value.contrasena) {
        this.passwordDiferentes = false;
      } else {
        this.passwordDiferentes = true;
      }
    } catch (error) {

    }
  }

  singleWordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9_]+$/.test(control.value);
      return valid ? null : { 'singleWord': { value: control.value } };
    };
  }
}
