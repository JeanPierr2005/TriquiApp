import { Player } from "./player";

export type StateGame =
    | "WAITING_PARTNER"
    | "SHIFT_P1"
    | "SHIFT_P2"
    | "WINNER_P2"
    | "WINNER_P2"
    | "DRAW"
    | "ABANDONED"
    | "FINAL_VICTRY_P1"
    | "FINAL_VICTRY_P2";

export interface RoomBackend {
    publica: boolean;
    player: [Player, Player];
    id: number;
    state: StateGame;
    board: Board;
}

export type POSITION_BOARD = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Board = [
    PlayerNumber | "",
    PlayerNumber | "",
    PlayerNumber | "",
    PlayerNumber | "",
    PlayerNumber | "",
    PlayerNumber | "",
    PlayerNumber | "",
    PlayerNumber | "",
    PlayerNumber | ""
];
export type PlayerNumber = 1 | 2;
