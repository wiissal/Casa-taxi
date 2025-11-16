import { View, StyleSheet, TouchableOpacity, Text, Modal, ScrollView, Alert, Linking} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import MapView, { Marker, Polyline } from "react-native-maps";
import Animated, {
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  Easing, //control the curve of the animation
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTaxiStore } from "../store/useTaxiStore";

const DRIVERS={
  id=1, 
}