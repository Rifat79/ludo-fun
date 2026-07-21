import { Rect } from "react-native-svg";

const CELL = 24;

export default function HomeAreas() {
  return (
    <>
      {/* Red */}
      <Rect x={0} y={0} width={CELL * 6} height={CELL * 6} fill='#e74c3c' />

      {/* Green */}
      <Rect
        x={CELL * 9}
        y={0}
        width={CELL * 6}
        height={CELL * 6}
        fill='#2ecc71'
      />

      {/* Yellow */}
      <Rect
        x={0}
        y={CELL * 9}
        width={CELL * 6}
        height={CELL * 6}
        fill='#f1c40f'
      />

      {/* Blue */}
      <Rect
        x={CELL * 9}
        y={CELL * 9}
        width={CELL * 6}
        height={CELL * 6}
        fill='#3498db'
      />
    </>
  );
}
