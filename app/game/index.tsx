import LudoBoard from "@/components/board/LudoBoard";
import Dice from "@/components/dice/Dice";
import { useGameStore } from "@/store/gameStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const params = useLocalSearchParams<{ players: string; mode: string }>();
  const initGame = useGameStore((s) => s.initGame);

  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);
  const message = useGameStore((s) => s.message);
  const isRolling = useGameStore((s) => s.isRolling);
  const isMoving = useGameStore((s) => s.isMoving);
  const winner = useGameStore((s) => s.winner);
  const resetGame = useGameStore((s) => s.resetGame);
  const activeColors = useGameStore((s) => s.activeColors);

  useEffect(() => {
    const numPlayers = parseInt(params.players || "4", 10);
    const mode = (params.mode === "team" ? "team" : "classic") as
      | "team"
      | "classic";
    initGame(numPlayers, mode);
  }, []);

  const allPlayers = [
    { id: 1, name: "Player 1", color: "red", corner: "BL" },
    { id: 2, name: "Player 2", color: "green", corner: "TL" },
    { id: 3, name: "Player 3", color: "yellow", corner: "TR" },
    { id: 4, name: "Player 4", color: "blue", corner: "BR" },
  ];

  const renderPlayer = (playerId: number) => {
    const player = allPlayers.find((p) => p.id === playerId);
    if (!player || !activeColors.includes(player.color as any)) return null;

    const isActive = currentPlayerIndex === activeColors.indexOf(player.color);
    const hexColor = colorMap[player.color];

    return (
      <View
        key={player.id}
        style={
          player.corner === "TR" || player.corner === "BR"
            ? styles.rowReverse
            : styles.row
        }
      >
        <View
          style={[
            styles.playerCard,
            {
              borderColor: isActive ? hexColor : "rgba(255,255,255,0.2)",
              backgroundColor: isActive
                ? `${hexColor}33`
                : "rgba(255,255,255,0.05)",
              shadowColor: isActive ? hexColor : "#000",
              shadowOpacity: isActive ? 0.9 : 0.3,
              shadowRadius: isActive ? 15 : 4,
              elevation: isActive ? 15 : 5,
              transform: [{ scale: isActive ? 1.05 : 1 }],
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
        <Dice color={hexColor} isActive={isActive && !isRolling && !isMoving} />
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
        <Text style={styles.messageText}>{message}</Text>

        <View style={styles.row}>
          {renderPlayer(2)}
          {renderPlayer(3)}
        </View>

        <View style={styles.boardWrapper}>
          <LudoBoard size={BOARD_SIZE} />
        </View>

        <View style={styles.row}>
          {renderPlayer(1)}
          {renderPlayer(4)}
        </View>
      </View>

      <Modal
        animationType='slide'
        transparent={true}
        visible={winner !== null}
        onRequestClose={resetGame}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalView,
              { borderColor: winner ? colorMap[winner] : "#fff" },
            ]}
          >
            <Text style={styles.trophyEmoji}>🏆</Text>
            <Text
              style={[
                styles.winnerText,
                { color: winner ? colorMap[winner] : "#fff" },
              ]}
            >
              {winner ? `${winner.toUpperCase()} WINS!` : ""}
            </Text>
            <TouchableOpacity
              style={[
                styles.playAgainButton,
                { backgroundColor: winner ? colorMap[winner] : "#fff" },
              ]}
              onPress={resetGame}
            >
              <Text style={styles.playAgainText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  boardWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
    borderWidth: 2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "80%",
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },
  trophyEmoji: { fontSize: 60, marginBottom: 10 },
  winnerText: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  playAgainButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  playAgainText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
