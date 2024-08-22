import { Component, computed, inject } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-party-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './party-details.component.html',
  styleUrl: './party-details.component.scss',
})
export class PartyDetailsComponent {
  roomService = inject(RoomService);

  livesP1 = computed(() => new Array(this.roomService.player1().lives));
  livesP2 = computed(() => new Array(this.roomService.player2().lives));
}
