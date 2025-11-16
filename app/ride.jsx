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
  Easing, //control the curve of the animation
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





]
  
