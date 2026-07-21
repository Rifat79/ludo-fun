import { Pawn } from "./Pawn";
import { PlayerColor } from "./Player";

export interface GameState {
  currentPlayer: PlayerColor;
  dice: number;
  pawns: Pawn[];
}
