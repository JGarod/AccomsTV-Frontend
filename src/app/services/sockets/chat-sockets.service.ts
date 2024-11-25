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
  private socket!: Socket;
  private currentRoom: string | null = null;
  private connectionStatus = new Subject<boolean>();
  connectionStatus$ = this.connectionStatus.asObservable();

  constructor() {
    this.socket?.disconnect();

    this.socket = io(this.apiURL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });


    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
    });

    this.socket.on('connect', () => {
      this.connectionStatus.next(true);
    });

    this.socket.on('disconnect', () => {
      this.connectionStatus.next(false);
    });
  }

  getCurrentRoom(): string | null {
    return this.currentRoom;
  }


  joinRoom(roomName: string) {
    // Si ya estás en la misma sala, no hagas nada
    if (this.currentRoom === roomName) {
      console.log('Ya estás en esta sala');
      return;
    }

    console.log('Intentando unirse a sala:', roomName);
    console.log('Sala actual:', this.currentRoom);

    // Emitir evento para unirse a la nueva sala
    this.socket.emit('join-room', roomName);

    // Actualizar sala actual
    this.currentRoom = roomName;
  }


  leaveRoom(room: string): void {
    console.log('Intentando salir de sala:', room);

    // Solo emitir leave-room si estás en esa sala
    if (this.currentRoom === room) {
      this.socket.emit('leave-room', room);
      this.currentRoom = null;
    }
  }


  sendMessage(room: string, message: string, user: string, iduser: string): void {
    this.socket.emit('chat-message', { room, message, user, iduser });
  }
  receiveMessages(): Observable<messageSocketInterface> {
    return new Observable<messageSocketInterface>(observer => {
      this.socket.on('chat-message', (data: messageSocketInterface) => { // Cambia 'msg' a 'data'
        observer.next(data); // Envía el objeto completo
        console.log('data', data);
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
