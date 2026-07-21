import { Circle } from "react-native-svg";

type PawnProps = {
  x: number;
  y: number;
  color: string;
};

export default function Pawn({ x, y, color }: PawnProps) {
  return (
    <>
      {/* Shadow */}
      <Circle cx={x + 1.5} cy={y + 2} r={9} fill='rgba(0,0,0,0.25)' />

      {/* Pawn */}
      <Circle cx={x} cy={y} r={9} fill={color} stroke='white' strokeWidth={2} />
    </>
  );
}
