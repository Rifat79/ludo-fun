import { Audio } from "expo-av";

const soundObjects = {
  dice: new Audio.Sound(),
  move: new Audio.Sound(),
  capture: new Audio.Sound(),
};

let isInitialized = false;

export const loadSounds = async () => {
  if (isInitialized) return;
  try {
    // Set audio mode to play even if phone is on silent
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true, // CRITICAL FOR iOS
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    // Load the sounds
    await soundObjects.dice.loadAsync(require("@/assets/sounds/dice.mp3"));
    await soundObjects.move.loadAsync(require("@/assets/sounds/move.mp3"));
    await soundObjects.capture.loadAsync(
      require("@/assets/sounds/capture.mp3"),
    );

    isInitialized = true;
    console.log("Sounds loaded successfully!");
  } catch (error) {
    console.warn(
      "Error loading sounds. Did you put the mp3 files in assets/sounds/?",
      error,
    );
  }
};

export const playSound = async (name: "dice" | "move" | "capture") => {
  if (!isInitialized) return; // Don't try to play if loading failed
  try {
    if (name === "dice") await soundObjects.dice.replayAsync();
    if (name === "move") await soundObjects.move.replayAsync();
    if (name === "capture") await soundObjects.capture.replayAsync();
  } catch (error) {
    // Ignore sound errors so the game never crashes
  }
};
