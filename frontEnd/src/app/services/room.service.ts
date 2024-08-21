import { inject, Injectable, signal } from '@angular/core';
import {
  Board,
  POSITION_BOARD,
  RoomBackend,
  StateGame,
} from '../interfaces/room';
import { Player } from '../interfaces/player';
import { ServerService } from './server.service';
import { createRoomArgs } from '../interfaces/createRoom';
import { joinARoomArgs } from '../interfaces/joinARoom';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  serverService = inject(ServerService);
  userService = inject(UserService);

  constructor() {
    this.serverService.updateRoom$.subscribe((room) => {
      this.deconstructRoom(room);
    });
  }

  player1 = signal<Player>({
    name: '',
    lives: 0,
  });
  player2 = signal<Player>({
    name: '',
    lives: 0,
  });
  state = signal<StateGame>('WAITING_PARTNER');
  playerNumber = signal<1 | 2 | undefined>(undefined);
  id = signal<number | undefined>(undefined);
  board = signal<Board>(['', '', '', '', '', '', '', '', '']);

  deconstructRoom(roomBack: RoomBackend) {
    console.log('Desestructurando', roomBack);
    this.id.set(roomBack.id);
    this.state.set(roomBack.state);
    this.player1.set(roomBack.player[0]);
    this.player2.set(roomBack.player[1]);
    this.board.set(roomBack.board);
  }
  /**Crea una sala de juegos, publica o privada */
  createRoom(isPrivated: boolean = false) {
    const args: createRoomArgs = {
      publica: !isPrivated,
      playerName: this.userService.name(),
    };
    this.serverService.server.emitWithAck('createRoom', args).then((res) => {
      console.log('Crear sala', res);
      this.deconstructRoom(res.room);
      this.playerNumber.set(1);
    });
  }
  /**Une al cliente a una sala de juegos */
  joinARoom(id: number) {
    const args: joinARoomArgs = {
      id,
      playerName: this.userService.name(),
    };
    this.serverService.server.emitWithAck('joinARoom', args).then((res) => {
      console.log('Resultado de unirse a la sala', res);
      this.deconstructRoom(res.room);
      this.playerNumber.set(2);
    });
  }
  /**Envia al server la peticion de un jugador de hacer ua jugada */
  play(position: POSITION_BOARD) {
    console.log('Transmitiendo Jugada');

    this.serverService.server.emit('play', {
      roomId: this.id(),
      player: this.playerNumber(),
      position,
    });
  }

  /**Envia al server la peticion de seir jugando la siguiente ronda */
  newRound() {
    this.serverService.server.emit('newRound', {roomId:this.id()});
  }
}
