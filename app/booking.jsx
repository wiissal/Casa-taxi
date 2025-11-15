import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import MapView, { Marker, Polyline } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTaxiStore } from "../store/useTaxiStore";
import {
  calculateDistance,
  calculatePrice,
  calculateTime,
  getDayNightMode,
  getModeString,
} from "../utils/calculations";

// Taxi images array
const TAXI_IMAGES = [
  require("../assets/red-taxi.png"),
  require("../assets/taximap.png"),
  require("../taxithree.png"),
];

export default function Booking() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const startRide = useTaxiStore((state) => state.startRide);

  const [departure, setDeparture] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [dayPrice, setDayPrice] = useState(0);
  const [nightPrice, setNightPrice] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get current mode (automatic)
  const isNightMode = getDayNightMode();
}