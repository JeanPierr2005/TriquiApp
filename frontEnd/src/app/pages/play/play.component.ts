import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServerService } from '../../services/server.service';
import { createRoomArgs } from '../../interfaces/createRoom';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent {

  serverService = inject(ServerService)

  constructor() {
    const args:createRoomArgs = {
      publica: true,
      playerName: "Text"
    }
    this.serverService.server.emitWithAck("createRoom", args).then(res => {

    })
  }

}
