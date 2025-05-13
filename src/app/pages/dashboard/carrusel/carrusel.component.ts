import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CanalesService } from '../../../services/canales/canales.service';
import { LoginService } from '../../../services/auth/login.service';
import { CanalesInterface } from '../../../interfeces/canales/canales.interface';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Hls from 'hls.js';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css'
})
export class CarruselComponent {
  @ViewChildren('videoPlayer', { read: ElementRef })
  videoPlayers!: QueryList<ElementRef<HTMLVideoElement>>;
  private apiURLVideo = environment.apiURLVideo;
  public apiIMG = environment.apiImagenes;
  public placeholderStreams: any = []
  currentIndex: number = 0;

 constructor(
    private canalesService: CanalesService,
    private loginService: LoginService,
   private http: HttpClient ,
   private cd: ChangeDetectorRef
  ) {
    // Constructor donde se puede inicializar el formulario si es necesario
  }
  ngOnInit(): void {
    // PRUEBA
    this.cargado();
  }
  updateVideoPlayback(): void {
    setTimeout(() => {
      const videos = this.videoPlayers.toArray();

      videos.forEach((videoRef, index) => {
        const video = videoRef.nativeElement;
        const itemIndex = parseInt(video.getAttribute('data-index') ?? '-1', 10);

        const canal = this.getVisibleItems()[itemIndex];
        const videoUrl = canal?.video;

        // Evitar problemas si no hay URL
        if (!videoUrl) return;

        if (itemIndex === 1) {
          // Solo reproducir el video principal (centro)
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              video.play().catch(err => console.warn('No se pudo reproducir el video HLS:', err));
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoUrl;
            video.play().catch(err => console.warn('No se pudo reproducir el video:', err));
          }
        } else {
          // Detener o pausar videos laterales
          video.pause();
          video.removeAttribute('src'); // Desvincula para liberar memoria
          video.load();
        }
      });
    });
  }
  
  
  onVideoLoaded(videoElement: HTMLVideoElement, index: number): void {
    if (index !== 1) {
      videoElement.pause();
    }
  }
  

  next(): void {
    if (this.placeholderStreams.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.placeholderStreams.length;
      this.updateVideoPlayback();
    }
  }

  prev(): void {
    if (this.placeholderStreams.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.placeholderStreams.length) % this.placeholderStreams.length;
      this.updateVideoPlayback();
    }
  }

  getVisibleItems(): any[] {
    const total = this.placeholderStreams.length;
    if (total === 0) return [];

    const main = this.currentIndex;
    const left = (main - 1 + total) % total;
    const right = (main + 1) % total;

    return [this.placeholderStreams[left], this.placeholderStreams[main], this.placeholderStreams[right]];
  }

  async cargado() {
    try {
      const canalesObservable = await this.canalesService.getCanales(); // Espera a que se resuelva la promesa
      canalesObservable.subscribe({
        next: async (response: CanalesInterface) => {
          await Promise.all(response.canales.map(async (canal, index) => {
            if (canal && canal.logo) {
              canal.logo = this.apiIMG + canal.logo;
            }
            if (canal && canal.portada) {
              canal.portada = this.apiIMG + canal.portada;
            }

            // Generamos la URL del video para cada canal
            const videoUrl = `${this.apiURLVideo}/live/${canal.nombre}/index.m3u8`;

            // Verificamos si el video está disponible antes de asignarlo
            const isAvailable = await lastValueFrom(this.checkVideoAvailability(videoUrl));

            // Solo asignamos el enlace si es válido
            if (isAvailable) {
              canal.video = videoUrl;
            } else {
              canal.video = null;
            }
            console.log('canal.videocanal.video', canal.video);
          }));

          this.placeholderStreams = response.canales;
           setTimeout(() => {
            // Asegura que se ha renderizado el DOM
            this.cd.detectChanges();  // cd = ChangeDetectorRef inyectado en constructor
            this.updateVideoPlayback();
          });
        },
        error: (err) => {
          this.loginService.eliminarLocalStorage();
          console.error('Error en la obtención del perfil:', err);
        }
      });
    } catch (error) {
      console.error('Error al obtener los canales:', error);
    }
  }

  checkVideoAvailability(url: string): Observable<boolean> {
    return this.http.head(url, { observe: 'response' }).pipe(
      map(response => response.status === 200),  // Si el código de respuesta es 200, el video está disponible
      catchError(() => of(false))  // Si ocurre un error (como 404), devolver 'false'
    );
  }
}
