import { inject, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { UserService } from './user.service';
import { RoomBackend } from '../interfaces/room';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  server = io('localhost:3000', { autoConnect: false });
  userService = inject(UserService);

  updateRoom$ = new Subject<RoomBackend>();

  constructor() {
    this.server.on('connect', () => {
      console.log('Conectado al back');
    });
    this.server.on('room', (args) => {
      this.updateRoom$.next(args)
    })
    this.server.connect();
  }
}
