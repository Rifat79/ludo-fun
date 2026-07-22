import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Circle,
  Defs,
  RadialGradient,
  Rect,
  Stop,
  Svg,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const startGame = (numPlayers: number) => {
    setShowModal(false);
    // Pass the number of players to the game screen via URL params
    router.push(`/game?players=${numPlayers}`);
  };

  return (
    <View style={styles.container}>
      {/* --- PREMIUM ANIMATED BACKGROUND --- */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg width='100%' height='100%'>
          <Defs>
            <RadialGradient id='bg' cx='50%' cy='30%' r='70%'>
              <Stop offset='0%' stopColor='#2a1f4d' />
              <Stop offset='50%' stopColor='#15102b' />
              <Stop offset='100%' stopColor='#0a0814' />
            </RadialGradient>
          </Defs>
          <Rect x='0' y='0' width='100%' height='100%' fill='url(#bg)' />

          <Circle
            cx={width * 0.2}
            cy={height * 0.2}
            r={80}
            fill='#EA4335'
            opacity='0.15'
          />
          <Circle
            cx={width * 0.8}
            cy={height * 0.3}
            r={100}
            fill='#34A853'
            opacity='0.15'
          />
          <Circle
            cx={width * 0.2}
            cy={height * 0.8}
            r={90}
            fill='#4285F4'
            opacity='0.15'
          />
          <Circle
            cx={width * 0.8}
            cy={height * 0.7}
            r={70}
            fill='#F1C40F'
            opacity='0.15'
          />
        </Svg>
      </View>

      {/* --- CONTENT --- */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoTitle}>LUDO</Text>
          <Text style={styles.logoSubtitle}>FUN</Text>
        </View>

        <View style={styles.menuContainer}>
          {/* Classic Mode - Now opens the modal */}
          <TouchableOpacity
            style={styles.buttonWrapper}
            activeOpacity={0.8}
            onPress={() => setShowModal(true)}
          >
            <LinearGradient
              colors={["#EA4335", "#b03020"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuButton}
            >
              <Text style={styles.buttonTitle}>Classic Mode</Text>
              <Text style={styles.buttonSubtitle}>Play with friends</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonWrapper}
            activeOpacity={0.8}
            onPress={() => router.push("/game?players=4&mode=team")}
          >
            <LinearGradient
              colors={["#34A853", "#206b2c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuButton}
            >
              <Text style={styles.buttonTitle}>Team Up</Text>
              <Text style={styles.buttonSubtitle}>2 v 2</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonWrapper}
            activeOpacity={0.8}
            onPress={() => alert("Computer Mode Coming Soon!")}
          >
            <LinearGradient
              colors={["#4285F4", "#2c5fb0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuButton}
            >
              <Text style={styles.buttonTitle}>vs Computer</Text>
              <Text style={styles.buttonSubtitle}>Play against AI</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>

      {/* --- PLAYER SELECT MODAL --- */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select Players</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => startGame(2)}
            >
              <Text style={styles.modalButtonText}>2 Players</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => startGame(3)}
            >
              <Text style={styles.modalButtonText}>3 Players</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => startGame(4)}
            >
              <Text style={styles.modalButtonText}>4 Players</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0814" },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    zIndex: 1,
  },
  logoContainer: { alignItems: "center", marginTop: 40 },
  logoTitle: {
    fontSize: 64,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 4,
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  logoSubtitle: {
    fontSize: 42,
    fontWeight: "800",
    color: "#F1C40F",
    letterSpacing: 8,
    marginTop: -10,
    textShadowColor: "rgba(241, 196, 15, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  menuContainer: { width: "100%", alignItems: "center", gap: 20 },
  buttonWrapper: {
    width: "80%",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  menuButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  buttonTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  buttonSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginTop: 4,
  },
  footerText: { color: "rgba(255,255,255,0.3)", fontSize: 12 },

  // Modal Styles
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
    padding: 25,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#2a2a4e",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  modalButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  cancelText: {
    color: "#EA4335",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
});
