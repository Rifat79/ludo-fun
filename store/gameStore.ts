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
  isMoving: boolean; // Added to prevent clicking while animating
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
  isMoving: false,
  movablePawns: [],
  message: "Red's Turn",

  rollDice: () => {
    const { isRolling, isMoving, currentPlayerIndex, pawns } = get();
    if (isRolling || isMoving) return;

    set({ isRolling: true, movablePawns: [], message: "Rolling..." });

    setTimeout(() => {
      const newDice = Math.floor(Math.random() * 6) + 1;
      const currentColor = COLORS[currentPlayerIndex];

      const movable = pawns
        .filter((p) => p.color === currentColor)
        .filter((p) => {
          if (p.position === 58) return false;
          if (p.position === -1) return newDice === 6;
          if (p.position >= 52 && p.position + newDice > 57) return false;
          return true;
        })
        .map((p) => p.id);

      if (movable.length === 0) {
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
        set({
          dice: newDice,
          isRolling: false,
          movablePawns: movable,
          message: `Select a pawn to move ${newDice} steps!`,
        });
      }
    }, 600);
  },

  movePawn: (pawnId: string) => {
    const { pawns, dice, currentPlayerIndex, movablePawns } = get();
    if (!movablePawns.includes(pawnId)) return;

    // Lock movement immediately
    set({ movablePawns: [], isMoving: true, message: "Moving..." });

    const pawnIndex = pawns.findIndex((p) => p.id === pawnId);
    let stepsLeft = dice;

    // Recursive function to move 1 step at a time
    const performStep = () => {
      const currentPawns = get().pawns;
      const currentPawn = currentPawns[pawnIndex];

      let newPosition = currentPawn.position;

      if (currentPawn.position === -1) {
        // Leaving base
        newPosition = 0;
        stepsLeft = 0; // Entering the board consumes the whole turn
      } else if (currentPawn.position < 57) {
        // Moving on board
        newPosition = currentPawn.position + 1;
        stepsLeft--;
      } else {
        stepsLeft = 0;
      }

      // Update state for this single step
      const newPawns = [...currentPawns];
      newPawns[pawnIndex] = { ...currentPawn, position: newPosition };
      set({ pawns: newPawns });

      if (stepsLeft > 0) {
        // Wait 200ms, then do the next step
        setTimeout(performStep, 200);
      } else {
        // Finished moving
        let extraTurn = false;
        if (dice === 6) extraTurn = true; // 6 gives extra turn
        if (newPosition === 57) extraTurn = true; // Reaching home gives extra turn

        // TODO: Add capture logic here later

        const nextPlayer = extraTurn
          ? currentPlayerIndex
          : (currentPlayerIndex + 1) % 4;

        set({
          isMoving: false,
          currentPlayerIndex: nextPlayer,
          message: `${COLORS[nextPlayer]}'s Turn`,
        });
      }
    };

    // Start the first step
    performStep();
  },

  resetGame: () => {
    set({
      pawns: createInitialPawns(),
      currentPlayerIndex: 0,
      dice: 0,
      isRolling: false,
      isMoving: false,
      movablePawns: [],
      message: "Red's Turn",
    });
  },
}));
