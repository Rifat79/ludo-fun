import { useGameStore } from "@/store/gameStore";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

const DOT_MAP: { [key: number]: boolean[] } = {
  1: [false, false, false, false, true, false, false, false, false],
  2: [true, false, false, false, false, false, false, false, true],
  3: [true, false, false, false, true, false, false, false, true],
  4: [true, false, true, false, false, false, true, false, true],
  5: [true, false, true, false, true, false, true, false, true],
  6: [true, false, true, true, false, true, true, false, true],
};

interface DiceProps {
  color: string;
  isActive: boolean;
}

export default function Dice({ color, isActive }: DiceProps) {
  const dice = useGameStore((s) => s.dice);
  const rollDice = useGameStore((s) => s.rollDice);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: false, // Fixed warning
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false, // Fixed warning
          }),
        ]),
      ).start();
    } else {
      scaleAnim.stopAnimation();
      scaleAnim.setValue(1);
    }
  }, [isActive, scaleAnim]);

  const activeDots = DOT_MAP[dice] || DOT_MAP[1];
  const dotColor = isActive ? "#1a1a1a" : "#a0a0a0";
  const glowColor = isActive ? color : "transparent";

  return (
    <Pressable
      onPress={isActive ? rollDice : undefined}
      disabled={!isActive}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.shadowContainer,
          {
            transform: [{ scale: scaleAnim }],
            shadowColor: glowColor,
            shadowOpacity: isActive ? 0.8 : 0.3,
            shadowRadius: isActive ? 12 : 5,
            elevation: isActive ? 15 : 5,
          },
        ]}
      >
        <LinearGradient
          colors={["#ffffff", "#e6e6e6"]}
          style={styles.diceContainer}
        >
          <View style={styles.dotsGrid}>
            {activeDots.map((isVisible, index) => (
              <View
                key={index}
                style={[styles.dotWrapper, { opacity: isVisible ? 1 : 0 }]}
              >
                <LinearGradient
                  colors={[dotColor, "#000000"]}
                  style={styles.dot}
                />
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  diceContainer: {
    width: 55,
    height: 55,
    borderRadius: 14,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  dotsGrid: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  dotWrapper: {
    width: 10,
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  dot: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
  },
});
