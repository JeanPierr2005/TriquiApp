import { Component, inject, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServerService } from '../../services/server.service';
import { createRoomArgs } from '../../interfaces/createRoom';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent implements OnInit {
  serverService = inject(ServerService);
  userServcie = inject(UserService);
  isPrivated = input();
  id = input<string>();

  ngOnInit(): void {
    if (!this.isPrivated() && !this.id()) {
      this.serverService.createRoom();
    } else if (this.id()) {
      console.log("Intentando unirse a la sala", this.id());
      this.serverService.joinARoom(parseInt(this.id()!));
    } else {
      this.serverService.createRoom(true);
    }
  }
}
