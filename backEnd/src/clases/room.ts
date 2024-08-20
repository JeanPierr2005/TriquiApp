import { Socket } from "socket.io";
import { createRoomArgs } from "../interfaces/createRoom";
import { Player, PLAYER_VOID } from "../interfaces/player";
import {
    Board,
    POSITION_BOARD,
    RoomBackend,
    StateGame,
} from "../interfaces/room";

export class Room {
    publica: boolean;
    player: [Player, Player] = [{ ...PLAYER_VOID }, { ...PLAYER_VOID }];
    id: number;
    socket: Socket;
    startingPlayer: 0 | 1 = 0;
    board: Board = ["", "", "", "", "", "", "", "", ""];

    state: StateGame = "WAITING_PARTNER";

    constructor(args: createRoomArgs, socket: Socket) {
        this.publica = args.publica;
        this.socket = socket;
    }

    addPlayer(name: string) {
        const indexPlayer = !this.player[0].name ? 0 : 1;
        this.player[indexPlayer].name = name;
        this.player[indexPlayer].lives = 3;
        if (this.player[1].name) {
            this.state = this.startingPlayer === 0 ? "SHIFT_P1" : "SHIFT_P2";
            this.startingPlayer = this.startingPlayer === 0 ? 1 : 0;
        }
        this.communicateRoom();
    }

    getRoom(): RoomBackend {
        return {
            publica: this.publica,
            player: this.player,
            id: this.id,
            state: this.state,
            board: this.board,
        };
    }
    /**Comunica el estado actual a todos sus integrantes */
    communicateRoom() {
        global.io.to("room-" + this.id).emit("room", this.getRoom());
    }
    abandonmentPlayer() {
        this.state = "ABANDONED";
        this.communicateRoom();
    }
    play(playerNumber: 1 | 2, position: POSITION_BOARD) {
        if (
            (playerNumber !== 1 && this.state === "SHIFT_P1") ||
            (playerNumber !== 2 && this.state === "SHIFT_P2")
        )
            return;
        this.board[position] = playerNumber;
        this.state = this.state === "SHIFT_P1" ? "SHIFT_P2" : "SHIFT_P1";
        this.communicateRoom();
    }
}
