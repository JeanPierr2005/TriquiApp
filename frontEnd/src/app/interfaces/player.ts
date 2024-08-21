export interface Player {
  name: string;
  lives: number;
}

export const PLAYER_VOID: Player = {
  name: '',
  lives: 3,
};
