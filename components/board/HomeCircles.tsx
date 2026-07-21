import Pawn from "../pawn/Pawn";

const CELL = 24;

export default function HomeCircles() {
  return (
    <>
      {/* Red */}
      <Pawn x={CELL * 2} y={CELL * 2} color='#e74c3c' />
      <Pawn x={CELL * 4} y={CELL * 2} color='#e74c3c' />
      <Pawn x={CELL * 2} y={CELL * 4} color='#e74c3c' />
      <Pawn x={CELL * 4} y={CELL * 4} color='#e74c3c' />

      {/* Green */}
      <Pawn x={CELL * 11} y={CELL * 2} color='#2ecc71' />
      <Pawn x={CELL * 13} y={CELL * 2} color='#2ecc71' />
      <Pawn x={CELL * 11} y={CELL * 4} color='#2ecc71' />
      <Pawn x={CELL * 13} y={CELL * 4} color='#2ecc71' />

      {/* Yellow */}
      <Pawn x={CELL * 2} y={CELL * 11} color='#f1c40f' />
      <Pawn x={CELL * 4} y={CELL * 11} color='#f1c40f' />
      <Pawn x={CELL * 2} y={CELL * 13} color='#f1c40f' />
      <Pawn x={CELL * 4} y={CELL * 13} color='#f1c40f' />

      {/* Blue */}
      <Pawn x={CELL * 11} y={CELL * 11} color='#3498db' />
      <Pawn x={CELL * 13} y={CELL * 11} color='#3498db' />
      <Pawn x={CELL * 11} y={CELL * 13} color='#3498db' />
      <Pawn x={CELL * 13} y={CELL * 13} color='#3498db' />
    </>
  );
}
