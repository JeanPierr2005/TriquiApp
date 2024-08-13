import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {
    const nameLocalStorage = localStorage.getItem("name");
    if(nameLocalStorage) this.name.set(nameLocalStorage)
  }

  name = signal<string>('');

  saveNameLocalStorage = effect(() => localStorage.setItem("name", this.name()))
}
