import { createRoomArgs } from "../interfaces/createRoom";
import { Player, PLAYER_VOID } from "../interfaces/player";

export class Room {
  publica: boolean;
  player: [Player, Player] = [{...PLAYER_VOID}, {...PLAYER_VOID}];
  id: number;

  constructor(args: createRoomArgs) {
    this.publica = args.publica;
  }

  addPlayer(name: string) {
    const indexPlayer = !this.player[0].name ? 0 : 1;
    this.player[indexPlayer].name = name;
    this.player[indexPlayer].lives = 3;
  }

  getRoom() {
    return {
      publica: this.publica,
      player: this.player,
      id: this.id,
    };
  }
}
