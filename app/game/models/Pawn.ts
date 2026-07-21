import { PlayerColor } from "./Player";

export interface Pawn {
  id: string;
  color: PlayerColor;

  /**
   * -1 = inside home
   * 0-51 = board path
   * 52-57 = home lane
   * 58 = finished
   */
  position: number;
}
