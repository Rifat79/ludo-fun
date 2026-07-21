import { Line, Rect } from "react-native-svg";

export default function BaseBoard() {
  return (
    <>
      {/* Outer board */}
      <Rect
        x={0}
        y={0}
        width={360}
        height={360}
        fill='#ffffff'
        stroke='#000'
        strokeWidth={2}
      />

      {/* Grid lines every 24 units (360 / 15) */}
      {Array.from({ length: 16 }).map((_, i) => (
        <Line
          key={`v-${i}`}
          x1={i * 24}
          y1={0}
          x2={i * 24}
          y2={360}
          stroke='#cccccc'
          strokeWidth={1}
        />
      ))}

      {Array.from({ length: 16 }).map((_, i) => (
        <Line
          key={`h-${i}`}
          x1={0}
          y1={i * 24}
          x2={360}
          y2={i * 24}
          stroke='#cccccc'
          strokeWidth={1}
        />
      ))}
    </>
  );
}
