import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PantallaService {
  private deviceChangeSubject = new Subject<string>();
  public deviceChange$ = this.deviceChangeSubject.asObservable();

  public isMobile: boolean = false; // Propiedad para saber si es móvil
  private currentDevice: string = 'desktop'; // Valor por defecto
  private readonly thresholdWidth = 400; // Umbral para considerar móvil

  constructor(private ngZone: NgZone, @Inject(PLATFORM_ID) private platformId: Object) {
    this.detectDevice();

    // Solo agrega el evento resize si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', () => this.detectDevice());
    }
  }

  private detectDevice() {
    this.ngZone.run(() => {
      // Verifica el ancho de la ventana
      const isMobileNow = isPlatformBrowser(this.platformId) && window.innerWidth <= this.thresholdWidth;

      // Si ha cambiado, actualiza la propiedad y emite el cambio
      if (isMobileNow !== this.isMobile) {
        this.isMobile = isMobileNow;
        this.currentDevice = isMobileNow ? 'mobile' : 'desktop';
        this.deviceChangeSubject.next(this.currentDevice);
      }
    });
  }
}
