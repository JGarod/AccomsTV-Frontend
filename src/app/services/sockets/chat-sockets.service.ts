import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { messageSocketInterface } from '../../interfeces/canales/canales.interface';


interface JoinRoomResponse {
  success: boolean;
  error?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ChatSocketsService {
  private apiURL = environment.apiURLSockets;
  private socket: Socket;

  constructor() {
    this.socket = io(this.apiURL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servidor de sockets');
    });
  }

  joinRoom(room: string): void {
    this.socket.emit('join-room', room);
  }

  leaveRoom(room: string): void {
    this.socket.emit('leave-room', room);
  }

  sendMessage(room: string, message: string, user: string, iduser: string): void {
    this.socket.emit('chat-message', { room, message, user, iduser });
  }
  receiveMessages(): Observable<messageSocketInterface> {
    return new Observable<messageSocketInterface>(observer => {
      this.socket.on('chat-message', (data: messageSocketInterface) => { // Cambia 'msg' a 'data'
        observer.next(data); // Envía el objeto completo
      });

      // Asegúrate de manejar la desuscripción para evitar fugas de memoria
      return () => {
        this.socket.off('chat-message'); // Elimina el manejador al desuscribirse
      };
    });
  }
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
