import { G, Rect } from "react-native-svg";

const CELL = 24;

export default function Paths() {
  return (
    <G>
      {/* Horizontal Path */}
      <Rect
        x={0}
        y={6 * CELL}
        width={15 * CELL}
        height={3 * CELL}
        fill='#FFFFFF'
      />
      {/* Vertical Path */}
      <Rect
        x={6 * CELL}
        y={0}
        width={3 * CELL}
        height={15 * CELL}
        fill='#FFFFFF'
      />
    </G>
  );
}
