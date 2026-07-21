import { G, Rect } from "react-native-svg";

const CELL = 24;

export default function HomeAreas() {
  return (
    <G>
      {/* Green (Top-Left) */}
      <Rect x={0} y={0} width={6 * CELL} height={6 * CELL} fill='#34A853' />
      {/* Yellow (Top-Right) */}
      <Rect
        x={9 * CELL}
        y={0}
        width={6 * CELL}
        height={6 * CELL}
        fill='#F1C40F'
      />
      {/* Blue (Bottom-Right) */}
      <Rect
        x={9 * CELL}
        y={9 * CELL}
        width={6 * CELL}
        height={6 * CELL}
        fill='#4285F4'
      />
      {/* Red (Bottom-Left) */}
      <Rect
        x={0}
        y={9 * CELL}
        width={6 * CELL}
        height={6 * CELL}
        fill='#EA4335'
      />
    </G>
  );
}
