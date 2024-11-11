import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import localforage from 'localforage';
import { isPlatformBrowser } from '@angular/common';
import { UserData } from '../interfeces/usuario/usuario.interface';



@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId); // Verifica si está en el navegador

    if (this.isBrowser) {
      localforage.config({
        driver: localforage.LOCALSTORAGE, // Puedes elegir entre localStorage, IndexedDB, WebSQL
        name: 'myApp',
      });
    }
  }

  // Asegúrate de que solo intente acceder a localforage si es un navegador
  setUserData(data: UserData): Promise<UserData> {
    if (this.isBrowser) {
      return localforage.setItem<UserData>('userData', data);
    } else {
      return Promise.reject('No disponible en el servidor');
    }
  }

  getItem(key: string): Promise<UserData | null> {
    if (this.isBrowser) {
      return localforage.getItem<UserData>(key);
    } else {
      return Promise.resolve(null);
    }
  }

  removeItem(key: string): Promise<void> {
    if (this.isBrowser) {
      return localforage.removeItem(key);
    } else {
      return Promise.reject('No disponible en el servidor');
    }
  }
}
