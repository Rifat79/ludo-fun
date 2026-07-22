import { Pawn, PlayerColor } from "@/app/game/models/Pawn";
import { playSound } from "@/utils/SoundManager";
import { create } from "zustand";

const ALL_COLORS: PlayerColor[] = ["red", "green", "yellow", "blue"];

// Team mapping: Red+Yellow vs Green+Blue
const TEAMS: Record<PlayerColor, PlayerColor> = {
  red: "yellow",
  yellow: "red",
  green: "blue",
  blue: "green",
};

const getColorsForPlayers = (num: number): PlayerColor[] => {
  if (num === 2) return ["red", "yellow"];
  if (num === 3) return ["red", "yellow", "green"];
  return ALL_COLORS;
};

const createInitialPawns = (colors: PlayerColor[]): Pawn[] => {
  const pawns: Pawn[] = [];
  colors.forEach((color) => {
    for (let i = 0; i < 4; i++) {
      pawns.push({ id: `${color}-${i}`, color, position: -1 });
    }
  });
  return pawns;
};

const SAFE_SQUARES = [0, 8, 13, 21, 26, 34, 39, 47];

interface GameState {
  numPlayers: number;
  mode: "classic" | "team";
  activeColors: PlayerColor[];
  pawns: Pawn[];
  currentPlayerIndex: number;
  dice: number;
  isRolling: boolean;
  isMoving: boolean;
  movablePawns: string[];
  message: string;
  consecutiveSixes: number;
  capturedPawnId: string | null;
  winner: PlayerColor | null; // In team mode, this stores the winning team color

  initGame: (numPlayers: number, mode: "classic" | "team") => void;
  rollDice: () => void;
  movePawn: (pawnId: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  numPlayers: 4,
  mode: "classic",
  activeColors: ALL_COLORS,
  pawns: createInitialPawns(ALL_COLORS),
  currentPlayerIndex: 0,
  dice: 0,
  isRolling: false,
  isMoving: false,
  movablePawns: [],
  message: "Red's Turn",
  consecutiveSixes: 0,
  capturedPawnId: null,
  winner: null,

  initGame: (numPlayers: number, mode: "classic" | "team") => {
    const colors = getColorsForPlayers(numPlayers);
    set({
      numPlayers,
      mode,
      activeColors: colors,
      pawns: createInitialPawns(colors),
      currentPlayerIndex: 0,
      dice: 0,
      isRolling: false,
      isMoving: false,
      movablePawns: [],
      message: `${colors[0]}'s Turn`,
      consecutiveSixes: 0,
      capturedPawnId: null,
      winner: null,
    });
  },

  rollDice: () => {
    const {
      isRolling,
      isMoving,
      currentPlayerIndex,
      pawns,
      consecutiveSixes,
      winner,
      activeColors,
      mode,
    } = get();
    if (isRolling || isMoving || winner) return;

    set({ isRolling: true, movablePawns: [], message: "Rolling..." });
    playSound("dice");

    setTimeout(() => {
      const newDice = Math.floor(Math.random() * 6) + 1;
      const currentColor = activeColors[currentPlayerIndex];
      let newConsecutiveSixes = consecutiveSixes;

      if (newDice === 6) {
        newConsecutiveSixes++;
        if (newConsecutiveSixes === 3) {
          set({
            dice: newDice,
            isRolling: false,
            consecutiveSixes: 0,
            message: `${currentColor} rolled three 6s! Turn forfeited.`,
            currentPlayerIndex: (currentPlayerIndex + 1) % activeColors.length,
          });
          setTimeout(
            () =>
              set({
                message: `${get().activeColors[get().currentPlayerIndex]}'s Turn`,
              }),
            1500,
          );
          return;
        }
      } else {
        newConsecutiveSixes = 0;
      }

      // Helper to find movable pawns for a specific color
      const findMoves = (color: PlayerColor) =>
        pawns
          .filter((p) => p.color === color)
          .filter((p) => {
            if (p.position === 57) return false;
            if (p.position === -1) return newDice === 6;
            if (p.position >= 52 && p.position + newDice > 57) return false;
            return true;
          })
          .map((p) => p.id);

      // 1. Check own pawns
      let movable = findMoves(currentColor);

      // 2. TEAM MODE: If no own moves, check teammate's pawns
      if (mode === "team" && movable.length === 0) {
        movable = findMoves(TEAMS[currentColor]);
      }

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
          currentPlayerIndex: (currentPlayerIndex + 1) % activeColors.length,
        });
        setTimeout(
          () =>
            set({
              message: `${get().activeColors[get().currentPlayerIndex]}'s Turn`,
            }),
          1500,
        );
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
    const {
      pawns,
      dice,
      currentPlayerIndex,
      movablePawns,
      winner,
      activeColors,
      mode,
    } = get();
    if (!movablePawns.includes(pawnId) || winner) return;

    set({ movablePawns: [], isMoving: true, message: "Moving..." });

    const pawnIndex = pawns.findIndex((p) => p.id === pawnId);
    let stepsLeft = dice;
    const currentColor = activeColors[currentPlayerIndex]; // The player who rolled

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

        // Captures use the moving pawn's color, NOT the roller's color
        const movingPawnColor = currentPawn.color;

        if (newPosition < 52 && !SAFE_SQUARES.includes(newPosition)) {
          const startIdxMap: Record<PlayerColor, number> = {
            red: 38,
            green: 51,
            yellow: 12,
            blue: 25,
          };
          const myAbsolutePos = (startIdxMap[currentColor] + newPosition) % 52;

          const capturedPawns = newPawns.map((p) => {
            const isTeammate =
              mode === "team" && p.color === TEAMS[currentColor];
            if (
              p.color !== currentColor &&
              !isTeammate &&
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
        let isWin = false;
        if (mode === "team") {
          // Team wins if ALL 8 pawns (current + teammate) are home
          isWin = get()
            .pawns.filter(
              (p) =>
                p.color === currentColor || p.color === TEAMS[currentColor],
            )
            .every((p) => p.position === 57);
        } else {
          // Classic win if all 4 of your pawns are home
          isWin = get()
            .pawns.filter((p) => p.color === currentColor)
            .every((p) => p.position === 57);
        }

        if (isWin) {
          set({
            isMoving: false,
            winner: currentColor,
            message: `${currentColor} Wins!`,
          });
          return;
        }

        let extraTurn = false;
        if (dice === 6) extraTurn = true;
        if (newPosition === 57) extraTurn = true;

        const nextPlayer = extraTurn
          ? currentPlayerIndex
          : (currentPlayerIndex + 1) % activeColors.length;

        set({
          isMoving: false,
          currentPlayerIndex: nextPlayer,
          message: `${activeColors[nextPlayer]}'s Turn${captureMessage}`,
        });

        if (capturedId) {
          setTimeout(() => set({ capturedPawnId: null }), 1000);
        }
      }
    };

    performStep();
  },

  resetGame: () => {
    const { activeColors } = get();
    set({
      pawns: createInitialPawns(activeColors),
      currentPlayerIndex: 0,
      dice: 0,
      isRolling: false,
      isMoving: false,
      movablePawns: [],
      message: `${activeColors[0]}'s Turn`,
      consecutiveSixes: 0,
      capturedPawnId: null,
      winner: null,
    });
  },
}));
