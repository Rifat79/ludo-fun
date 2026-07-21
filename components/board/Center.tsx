import { G, Polygon } from "react-native-svg";

const CELL = 24;
const C = 7.5 * CELL; // Center point (180)

export default function Center() {
  return (
    <G>
      {/* Green Triangle (Left) */}
      <Polygon
        points={`${6 * CELL},${6 * CELL} ${C},${C} ${6 * CELL},${9 * CELL}`}
        fill='#34A853'
      />
      {/* Yellow Triangle (Top) */}
      <Polygon
        points={`${6 * CELL},${6 * CELL} ${C},${C} ${9 * CELL},${6 * CELL}`}
        fill='#F1C40F'
      />
      {/* Blue Triangle (Right) */}
      <Polygon
        points={`${9 * CELL},${6 * CELL} ${C},${C} ${9 * CELL},${9 * CELL}`}
        fill='#4285F4'
      />
      {/* Red Triangle (Bottom) */}
      <Polygon
        points={`${6 * CELL},${9 * CELL} ${C},${C} ${9 * CELL},${9 * CELL}`}
        fill='#EA4335'
      />
    </G>
  );
}
