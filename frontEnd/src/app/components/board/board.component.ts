import { Component, computed, inject } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { POSITION_BOARD } from '../../interfaces/room';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  roomService = inject(RoomService);
  isMyShift = computed(
    () =>
      (this.roomService.state() === 'SHIFT_P1' &&
        this.roomService.playerNumber() === 1) ||
      (this.roomService.state() === 'SHIFT_P2' &&
        this.roomService.playerNumber() === 2)
  );

  play(position:POSITION_BOARD) {
    this.roomService.play(position)
    //Enviar al back las solicitud del juego
  }
}
