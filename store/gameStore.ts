import { create } from "zustand";

import { GameState } from "@/app/game/models/GameState";
import { Pawn } from "@/app/game/models/Pawn";

const colors = ["red", "green", "yellow", "blue"] as const;

const pawns: Pawn[] = colors.flatMap((color) =>
  Array.from({ length: 4 }, (_, i) => ({
    id: `${color}-${i}`,
    color,
    position: -1,
  })),
);

interface GameStore extends GameState {
  rollDice: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  currentPlayer: "red",

  dice: 1,

  pawns,

  rollDice: () =>
    set({
      dice: Math.floor(Math.random() * 6) + 1,
    }),
}));
