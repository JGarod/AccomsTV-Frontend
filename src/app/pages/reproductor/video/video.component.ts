import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import HLS from 'hls.js';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CanalModel } from '../../../models/canales/canales.model';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent {
  @Input() rdatosCanal!: CanalModel;
  private apiURLVideo = environment.apiURLVideo;
  private hls: HLS | null = null;
  private usuario: string | null = 'Home';
  public isCanalOnline: boolean = true;

  @ViewChild('video', { static: true }) private readonly video!: ElementRef<HTMLVideoElement>;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.usuario = params.get('nombre') || '';
      this.checkStreamAvailability();
    });
  }

  public ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
    }
  }

  // Verifica si el stream está disponible
  private checkStreamAvailability(): void {
    const url = `${this.apiURLVideo}/live/${this.usuario}/index.m3u8`;
    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (data) => {
        if (data.includes('#EXTINF')) {
          this.isCanalOnline = true;
          this.load(url);
        } else {
          this.isCanalOnline = false;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.isCanalOnline = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Carga el video si HLS es soportado
  private load(url: string): void {
    if (HLS.isSupported()) {
      if (this.hls) {
        this.hls.destroy();
      }

      this.hls = new HLS({
        liveSyncDurationCount: 3,  // Mantiene la reproducción cerca del "live edge"
        liveMaxLatencyDurationCount: 5 // Máxima latencia permitida en vivo
      });

      this.hls.on(HLS.Events.MANIFEST_PARSED, () => {
        this.forceLivePosition(); // Fuerza el video al tiempo en vivo al cargar el manifiesto
      });

      this.loadVideoWithHLS(url);
    } else {
      console.log('El navegador no soporta HLS.');
    }
  }

  private forceLivePosition(): void {
    if (this.video && this.video.nativeElement) {
      this.video.nativeElement.currentTime = this.video.nativeElement.duration;
    }
  }

  // Carga el video con HLS.js
  private loadVideoWithHLS(url: string): void {
    if (this.video && this.video.nativeElement) {
      this.hls!.loadSource(url);
      this.hls!.attachMedia(this.video.nativeElement);
      this.isCanalOnline = true;
      this.cdr.detectChanges();
    } else {
      console.error('El elemento de video aún no está disponible.');
    }
  }
}
