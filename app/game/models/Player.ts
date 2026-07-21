export type PlayerColor = "red" | "green" | "yellow" | "blue";

export interface Player {
  id: number;
  color: PlayerColor;
  name: string;
}
