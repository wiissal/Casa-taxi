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
  useEffect(() => {
    Animated.sequence([
      // Taxi drives in from right
      Animated.timing(taxiPosition, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      // Text fades in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/best-bg.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* Content */}
        <View style={styles.content}>
          {/* App Name */}
          <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
            M O V E
          </Animated.Text>

          {/* Animated Title */}
          <Animated.Text style={[styles.title, { opacity: textOpacity }]}>
            Making Your{"\n"}Ride Enjoyable
          </Animated.Text>

          {/* Description */}
          <Animated.Text style={[styles.description, { opacity: textOpacity }]}>
            Expert drivers at work. we will pick you{"\n"}
            in less time from your exact location
          </Animated.Text>

          {/* Animated Taxi */}
          <Animated.Image
            source={require("../assets/red-taxi.png")}
            style={[styles.taxi, { transform: [{ translateX: taxiPosition }] }]}
          />
        </View>
        {/* Bottom Arrow Button */}
        <Animated.View style={[styles.arrowButton, { opacity: textOpacity }]}>
          <TouchableOpacity style={styles.arrowCircle}>
            <Ionicons name="arrow-forward" size={28} color="white" />
          </TouchableOpacity>
        </Animated.View>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  taxi: {
    width: 200,
    height: 150,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 30,
    fontWeight: "900",
    color: "white",
    letterSpacing: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  arrowButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  arrowCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 215, 0, 0.3)",
    borderWidth: 2,
    borderColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },
});
