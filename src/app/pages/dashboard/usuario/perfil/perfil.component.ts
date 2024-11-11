import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CanalesService } from '../../../../services/canales/canales.service';
import { ActivatedRoute } from '@angular/router';
import { CanalModel } from '../../../../models/canales/canales.model';
import { VideoComponent } from '../../../reproductor/video/video.component';
import { PantallaService } from '../../../../services/detector-dispositivo/pantalla.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ChatSocketsService } from '../../../../services/sockets/chat-sockets.service';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../../services/auth/login.service';
import { messageSocketInterface } from '../../../../interfeces/canales/canales.interface';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, VideoComponent, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerfilComponent {
  public nombre: string = '';
  public cargando: boolean = false;
  public datosCanal!: CanalModel;
  public chatVisible: boolean = true;
  public isLoginUser: boolean = false;
  public isMobile: boolean = false; // Controla si es móvil
  public minimoMovil = 360;
  public isFocusedChat: boolean = false;
  public messages: messageSocketInterface[] = [];
  public message: string = '';
  public messageSubscription: Subscription | null = null;
  private unsubscribe$ = new Subject<void>();
  public emojiPickerVisible = false;
  public emojis: string[] = [
    '😊', '😂', '❤️', '👍', '🎉', '😎', '🥳', '🤔', '😢', '😡',
    // Añade más emojis aquí hasta completar 200
    '🎈', '🐶', '🐱', '🌈', '🌟', '✨', '🌹', '🍕', '🍔', '🍣',
    // Continúa con tus 200 emojis...
  ];
  constructor(
    private canalesService: CanalesService,
    private route: ActivatedRoute,
    private deviceService: PantallaService,
    private chatSocketsService: ChatSocketsService,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
  ) {
    // Constructor donde se puede inicializar el formulario si es necesario
  }

  ngOnInit(): void {
    this.isLogin();
    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.nombre = params.get('nombre') || '';
      this.cargarCanal();
      this.isMobile = this.deviceService.isMobile;
      this.cambiarChatMobile();
      this.cargadoSockets();
    });

    this.deviceService.deviceChange$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.isMobile = this.deviceService.isMobile;
        this.cambiarChatMobile();
        this.cdr.markForCheck();
      });
    window.addEventListener('beforeunload', this.onUnload.bind(this));
  }


  async cargarCanal() {
    try {
      this.canalesService.getCanal(this.nombre).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (response) => {
          this.datosCanal = response.canal;
          this.cargando = true;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error en la obtención del perfil:', err);
          this.cdr.markForCheck();
        }
      });
    } catch (error) {
      console.error('Error en cargar canal:', error);
    }
  }



  toggleChat() {
    this.chatVisible = !this.chatVisible; // Alternar visibilidad
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= this.minimoMovil;
    this.cambiarChatMobile();
  }

  updateLayout() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Define el límite para considerar que es mobile
    this.isMobile = (width <= this.minimoMovil) || (width > this.minimoMovil && height < width);
    this.cambiarChatMobile();

  }


  onFocus() {
    this.isFocusedChat = true;
  }

  onBlur() {
    // Solo aplica si no se hace clic dentro del div
    setTimeout(() => {
      this.isFocusedChat = false;
    }, 100);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.chat-panel')) {
      this.isFocusedChat = false;
    }
    // Verifica si el clic fue fuera del input y del menú de emojis
    if (!target.closest('.emoji-picker') && !target.closest('.input-container')) {
      this.emojiPickerVisible = false; // Cierra el menú de emojis
    }

  }

  async sendMessage() {
    let data = await this.loginService.getItems();
    if (this.isLoginUser && this.message.trim() && data?.nombreUsuario && data?.idUsuario) {
      this.chatSocketsService.sendMessage(this.nombre, this.message, data.nombreUsuario, data.idUsuario);
      this.message = '';
      this.cdr.markForCheck();
    } else {

    }
  }


  cargadoSockets() {
    this.chatSocketsService.joinRoom(this.nombre);
    this.chatSocketsService.receiveMessages().pipe(takeUntil(this.unsubscribe$)).subscribe((message: messageSocketInterface) => {
      this.messages.push(message);
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.chatSocketsService.leaveRoom(this.nombre);
  }

  async isLogin() {
    let data = await this.loginService.getItems(); // Espera a que se resuelva la promesa
    if (data && ![null, undefined, ''].includes(data?.idUsuario) && ![null, undefined, ''].includes(data?.nombreUsuario) && ![null, undefined, ''].includes(data?.token)) {
      this.isLoginUser = true;
    }
  }

  toggleEmojiPicker() {
    this.emojiPickerVisible = !this.emojiPickerVisible;
  }

  addEmoji(emoji: string) {
    this.message += emoji; // Añadir emoji al mensaje
  }

  //basicamente cuando el telefono sea mobile le cambia el atributo a chat para que se vaya de la parte movil
  cambiarChatMobile() {
    this.chatVisible = !this.isMobile;
  }

  private onUnload(): void {
    this.chatSocketsService.leaveRoom(this.nombre);
  }
}
