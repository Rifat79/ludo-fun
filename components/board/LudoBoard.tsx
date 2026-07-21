import { Dimensions, View } from "react-native";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Polygon,
  Rect,
} from "react-native-svg";

import { getPawnCoords } from "@/constants/boardCoordinates";
import { useGameStore } from "@/store/gameStore";
import Pawn from "../pawn/Pawn";

const { width } = Dimensions.get("window");
const CELL = 24;

// Helper component to draw a 5-point star
const Star = ({ cx, cy }: { cx: number; cy: number }) => {
  const r = 10;
  const points = [
    `${cx},${cy - r}`,
    `${cx + r * 0.22},${cy - r * 0.3}`,
    `${cx + r},${cy - r * 0.3}`,
    `${cx + r * 0.37},${cy + r * 0.15}`,
    `${cx + r * 0.6},${cy + r}`,
    `${cx},${cy + r * 0.5}`,
    `${cx - r * 0.6},${cy + r}`,
    `${cx - r * 0.37},${cy + r * 0.15}`,
    `${cx - r},${cy - r * 0.3}`,
    `${cx - r * 0.22},${cy - r * 0.3}`,
  ].join(" ");

  return <Polygon points={points} fill='rgba(0,0,0,0.15)' />;
};

export default function LudoBoard({ size }: { size: number }) {
  const pawns = useGameStore((s) => s.pawns);
  const movablePawns = useGameStore((s) => s.movablePawns);
  const movePawn = useGameStore((s) => s.movePawn);

  const safeSize = size || 300;
  const scale = safeSize / 360;

  return (
    <View style={{ width: safeSize, height: safeSize }}>
      <Svg width={safeSize} height={safeSize} viewBox='0 0 360 360'>
        {/* --- BASE BACKGROUND GRID --- */}
        <Rect x='0' y='0' width='360' height='360' fill='#f0f0f0' />
        {/* --- HOME AREAS (6x6 Corners) --- */}
        <Rect x='0' y='0' width={6 * CELL} height={6 * CELL} fill='#34A853' />
        <Rect
          x={9 * CELL}
          y='0'
          width={6 * CELL}
          height={6 * CELL}
          fill='#F1C40F'
        />
        <Rect
          x={9 * CELL}
          y={9 * CELL}
          width={6 * CELL}
          height={6 * CELL}
          fill='#4285F4'
        />
        <Rect
          x='0'
          y={9 * CELL}
          width={6 * CELL}
          height={6 * CELL}
          fill='#EA4335'
        />
        {/* --- MAIN PATHS (White Cross) --- */}
        <Rect
          x='0'
          y={6 * CELL}
          width={15 * CELL}
          height={3 * CELL}
          fill='#FFFFFF'
        />
        <Rect
          x={6 * CELL}
          y='0'
          width={3 * CELL}
          height={15 * CELL}
          fill='#FFFFFF'
        />
        {/* --- COLORED START SQUARES ON PATH --- */}
        <Rect
          x={1 * CELL}
          y={6 * CELL}
          width={CELL}
          height={CELL}
          fill='#34A853'
        />
        <Rect
          x={8 * CELL}
          y={1 * CELL}
          width={CELL}
          height={CELL}
          fill='#F1C40F'
        />
        <Rect
          x={13 * CELL}
          y={8 * CELL}
          width={CELL}
          height={CELL}
          fill='#4285F4'
        />
        <Rect
          x={6 * CELL}
          y={13 * CELL}
          width={CELL}
          height={CELL}
          fill='#EA4335'
        />
        {/* --- COLORED HOME STRETCH PATHS --- */}
        <Rect
          x={1 * CELL}
          y={7 * CELL}
          width={5 * CELL}
          height={CELL}
          fill='#34A853'
        />
        <Rect
          x={7 * CELL}
          y={1 * CELL}
          width={CELL}
          height={5 * CELL}
          fill='#F1C40F'
        />
        <Rect
          x={9 * CELL}
          y={7 * CELL}
          width={5 * CELL}
          height={CELL}
          fill='#4285F4'
        />
        <Rect
          x={7 * CELL}
          y={9 * CELL}
          width={CELL}
          height={5 * CELL}
          fill='#EA4335'
        />
        {/* --- CENTER TRIANGLES (Final Spot) --- */}
        <Polygon
          points={`${6 * CELL},${6 * CELL} ${180},${180} ${6 * CELL},${9 * CELL}`}
          fill='#34A853'
        />
        <Polygon
          points={`${6 * CELL},${6 * CELL} ${180},${180} ${9 * CELL},${6 * CELL}`}
          fill='#F1C40F'
        />
        <Polygon
          points={`${9 * CELL},${6 * CELL} ${180},${180} ${9 * CELL},${9 * CELL}`}
          fill='#4285F4'
        />
        <Polygon
          points={`${6 * CELL},${9 * CELL} ${180},${180} ${9 * CELL},${9 * CELL}`}
          fill='#EA4335'
        />
        {/* --- GRID LINES (Clipped to ONLY show on the cross arms, NOT the center) --- */}
        <Defs>
          <ClipPath id='crossArmsOnly'>
            {/* Horizontal Arms (Left & Right of center) */}
            <Rect x='0' y={6 * CELL} width={6 * CELL} height={3 * CELL} />
            <Rect
              x={9 * CELL}
              y={6 * CELL}
              width={6 * CELL}
              height={3 * CELL}
            />
            {/* Vertical Arms (Top & Bottom of center) */}
            <Rect x={6 * CELL} y='0' width={3 * CELL} height={6 * CELL} />
            <Rect
              x={6 * CELL}
              y={9 * CELL}
              width={3 * CELL}
              height={6 * CELL}
            />
          </ClipPath>
        </Defs>
        <G
          clipPath='url(#crossArmsOnly)'
          stroke='rgba(0,0,0,0.1)'
          strokeWidth='1'
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <Rect key={`v${i}`} x={i * CELL} y='0' width='1' height='360' />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <Rect key={`h${i}`} x='0' y={i * CELL} width='360' height='1' />
          ))}
        </G>
        {/* --- HOME CIRCLES (White circles inside corners) --- */}
        <G fill='#FFFFFF' stroke='rgba(0,0,0,0.1)' strokeWidth='2'>
          {/* Green */}
          <Circle cx={1.5 * CELL} cy={1.5 * CELL} r={20} />
          <Circle cx={4.5 * CELL} cy={1.5 * CELL} r={20} />
          <Circle cx={1.5 * CELL} cy={4.5 * CELL} r={20} />
          <Circle cx={4.5 * CELL} cy={4.5 * CELL} r={20} />
          {/* Yellow */}
          <Circle cx={10.5 * CELL} cy={1.5 * CELL} r={20} />
          <Circle cx={13.5 * CELL} cy={1.5 * CELL} r={20} />
          <Circle cx={10.5 * CELL} cy={4.5 * CELL} r={20} />
          <Circle cx={13.5 * CELL} cy={4.5 * CELL} r={20} />
          {/* Blue */}
          <Circle cx={10.5 * CELL} cy={10.5 * CELL} r={20} />
          <Circle cx={13.5 * CELL} cy={10.5 * CELL} r={20} />
          <Circle cx={10.5 * CELL} cy={13.5 * CELL} r={20} />
          <Circle cx={13.5 * CELL} cy={13.5 * CELL} r={20} />
          {/* Red */}
          <Circle cx={1.5 * CELL} cy={10.5 * CELL} r={20} />
          <Circle cx={4.5 * CELL} cy={10.5 * CELL} r={20} />
          <Circle cx={1.5 * CELL} cy={13.5 * CELL} r={20} />
          <Circle cx={4.5 * CELL} cy={13.5 * CELL} r={20} />
        </G>
        {/* --- SAFE SPOTS (Stars) --- */}
        <Star cx={1.5 * CELL} cy={6.5 * CELL} /> {/* Green Start */}
        <Star cx={8.5 * CELL} cy={1.5 * CELL} /> {/* Yellow Start */}
        <Star cx={13.5 * CELL} cy={8.5 * CELL} /> {/* Blue Start */}
        <Star cx={6.5 * CELL} cy={13.5 * CELL} /> {/* Red Start */}
        <Star cx={6.5 * CELL} cy={2.5 * CELL} /> {/* Top Arm */}
        <Star cx={12.5 * CELL} cy={6.5 * CELL} /> {/* Right Arm */}
        <Star cx={8.5 * CELL} cy={12.5 * CELL} /> {/* Bottom Arm */}
        <Star cx={2.5 * CELL} cy={8.5 * CELL} /> {/* Left Arm */}
      </Svg>

      {/* --- PAWNS OVERLAY --- */}
      {pawns.map((pawn, index) => {
        const coords = getPawnCoords(pawn.color, pawn.position, index % 4);
        const safeX = coords && coords.x ? coords.x * scale : 0;
        const safeY = coords && coords.y ? coords.y * scale : 0;

        return (
          <Pawn
            key={pawn.id}
            targetX={safeX}
            targetY={safeY}
            color={pawn.color}
            highlight={movablePawns.includes(pawn.id)}
            onPress={() => movePawn(pawn.id)}
          />
        );
      })}
    </View>
  );
}
