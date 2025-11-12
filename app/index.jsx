import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const taxiPosition = useRef(new Animated.Value(300)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  return (
    <ImageBackground
      source={require("../assets/best-bg.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text>Loading...</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
});