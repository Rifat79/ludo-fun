import { Polygon } from "react-native-svg";

const CELL = 24;
const CENTER = CELL * 7.5; // 180

export default function Center() {
  return (
    <>
      {/* Red */}
      <Polygon
        points={`${CENTER},${CENTER} ${CELL * 6},${CELL * 6} ${CELL * 9},${CELL * 6}`}
        fill='#e74c3c'
      />

      {/* Green */}
      <Polygon
        points={`${CENTER},${CENTER} ${CELL * 9},${CELL * 6} ${CELL * 9},${CELL * 9}`}
        fill='#2ecc71'
      />

      {/* Blue */}
      <Polygon
        points={`${CENTER},${CENTER} ${CELL * 9},${CELL * 9} ${CELL * 6},${CELL * 9}`}
        fill='#3498db'
      />

      {/* Yellow */}
      <Polygon
        points={`${CENTER},${CENTER} ${CELL * 6},${CELL * 9} ${CELL * 6},${CELL * 6}`}
        fill='#f1c40f'
      />
    </>
  );
}
