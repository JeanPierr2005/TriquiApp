import { Socket } from "socket.io";
import { createRoomArgs } from "../interfaces/createRoom";
import { Player, PLAYER_VOID } from "../interfaces/player";

export class Room {
    publica: boolean;
    player: [Player, Player] = [{ ...PLAYER_VOID }, { ...PLAYER_VOID }];
    id: number;
    socket: Socket;

    constructor(args: createRoomArgs, socket: Socket) {
        this.publica = args.publica;
        this.socket = socket;
    }

    addPlayer(name: string) {
        const indexPlayer = !this.player[0].name ? 0 : 1;
        this.player[indexPlayer].name = name;
        this.player[indexPlayer].lives = 3;
        this.communicateRoom();
    }

    getRoom() {
        return {
            publica: this.publica,
            player: this.player,
            id: this.id,
        };
    }
    /**Comunica el estado actual a todos sus integrantes */
    communicateRoom() {
        global.io.to("room-" + this.id).emit("room", this.getRoom());
    }
    abandonmentPlayer() {
        //Cambiar el estado de la sala a abandonado
        this.communicateRoom();
    }
}
