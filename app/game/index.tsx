import { View } from "react-native";

import LudoBoard from "@/components/board/LudoBoard";
import Dice from "@/components/dice/Dice";

export default function GameScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <LudoBoard />

      <Dice />
    </View>
  );
}
