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
export class PlayComponent implements OnInit{
  serverService = inject(ServerService);
  userServcie = inject(UserService);
  isPrivated = input();

  constructor() {
    const args: createRoomArgs = {
      publica: true,
      playerName: this.userServcie.name(),
    };
    this.serverService.server.emitWithAck('createRoom', args).then((res) => {
      console.log('Crear sala', res);
    });
  }
  ngOnInit(): void {
    console.log(this.isPrivated());
    
  }
}
