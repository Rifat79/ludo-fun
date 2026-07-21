import LudoBoard from "@/components/board/LudoBoard";
import Dice from "@/components/dice/Dice";
import { useGameStore } from "@/store/gameStore";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Defs, RadialGradient, Rect, Stop, Svg } from "react-native-svg";

const { width, height } = Dimensions.get("window");
const BOARD_SIZE = Math.min(width, height) - 100;

const colorMap: Record<string, string> = {
  red: "#EA4335",
  green: "#34A853",
  yellow: "#F1C40F",
  blue: "#4285F4",
};

export default function GameScreen() {
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);
  const message = useGameStore((s) => s.message);
  const isRolling = useGameStore((s) => s.isRolling);

  // Inside app/game/index.tsx
  const players = [
    { id: 1, name: "Player 1", color: "red", align: "left" }, // Bottom-Left
    { id: 2, name: "Player 2", color: "green", align: "left" }, // Top-Left
    { id: 3, name: "Player 3", color: "yellow", align: "right" }, // Top-Right
    { id: 4, name: "Player 4", color: "blue", align: "right" }, // Bottom-Right
  ];

  // Make sure the render order in your JSX is:
  // Top Row: renderPlayer(2) & renderPlayer(3)
  // Bottom Row: renderPlayer(1) & renderPlayer(4)
  // Match player array to Ludo King corners
  const renderPlayer = (playerId: number) => {
    const player = players.find((p) => p.id === playerId)!;
    const isActive = currentPlayerIndex === playerId - 1;
    const hexColor = colorMap[player.color];

    return (
      <View style={player.align === "right" ? styles.rowReverse : styles.row}>
        <View
          style={[
            styles.playerCard,
            {
              borderColor: hexColor,
              backgroundColor: isActive
                ? `${hexColor}33`
                : "rgba(255,255,255,0.1)",
            },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: hexColor }]} />
          <Text
            style={[styles.playerText, { color: isActive ? "#fff" : "#aaa" }]}
          >
            {player.name}
          </Text>
        </View>
        <View style={styles.diceSpacing} />
        <Dice color={hexColor} isActive={isActive && !isRolling} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <Svg width='100%' height='100%'>
          <Defs>
            <RadialGradient id='spotlight' cx='50%' cy='50%' r='70%'>
              <Stop offset='0%' stopColor='#2a1f4d' />
              <Stop offset='50%' stopColor='#15102b' />
              <Stop offset='100%' stopColor='#0a0814' />
            </RadialGradient>
          </Defs>
          <Rect x='0' y='0' width='100%' height='100%' fill='url(#spotlight)' />
        </Svg>
      </View>

      <View style={styles.contentContainer}>
        {/* Top Message */}
        <Text style={styles.messageText}>{message}</Text>

        {/* Top Row: Player 2 & Player 3 */}
        <View style={styles.row}>
          {renderPlayer(2)}
          {renderPlayer(3)}
        </View>

        {/* Middle: The Board */}
        <View style={styles.boardWrapper}>
          <LudoBoard size={BOARD_SIZE} />
        </View>

        {/* Bottom Row: Player 1 & Player 4 */}
        <View style={styles.row}>
          {renderPlayer(1)}
          {renderPlayer(4)}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0814" },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 15,
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
  },
  rowReverse: { flexDirection: "row-reverse", alignItems: "center" },
  boardWrapper: { flex: 1, justifyContent: "center", alignItems: "center" },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 8,
  },
  playerText: { fontWeight: "bold", fontSize: 14 },
  diceSpacing: { width: 10 },
  messageText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "capitalize",
  },
});
