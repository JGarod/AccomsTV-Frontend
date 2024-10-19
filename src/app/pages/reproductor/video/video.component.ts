import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import HLS from 'hls.js';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent {
  private apiURLVideo = environment.apiURLVideo;
  private hls = new HLS();
  private usuario: string | null = 'Home';
  private playing: boolean = false;
  @ViewChild('video', { static: true }) private readonly video!: ElementRef<HTMLVideoElement>;

  constructor(private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.usuario = params.get('nombre') || '';
      this.load(`${this.apiURLVideo}/live/${this.usuario}/index.m3u8`);
    });
  }

  public ngOnDestroy() {
    if (this.hls) {
      this.hls.destroy(); // Destruye la instancia de HLS al destruir el componente
    }
  }


  public loadInit(): void {

  }

  public load(currentVideo: string): void {
    if (HLS.isSupported()) {
      this.loadVideoWithHLS(currentVideo);
    } else {
      console.log('Ups! no es soportado por tu navegador');
    }
  }

  private loadVideoWithHLS(currentVideo: string) {
    this.hls.loadSource(currentVideo);
    this.hls.attachMedia(this.video.nativeElement);

  }

}
