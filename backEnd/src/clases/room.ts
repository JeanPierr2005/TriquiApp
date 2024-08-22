import { Socket } from "socket.io";
import { createRoomArgs } from "../interfaces/createRoom";
import { Player, PLAYER_VOID } from "../interfaces/player";
import {
    Board,
    POSITION_BOARD,
    PositionWinner,
    RoomBackend,
    StateGame,
} from "../interfaces/room";

export class Room {
    publica: boolean;
    players: [Player, Player] = [{ ...PLAYER_VOID }, { ...PLAYER_VOID }];
    id: number;
    socket: Socket;
    startingPlayer: 0 | 1 = 0;
    board: Board = ["", "", "", "", "", "", "", "", ""];
    positionWinner?: PositionWinner;

    state: StateGame = "WAITING_PARTNER";

    constructor(args: createRoomArgs, socket: Socket) {
        this.publica = args.publica;
        this.socket = socket;
    }

    addPlayer(name: string) {
        const indexPlayer = !this.players[0].name ? 0 : 1;
        this.players[indexPlayer].name = name;
        this.players[indexPlayer].lives = 3;
        if (this.players[1].name) {
            this.state = this.startingPlayer === 0 ? "SHIFT_P1" : "SHIFT_P2";
        }
        this.communicateRoom();
    }

    getRoom(): RoomBackend {
        return {
            publica: this.publica,
            player: this.players,
            id: this.id,
            state: this.state,
            board: this.board,
            positionWinner: this.positionWinner,
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
        this.positionWinner = undefined;

        // Cambio de turno de los jugadores
        this.state = this.state === "SHIFT_P1" ? "SHIFT_P2" : "SHIFT_P1";

        // Verificacion de empate o de victoria
        const end = this.verificationVictory();
        console.log("Verificando victoria", end);
        if (end === "DRAW") this.state = "DRAW";
        else if (typeof end === "object") {
            const indexAffectedPlayer = playerNumber === 1 ? 1 : 0;
            this.players[indexAffectedPlayer].lives--;
            if (this.players[indexAffectedPlayer].lives === 0) {
                this.state =
                    playerNumber === 1 ? "FINAL_VICTRY_P1" : "FINAL_VICTRY_P2";
                this.positionWinner = end;
            } else {
                this.state = playerNumber === 1 ? "WINNER_P1" : "WINNER_P2";
                this.positionWinner = end;
            }
        }
        //Comunicacion de sala final
        this.communicateRoom();
    }

    verificationVictory(): PositionWinner | "DRAW" | undefined {
        //Verificar las linea horizontales
        for (let i = 0; i < 3; i += 3) {
            if (
                this.board[i] !== "" &&
                this.board[i] === this.board[i + 1] &&
                this.board[i] === this.board[i + 2]
            ) {
                return [i as POSITION_BOARD, i + 1 as POSITION_BOARD, i + 2 as POSITION_BOARD];
            }
        }

        // Verificar las linea verticales
        for (let i = 0; i < 3; i++) {
            if (
                this.board[i] !== "" &&
                this.board[i] === this.board[i + 3] &&
                this.board[i] === this.board[i + 6]
            ) {
                return [i as POSITION_BOARD, i + 3 as POSITION_BOARD, i + 6 as POSITION_BOARD];
            }
        }

        // Verificar las linea oblicuas
        if (
            this.board[0] !== "" &&
            this.board[0] === this.board[4] &&
            this.board[0] === this.board[8]
        ) {
            return [0, 4, 8];
        }
        if (
            this.board[2] !== "" &&
            this.board[2] === this.board[4] &&
            this.board[2] === this.board[6]
        ) {
            return [2, 4, 6];
        }
        //Verifico si es un empate
        if (!this.board.includes("")) return "DRAW";

        return undefined;
    }

    newRound() {
        console.log("Renovando la ronda");
        this.emptyBoard();
        this.changeInitialPlayer();
        this.positionWinner = undefined
        this.state = this.startingPlayer === 0 ? "SHIFT_P1" : "SHIFT_P2";
        if (this.players[0].lives === 0 || this.players[1].lives === 0) {
            this.players[0].lives = 3;
            this.players[1].lives = 3;
        }
        this.communicateRoom();
    }

    emptyBoard() {
        this.board = ["", "", "", "", "", "", "", "", ""];
    }

    changeInitialPlayer() {
        this.startingPlayer = this.startingPlayer === 0 ? 1 : 0;
    }
}
