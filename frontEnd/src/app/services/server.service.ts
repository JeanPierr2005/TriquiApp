import { inject, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { UserService } from './user.service';
import { createRoomArgs } from '../interfaces/createRoom';
import { joinARoomArgs } from '../interfaces/joinARoom';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  server = io('localhost:3000', { autoConnect: false });
  userServices = inject(UserService);

  constructor() {
    this.server.on('connect', () => {
      console.log('Conectado al back');
    });
    this.server.on('room', (args) => console.log(args));
    this.server.connect();
  }

  createRoom(isPrivated: boolean = false) {
    const args: createRoomArgs = {
      publica: !isPrivated,
      playerName: this.userServices.name(),
    };
    this.server.emitWithAck('createRoom', args).then((res) => {
      console.log('Crear sala', res);
    });
  }

  joinARoom(id: number) {
    const args: joinARoomArgs = {
      id,
      playerName: this.userServices.name(),
    };
    this.server.emitWithAck('joinARoom', args).then((res) => {
      console.log('Resultado de unirse a la sala', res);
    });
  }
}
