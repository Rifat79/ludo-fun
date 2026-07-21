import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "700",
        }}
      >
        Ludo Fun
      </Text>

      <Pressable
        onPress={() => router.push("/game")}
        style={{
          backgroundColor: "#2ecc71",
          paddingHorizontal: 30,
          paddingVertical: 12,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
          }}
        >
          Play
        </Text>
      </Pressable>
    </View>
  );
}
