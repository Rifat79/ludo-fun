import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

const colorMap: Record<string, string> = {
  red: "#EA4335",
  green: "#34A853",
  yellow: "#F1C40F",
  blue: "#4285F4",
};

const shadeColor = (color: string, percent: number) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
  R = Math.min(255, Math.floor((R * (100 + percent)) / 100));
  G = Math.min(255, Math.floor((G * (100 + percent)) / 100));
  B = Math.min(255, Math.floor((B * (100 + percent)) / 100));
  return `#${R.toString(16).padStart(2, "0")}${G.toString(16).padStart(2, "0")}${B.toString(16).padStart(2, "0")}`;
};

interface PawnProps {
  targetX: number;
  targetY: number;
  color: string;
  highlight?: boolean;
  onPress?: () => void;
}

export default function Pawn({
  targetX = 0,
  targetY = 0,
  color,
  highlight = false,
  onPress,
}: PawnProps) {
  // Safeguard against undefined/NaN values on initial render
  const safeX = targetX || 0;
  const safeY = targetY || 0;

  const translateX = useRef(new Animated.Value(safeX)).current;
  const translateY = useRef(new Animated.Value(safeY)).current;
  const bobAnim = useRef(new Animated.Value(0)).current;

  // Animate movement from square to square
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: safeX,
      friction: 5,
      tension: 40,
      useNativeDriver: false,
    }).start();
    Animated.spring(translateY, {
      toValue: safeY,
      friction: 5,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [safeX, safeY]);

  // Animate bobbing when it's movable
  useEffect(() => {
    if (highlight) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bobAnim, {
            toValue: -5,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(bobAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
          }),
        ]),
      ).start();
    } else {
      bobAnim.stopAnimation();
      bobAnim.setValue(0);
    }
  }, [highlight]);

  const hexColor = colorMap[color] || color;
  const darkColor = shadeColor(hexColor, -40);
  const lightColor = shadeColor(hexColor, 60);

  return (
    <Animated.View
      style={{
        position: "absolute",
        transform: [{ translateX }, { translateY }],
        zIndex: highlight ? 20 : 10,
      }}
    >
      <Pressable onPress={onPress} style={styles.hitbox}>
        <Animated.View style={{ transform: [{ translateY: bobAnim }] }}>
          <View style={styles.pawnContainer}>
            {highlight && (
              <View style={[styles.glow, { backgroundColor: hexColor }]} />
            )}
            <View style={styles.shadow} />
            <LinearGradient
              colors={[lightColor, darkColor]}
              style={styles.baseBottom}
            />
            <View
              style={[
                styles.baseTop,
                { backgroundColor: hexColor, borderColor: darkColor },
              ]}
            />
            <LinearGradient
              colors={[lightColor, darkColor]}
              style={styles.neck}
            />
            <LinearGradient colors={[lightColor, hexColor]} style={styles.head}>
              <View style={styles.shine} />
            </LinearGradient>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hitbox: {
    width: 30,
    height: 30,
    marginLeft: -15,
    marginTop: -15,
    justifyContent: "center",
    alignItems: "center",
  },
  pawnContainer: {
    width: 24,
    height: 28,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  glow: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0.4,
    bottom: 0,
    zIndex: -1,
  },
  shadow: {
    position: "absolute",
    bottom: 0,
    width: 18,
    height: 6,
    borderRadius: 9,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  baseBottom: {
    width: 18,
    height: 8,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
  },
  baseTop: {
    width: 16,
    height: 5,
    borderWidth: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginTop: -1,
  },
  neck: {
    width: 8,
    height: 8,
    marginTop: -1,
  },
  head: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: -2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  shine: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.7)",
    position: "absolute",
    top: 2,
    left: 2,
  },
});
