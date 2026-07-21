import { Circle, G } from "react-native-svg";

const CELL = 24;

export default function HomeCircles() {
  return (
    <G>
      {/* Green (Top-Left) */}
      <Circle cx={1.5 * CELL} cy={1.5 * CELL} r={20} fill='white' />
      <Circle cx={4.5 * CELL} cy={1.5 * CELL} r={20} fill='white' />
      <Circle cx={1.5 * CELL} cy={4.5 * CELL} r={20} fill='white' />
      <Circle cx={4.5 * CELL} cy={4.5 * CELL} r={20} fill='white' />

      {/* Yellow (Top-Right) */}
      <Circle cx={10.5 * CELL} cy={1.5 * CELL} r={20} fill='white' />
      <Circle cx={13.5 * CELL} cy={1.5 * CELL} r={20} fill='white' />
      <Circle cx={10.5 * CELL} cy={4.5 * CELL} r={20} fill='white' />
      <Circle cx={13.5 * CELL} cy={4.5 * CELL} r={20} fill='white' />

      {/* Blue (Bottom-Right) */}
      <Circle cx={10.5 * CELL} cy={10.5 * CELL} r={20} fill='white' />
      <Circle cx={13.5 * CELL} cy={10.5 * CELL} r={20} fill='white' />
      <Circle cx={10.5 * CELL} cy={13.5 * CELL} r={20} fill='white' />
      <Circle cx={13.5 * CELL} cy={13.5 * CELL} r={20} fill='white' />

      {/* Red (Bottom-Left) */}
      <Circle cx={1.5 * CELL} cy={10.5 * CELL} r={20} fill='white' />
      <Circle cx={4.5 * CELL} cy={10.5 * CELL} r={20} fill='white' />
      <Circle cx={1.5 * CELL} cy={13.5 * CELL} r={20} fill='white' />
      <Circle cx={4.5 * CELL} cy={13.5 * CELL} r={20} fill='white' />
    </G>
  );
}
