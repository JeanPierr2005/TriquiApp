import { Component, inject, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BoardComponent } from '../../components/board/board.component';
import { PartyDetailsComponent } from '../../components/party-details/party-details.component';
import { RoomService } from '../../services/room.service';
import { ServerService } from '../../services/server.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [RouterModule, BoardComponent, PartyDetailsComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent implements OnInit {
  
  serverService = inject(ServerService);
  userService = inject(UserService);
  roomService = inject(RoomService);
  isPrivated = input();
  id = input<string>();

  ngOnInit(): void {
    if (!this.isPrivated() && !this.id()) {
      this.roomService.createRoom();
    } else if (this.id()) {
      console.log('Intentando unirse a la sala', this.id());
      this.roomService.joinARoom(parseInt(this.id()!));
    } else {
      this.roomService.createRoom(true);
    }
  }

  newRound() {
    this.roomService.newRound();
  }
}
