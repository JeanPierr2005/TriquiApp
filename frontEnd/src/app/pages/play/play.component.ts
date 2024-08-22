import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServerService } from '../../services/server.service';
import { UserService } from '../../services/user.service';
import { BoardComponent } from '../../components/board/board.component';
import { PartyDetailsComponent } from '../../components/party-details/party-details.component';
import { RoomService } from '../../services/room.service';
// import { animate, style, transition, trigger } from '@angular/animations';
import { ModalFullscreenComponent } from '../../components/modal-fullscreen/modal-fullscreen.component'
import { StateGame } from '../../interfaces/room';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [RouterModule, BoardComponent, PartyDetailsComponent, ModalFullscreenComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent implements OnInit {
  serverService = inject(ServerService);
  userService = inject(UserService);
  roomService = inject(RoomService);
  isPrivated = input();
  id = input<string>();
  statesWithModal: StateGame[] = [
    'ABANDONED',
    'DRAW',
    'WAITING_PARTNER',
    'FINAL_VICTRY_P1',
    'FINAL_VICTRY_P2',
    'WINNER_P1',
    'WINNER_P2',
  ];
  showModal = computed(() =>
    this.statesWithModal.includes(this.roomService.state())
  );
  stateAfter = signal<StateGame>('WAITING_PARTNER');
  changeStateAfter = effect(() => {
    if (this.roomService.state()) {
      setTimeout(() => this.stateAfter.set(this.roomService.state()), 1000),
        { allowSignalWrites: true };
    }
  });

  linkCopy = signal<boolean>(false);

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

  copyLink() {
    navigator.clipboard.writeText(
      'localhost:4200/play/' + this.roomService.id()
    );
    this.linkCopy.set(true);
    setTimeout(() => this.linkCopy.set(false), 2000);
  }
}
