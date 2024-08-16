import { createRoomArgs } from "../interfaces/createRoom";
import { Player, PLAYER_VOID } from "../interfaces/player";

export class Room {
  publica: boolean;
  player: [Player, Player] = [PLAYER_VOID, PLAYER_VOID];
  id: number;

  constructor(args:createRoomArgs){
    this.publica = args.publica,
    this.player[0].name = args.playerName;
  }
}
