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

// The 8 absolute path positions that are safe from captures
const SAFE_SQUARES = [0, 8, 13, 21, 26, 34, 39, 47];

interface GameState {
  pawns: Pawn[];
  currentPlayerIndex: number;
  dice: number;
  isRolling: boolean;
  isMoving: boolean;
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
          if (p.position === 58) return false; // Already finished
          if (p.position === -1) return newDice === 6; // Need a 6 to leave base
          // Check if move exceeds the home stretch (57)
          if (p.position >= 52 && p.position + newDice > 57) return false;
          return true;
        })
        .map((p) => p.id);

      if (movable.length === 0) {
        let reason = "No valid moves!";
        // Check if the reason was overshooting the center
        const hasPawnsInHomeStretch = pawns.some(
          (p) =>
            p.color === currentColor && p.position >= 52 && p.position < 57,
        );
        if (hasPawnsInHomeStretch && newDice > 1)
          reason = `Rolled ${newDice}. Need exact number to finish!`;

        set({
          dice: newDice,
          isRolling: false,
          message: `${currentColor} ${reason} Turn skipped.`,
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

    set({ movablePawns: [], isMoving: true, message: "Moving..." });

    const pawnIndex = pawns.findIndex((p) => p.id === pawnId);
    let stepsLeft = dice;
    const currentColor = COLORS[currentPlayerIndex];

    const performStep = () => {
      const currentPawns = get().pawns;
      const currentPawn = currentPawns[pawnIndex];

      let newPosition = currentPawn.position;

      if (currentPawn.position === -1) {
        newPosition = 0;
        stepsLeft = 0; // Entering the board consumes the whole turn
      } else if (currentPawn.position < 57) {
        newPosition = currentPawn.position + 1;
        stepsLeft--;
      } else {
        stepsLeft = 0;
      }

      const newPawns = [...currentPawns];
      newPawns[pawnIndex] = { ...currentPawn, position: newPosition };
      set({ pawns: newPawns });

      if (stepsLeft > 0) {
        setTimeout(performStep, 200);
      } else {
        // Finished moving! Check for captures...
        let captureMessage = "";

        // Only allow captures on the main 52-path, NOT in the home stretch (52+)
        if (newPosition < 52 && !SAFE_SQUARES.includes(newPosition)) {
          const startIdxMap: Record<PlayerColor, number> = {
            red: 39,
            green: 0,
            yellow: 13,
            blue: 26,
          };
          const myAbsolutePos = (startIdxMap[currentColor] + newPosition) % 52;

          const capturedPawns = newPawns.map((p) => {
            if (
              p.color !== currentColor &&
              p.position >= 0 &&
              p.position < 52
            ) {
              const theirAbsolutePos = (startIdxMap[p.color] + p.position) % 52;
              if (theirAbsolutePos === myAbsolutePos) {
                captureMessage = " Capture!"; // Will append to message
                return { ...p, position: -1 }; // Send back to base
              }
            }
            return p;
          });

          if (captureMessage) {
            set({ pawns: capturedPawns });
          }
        }

        let extraTurn = false;
        if (dice === 6) extraTurn = true;
        if (newPosition === 57) extraTurn = true;

        const nextPlayer = extraTurn
          ? currentPlayerIndex
          : (currentPlayerIndex + 1) % 4;

        set({
          isMoving: false,
          currentPlayerIndex: nextPlayer,
          message: `${COLORS[nextPlayer]}'s Turn${captureMessage}`,
        });
      }
    };

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
