import { Pressable, Text } from "react-native";

import { useGameStore } from "@/store/gameStore";

export default function Dice() {
  const dice = useGameStore((s) => s.dice);
  const rollDice = useGameStore((s) => s.rollDice);

  return (
    <Pressable
      onPress={rollDice}
      style={{
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: "white",
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "700",
        }}
      >
        {dice}
      </Text>
    </Pressable>
  );
}
