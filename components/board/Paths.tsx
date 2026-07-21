import { Rect } from "react-native-svg";

const CELL = 24;

export default function Paths() {
  const cells = [];

  // ---------- White Vertical ----------
  for (let y = 0; y < 15; y++) {
    if (y >= 6 && y <= 8) continue;

    for (let x = 6; x <= 8; x++) {
      cells.push(
        <Rect
          key={`v-${x}-${y}`}
          x={x * CELL}
          y={y * CELL}
          width={CELL}
          height={CELL}
          fill='white'
          stroke='#bbb'
        />,
      );
    }
  }

  // ---------- White Horizontal ----------
  for (let x = 0; x < 15; x++) {
    if (x >= 6 && x <= 8) continue;

    for (let y = 6; y <= 8; y++) {
      cells.push(
        <Rect
          key={`h-${x}-${y}`}
          x={x * CELL}
          y={y * CELL}
          width={CELL}
          height={CELL}
          fill='white'
          stroke='#bbb'
        />,
      );
    }
  }

  // ---------- Red Home Lane ----------
  for (let y = 1; y <= 5; y++) {
    cells.push(
      <Rect
        key={`red-${y}`}
        x={7 * CELL}
        y={y * CELL}
        width={CELL}
        height={CELL}
        fill='#e74c3c'
        stroke='#bbb'
      />,
    );
  }

  // ---------- Green Home Lane ----------
  for (let x = 9; x <= 13; x++) {
    cells.push(
      <Rect
        key={`green-${x}`}
        x={x * CELL}
        y={7 * CELL}
        width={CELL}
        height={CELL}
        fill='#2ecc71'
        stroke='#bbb'
      />,
    );
  }

  // ---------- Yellow Home Lane ----------
  for (let y = 9; y <= 13; y++) {
    cells.push(
      <Rect
        key={`yellow-${y}`}
        x={7 * CELL}
        y={y * CELL}
        width={CELL}
        height={CELL}
        fill='#f1c40f'
        stroke='#bbb'
      />,
    );
  }

  // ---------- Blue Home Lane ----------
  for (let x = 1; x <= 5; x++) {
    cells.push(
      <Rect
        key={`blue-${x}`}
        x={x * CELL}
        y={7 * CELL}
        width={CELL}
        height={CELL}
        fill='#3498db'
        stroke='#bbb'
      />,
    );
  }

  return <>{cells}</>;
}
