import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertaServiceService {

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
      popup: 'custom-swal', // Clase CSS personalizada
    },
  });

  constructor() { }

  exito(message: string) {
    this.Toast.fire({
      icon: 'success',
      title: message,
      customClass: {
        popup: 'custom-swal', // Añade la clase personalizada aquí
      },
    });
  }

  error(message: string) {
    this.Toast.fire({
      icon: 'error',
      title: message,
      customClass: {
        popup: 'custom-swal', // Añade la clase personalizada aquí
      },
    });
  }

  info(message: string) {
    this.Toast.fire({
      icon: 'info',
      title: message,
      customClass: {
        popup: 'custom-swal', // Añade la clase personalizada aquí
      },
    });
  }

  advertencia(message: string) {
    this.Toast.fire({
      icon: 'warning',
      title: message,
      customClass: {
        popup: 'custom-swal', // Añade la clase personalizada aquí
      },
    });
  }
}
