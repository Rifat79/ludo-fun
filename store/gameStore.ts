import { Pawn, PlayerColor } from "@/app/game/models/Pawn";
import { playSound } from "@/utils/SoundManager";
import { create } from "zustand";

const COLORS: PlayerColor[] = ["red", "green", "yellow", "blue"];

const createInitialPawns = (): Pawn[] => {
  const pawns: Pawn[] = [];
  COLORS.forEach((color) => {
    for (let i = 0; i < 4; i++) {
      pawns.push({ id: `${color}-${i}`, color, position: -1 });
    }
  });
  return pawns;
};

const SAFE_SQUARES = [0, 8, 13, 21, 26, 34, 39, 47];

interface GameState {
  pawns: Pawn[];
  currentPlayerIndex: number;
  dice: number;
  isRolling: boolean;
  isMoving: boolean;
  movablePawns: string[];
  message: string;
  consecutiveSixes: number;
  capturedPawnId: string | null;
  winner: PlayerColor | null; // NEW: Tracks who won the game

  rollDice: () => void;
  movePawn: (pawnId: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  pawns: createInitialPawns(),
  currentPlayerIndex: 0,
  dice: 0,
  isRolling: false,
  isMoving: false,
  movablePawns: [],
  message: "Red's Turn",
  consecutiveSixes: 0,
  capturedPawnId: null,
  winner: null,

  rollDice: () => {
    const {
      isRolling,
      isMoving,
      currentPlayerIndex,
      pawns,
      consecutiveSixes,
      winner,
    } = get();
    // Block rolling if game is over or currently animating
    if (isRolling || isMoving || winner) return;

    set({ isRolling: true, movablePawns: [], message: "Rolling..." });
    playSound("dice");

    setTimeout(() => {
      const newDice = Math.floor(Math.random() * 6) + 1;
      const currentColor = COLORS[currentPlayerIndex];
      let newConsecutiveSixes = consecutiveSixes;

      if (newDice === 6) {
        newConsecutiveSixes++;
        if (newConsecutiveSixes === 3) {
          set({
            dice: newDice,
            isRolling: false,
            consecutiveSixes: 0,
            message: `${currentColor} rolled three 6s! Turn forfeited.`,
            currentPlayerIndex: (currentPlayerIndex + 1) % 4,
          });
          setTimeout(() => {
            set({ message: `${COLORS[get().currentPlayerIndex]}'s Turn` });
          }, 1500);
          return;
        }
      } else {
        newConsecutiveSixes = 0;
      }

      const movable = pawns
        .filter((p) => p.color === currentColor)
        .filter((p) => {
          if (p.position === 57) return false; // Changed to 57 (finished)
          if (p.position === -1) return newDice === 6;
          if (p.position >= 52 && p.position + newDice > 57) return false;
          return true;
        })
        .map((p) => p.id);

      if (movable.length === 0) {
        let reason = "No valid moves!";
        const hasPawnsInHomeStretch = pawns.some(
          (p) =>
            p.color === currentColor && p.position >= 52 && p.position < 57,
        );
        if (hasPawnsInHomeStretch && newDice > 1)
          reason = `Rolled ${newDice}. Need exact number to finish!`;

        set({
          dice: newDice,
          isRolling: false,
          consecutiveSixes: newConsecutiveSixes,
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
          consecutiveSixes: newConsecutiveSixes,
          movablePawns: movable,
          message: `Select a pawn to move ${newDice} steps!`,
        });
      }
    }, 600);
  },

  movePawn: (pawnId: string) => {
    const { pawns, dice, currentPlayerIndex, movablePawns, winner } = get();
    if (!movablePawns.includes(pawnId) || winner) return;

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
        stepsLeft = 0;
      } else if (currentPawn.position < 57) {
        newPosition = currentPawn.position + 1;
        stepsLeft--;
        playSound("move");
      } else {
        stepsLeft = 0;
      }

      const newPawns = [...currentPawns];
      newPawns[pawnIndex] = { ...currentPawn, position: newPosition };
      set({ pawns: newPawns });

      if (stepsLeft > 0) {
        setTimeout(performStep, 200);
      } else {
        let captureMessage = "";
        let capturedId = null;

        // Check captures
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
                captureMessage = " Capture!";
                capturedId = p.id;
                playSound("capture");
                return { ...p, position: -1 };
              }
            }
            return p;
          });

          if (captureMessage) {
            set({ pawns: capturedPawns, capturedPawnId: capturedId });
          }
        }

        // CHECK WIN CONDITION
        const allHome = get()
          .pawns.filter((p) => p.color === currentColor)
          .every((p) => p.position === 57);

        if (allHome) {
          set({
            isMoving: false,
            winner: currentColor,
            message: `${currentColor} Wins!`,
          });
          return; // Stop turn progression
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

        if (capturedId) {
          setTimeout(() => set({ capturedPawnId: null }), 1000);
        }
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
      consecutiveSixes: 0,
      capturedPawnId: null,
      winner: null,
    });
  },
}));
