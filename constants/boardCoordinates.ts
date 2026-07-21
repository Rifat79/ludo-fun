import { PlayerColor } from "@/app/game/models/Player";

const CELL = 24;
const center = (col: number, row: number) => ({
  x: col * CELL + 12,
  y: row * CELL + 12,
});

export const PATH_COORDS = [
  center(1, 6),
  center(2, 6),
  center(3, 6),
  center(4, 6),
  center(5, 6),
  center(6, 5),
  center(6, 4),
  center(6, 3),
  center(6, 2),
  center(6, 1),
  center(6, 0),
  center(7, 0),
  center(8, 0),
  center(8, 1),
  center(8, 2),
  center(8, 3),
  center(8, 4),
  center(8, 5),
  center(9, 6),
  center(10, 6),
  center(11, 6),
  center(12, 6),
  center(13, 6),
  center(14, 6),
  center(14, 7),
  center(14, 8),
  center(13, 8),
  center(12, 8),
  center(11, 8),
  center(10, 8),
  center(9, 8),
  center(8, 9),
  center(8, 10),
  center(8, 11),
  center(8, 12),
  center(8, 13),
  center(8, 14),
  center(7, 14),
  center(6, 14),
  center(6, 13),
  center(6, 12),
  center(6, 11),
  center(6, 10),
  center(6, 9),
  center(5, 8),
  center(4, 8),
  center(3, 8),
  center(2, 8),
  center(1, 8),
  center(0, 8),
  center(0, 7),
  center(0, 6),
];

export const HOME_COORDS: Record<PlayerColor, { x: number; y: number }[]> = {
  green: [center(1, 7), center(2, 7), center(3, 7), center(4, 7), center(5, 7)],
  yellow: [
    center(7, 1),
    center(7, 2),
    center(7, 3),
    center(7, 4),
    center(7, 5),
  ],
  blue: [
    center(13, 7),
    center(12, 7),
    center(11, 7),
    center(10, 7),
    center(9, 7),
  ],
  red: [
    center(7, 13),
    center(7, 12),
    center(7, 11),
    center(7, 10),
    center(7, 9),
  ],
};

export const BASE_COORDS: Record<PlayerColor, { x: number; y: number }[]> = {
  green: [
    { x: 36, y: 36 },
    { x: 108, y: 36 },
    { x: 36, y: 108 },
    { x: 108, y: 108 },
  ],
  yellow: [
    { x: 252, y: 36 },
    { x: 324, y: 36 },
    { x: 252, y: 108 },
    { x: 324, y: 108 },
  ],
  blue: [
    { x: 252, y: 252 },
    { x: 324, y: 252 },
    { x: 252, y: 324 },
    { x: 324, y: 324 },
  ],
  red: [
    { x: 36, y: 252 },
    { x: 108, y: 252 },
    { x: 36, y: 324 },
    { x: 108, y: 324 },
  ],
};

export const START_INDEX: Record<PlayerColor, number> = {
  green: 0,
  yellow: 13,
  blue: 26,
  red: 39,
};

export const getPawnCoords = (
  color: PlayerColor,
  position: number,
  pawnIndex: number,
) => {
  if (position === -1) {
    return BASE_COORDS[color][pawnIndex];
  } else if (position >= 0 && position <= 51) {
    return PATH_COORDS[(START_INDEX[color] + position) % 52];
  } else if (position >= 52 && position <= 57) {
    return HOME_COORDS[color][position - 52];
  } else {
    return { x: 180, y: 180 };
  }
};
