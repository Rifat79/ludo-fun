import { Pawn, PlayerColor } from "@/app/game/models/Pawn";
import { create } from "zustand";

const COLORS: PlayerColor[] = ["red", "green", "yellow", "blue"];

const createInitialPawns = (): Pawn[] => {
  const pawns: Pawn[] = [];
  COLORS.forEach((color) => {
    for (let i = 0; i < 4; i++) {
      pawns.push({
        id: `${color}-${i}`,
        color,
        position: -1, // All start in base
      });
    }
  });
  return pawns;
};

interface GameState {
  pawns: Pawn[];
  currentPlayerIndex: number;
  dice: number;
  isRolling: boolean;
  movablePawns: string[];
  message: string;

  rollDice: () => void;
  movePawn: (pawnId: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  pawns: createInitialPawns(),
  currentPlayerIndex: 0, // 0 = Red, 1 = Green, 2 = Yellow, 3 = Blue
  dice: 0,
  isRolling: false,
  movablePawns: [],
  message: "Red's Turn",

  rollDice: () => {
    const { isRolling, currentPlayerIndex, pawns } = get();
    if (isRolling) return;

    set({ isRolling: true, movablePawns: [], message: "Rolling..." });

    // Simulate dice roll animation time
    setTimeout(() => {
      const newDice = Math.floor(Math.random() * 6) + 1;
      const currentColor = COLORS[currentPlayerIndex];

      // Find which pawns can legally move
      const movable = pawns
        .filter((p) => p.color === currentColor)
        .filter((p) => {
          if (p.position === 58) return false; // Already finished
          if (p.position === -1) return newDice === 6; // Need a 6 to leave base
          // Check if move exceeds the home stretch (57)
          if (p.position >= 52 && p.position + newDice > 57) return false;
          return true;
        })
        .map((p) => p.id);

      if (movable.length === 0) {
        // No moves available, skip turn
        set({
          dice: newDice,
          isRolling: false,
          message: `${currentColor} rolled ${newDice}. No moves!`,
          currentPlayerIndex: (currentPlayerIndex + 1) % 4,
        });
        setTimeout(() => {
          set({ message: `${COLORS[get().currentPlayerIndex]}'s Turn` });
        }, 1500);
      } else {
        // Moves available
        set({
          dice: newDice,
          isRolling: false,
          movablePawns: movable,
          message: `Select a pawn to move ${newDice}!`,
        });
      }
    }, 600);
  },

  movePawn: (pawnId: string) => {
    const { pawns, dice, currentPlayerIndex, movablePawns } = get();
    if (!movablePawns.includes(pawnId)) return;

    let extraTurn = false;
    const newPawns = pawns.map((p) => {
      if (p.id === pawnId) {
        let newPosition = p.position;
        if (newPosition === -1) {
          newPosition = 0; // Move out of base
        } else {
          newPosition += dice;
        }

        if (dice === 6) extraTurn = true; // Roll again on 6
        if (newPosition === 57) extraTurn = true; // Roll again on reaching home

        return { ...p, position: newPosition };
      }
      return p;
    });

    // TODO: Add capture logic here later (if landing on opponent)

    const nextPlayer = extraTurn
      ? currentPlayerIndex
      : (currentPlayerIndex + 1) % 4;

    set({
      pawns: newPawns,
      movablePawns: [],
      currentPlayerIndex: nextPlayer,
      message: `${COLORS[nextPlayer]}'s Turn`,
    });
  },

  resetGame: () => {
    set({
      pawns: createInitialPawns(),
      currentPlayerIndex: 0,
      dice: 0,
      isRolling: false,
      movablePawns: [],
      message: "Red's Turn",
    });
  },
}));
