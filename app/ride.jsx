import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import MapView, { Marker, Polyline } from "react-native-maps";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTaxiStore } from "../store/useTaxiStore";

const DRIVERS = [
  {
    id: 1,
    name: "Ahmed Ben Ali",
    rating: 4.8,
    reviews: 245,
    avatar: "👨‍💼",
    phone: "+212 600 000 000",
    car: "Red Peugeot 407",
    plate: "AB 12345",
  },
  {
    id: 2,
    name: "Mohamed Hassan",
    rating: 4.9,
    reviews: 312,
    avatar: "👨‍🦱",
    phone: "+212 600 000 000",
    car: "Red Fiat Punto",
    plate: "CD 67890",
  },
  {
    id: 3,
    name: "Karim Younis",
    rating: 4.7,
    reviews: 189,
    avatar: "👨‍🎓",
    phone: "+212 600 000 000",
    car: "Red Renault Dacia",
    plate: "EF 34567",
  },
  {
    id: 4,
    name: "Hassan Mansouri",
    rating: 4.9,
    reviews: 401,
    avatar: "👨‍🔧",
    phone: "+212 600 000 000",
    car: "Red Dacia Logan",
    plate: "GH 78901",
  },
  {
    id: 5,
    name: "Rachid Salam",
    rating: 4.6,
    reviews: 267,
    avatar: "👨‍🏫",
    phone: "+212 600 000 000",
    car: "Red Hyundai i10",
    plate: "IJ 56789",
  },
  {
    id: 6,
    name: "Tariq Belkhir",
    rating: 4.8,
    reviews: 328,
    avatar: "👨‍💻",
    phone: "+212 600 000 000",
    car: "Red Citroën C1",
    plate: "KL 23456",
  },
];

export default function Ride() {
  const router = useRouter();
  const activeRide = useTaxiStore((state) => state.activeRide);
  const endRide = useTaxiStore((state) => state.endRide);
// state management 
  const [elapsed, setElapsed] = useState(0);
const [showModal, setShowModal] = useState(false);
const [driver, setDriver] = useState(null);
const [progress, setProgress] = useState(0);
const [realTimePrice, setRealTimePrice] = useState(activeRide?.price || 0);
const [taxiLat, setTaxiLat] = useState(activeRide?.departure.coordinates.latitude);
const [taxiLon, setTaxiLon] = useState(activeRide?.departure.coordinates.longitude);
const [rideCompleted, setRideCompleted] = useState(false);

const taxiProgress = useSharedValue(0);

  if (!activeRide || !driver) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Ride Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
 useEffect(() => {
    if (!activeRide) {
      router.back();
      return;
    }
    setDriver(DRIVERS[Math.floor(Math.random() * DRIVERS.length)]);
  }, []);

  // START TAXI ANIMATION 
  useEffect(() => {
    if (activeRide) {
      taxiProgress.value = withTiming(1, {
        duration: (activeRide?.time || 30) * 1000 / 2, // 2x faster
        easing: Easing.linear,
      });
    }
  }, [activeRide]);

  // COMMIT 3: REANIMATED ANIMATION 
  const animatedStyle = useAnimatedStyle(() => {
    if (!activeRide) return {};

    const lat =
      activeRide.departure.coordinates.latitude +
      taxiProgress.value *
        (activeRide.destination.coordinates.latitude -
          activeRide.departure.coordinates.latitude);

    const lon =
      activeRide.departure.coordinates.longitude +
      taxiProgress.value *
        (activeRide.destination.coordinates.longitude -
          activeRide.departure.coordinates.longitude);

    runOnJS(setTaxiLat)(lat);
    runOnJS(setTaxiLon)(lon);

    return {};
  });

  // ... rest of component
}
