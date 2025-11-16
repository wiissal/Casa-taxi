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

//  DRIVER DATA 
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

//  BASE COMPONENT 
export default function Ride() {
  const router = useRouter();
  const activeRide = useTaxiStore((state) => state.activeRide);
  const endRide = useTaxiStore((state) => state.endRide);

  //  STATE 
  const [elapsed, setElapsed] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [driver, setDriver] = useState(null);
  const [progress, setProgress] = useState(0);
  const [realTimePrice, setRealTimePrice] = useState(activeRide?.price || 0);
  const [taxiLat, setTaxiLat] = useState(activeRide?.departure.coordinates.latitude);
  const [taxiLon, setTaxiLon] = useState(activeRide?.departure.coordinates.longitude);
  const [rideCompleted, setRideCompleted] = useState(false);

  // REANIMATED SHARED VALUE 
  const taxiProgress = useSharedValue(0);

  //   GET RANDOM DRIVER 
  useEffect(() => {
    if (!activeRide) {
      router.back();
      return;
    }
    setDriver(DRIVERS[Math.floor(Math.random() * DRIVERS.length)]);
  }, []);

  //  START TAXI ANIMATION 
  useEffect(() => {
    if (activeRide) {
      taxiProgress.value = withTiming(1, {
        duration: (activeRide?.time || 30) * 1000 / 2, // 2x faster
        easing: Easing.linear,
      });
    }
  }, [activeRide]);

  //  REANIMATED ANIMATION 
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

  //  TIMER USEEFFECT 
  useEffect(() => {
    if (rideCompleted) return;

    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [rideCompleted]);

  //  PROGRESSand  PRICE USEEFFECT 
  useEffect(() => {
    if (activeRide) {
      const progressPercent = Math.min(
        (elapsed / (activeRide.time * 60)) * 100,
        100
      );
      setProgress(progressPercent);

      if (progressPercent >= 100 && !rideCompleted) {
        setRideCompleted(true);
        return;
      }

      const distanceCovered = (progressPercent / 100) * activeRide.distance;
      const pricePerKm = activeRide.isNightMode ? 2.0 : 1.5;
      const calculatedPrice = 7.5 + distanceCovered * pricePerKm;
      setRealTimePrice(Math.round(calculatedPrice * 100) / 100);
    }
  }, [elapsed]);

  //  HELPER FUNCTIONS 
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // HANDLERS 
  const handleCallDriver = () => {
    if (driver?.phone) {
      Linking.openURL(`tel:${driver.phone}`);
    }
  };

  const handleEndRide = () => {
    Alert.alert(
      "End Ride?",
      "Are you sure you want to end this ride?",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "End Ride",
          onPress: () => {
            endRide();
            router.back();
          },
        },
      ]
    );
  };

  //  LOADING STATE 
  if (!activeRide || !driver) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const remainingTime = Math.max(0, activeRide.time * 60 - elapsed);

  return (
    <View style={styles.container}>
      {/* MAP WITH MARKERS  */}
      <MapView
        style={styles.map}
        region={{
          latitude:
            (activeRide.departure.coordinates.latitude +
              activeRide.destination.coordinates.latitude) /
            2,
          longitude:
            (activeRide.departure.coordinates.longitude +
              activeRide.destination.coordinates.longitude) /
            2,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Pickup Marker */}
        <Marker
          coordinate={activeRide.departure.coordinates}
          pinColor="green"
          title="Pickup"
        />

        {/* Destination Marker */}
        <Marker
          coordinate={activeRide.destination.coordinates}
          pinColor="red"
          title="Destination"
        />

        {/* Route Polyline */}
        <Polyline
          coordinates={[
            activeRide.departure.coordinates,
            activeRide.destination.coordinates,
          ]}
          strokeColor="#FFD700"
          strokeWidth={3}
        />

        {/* ANIMATED TAXI IMAGE MARKER  */}
        <Marker
          coordinate={{
            latitude: taxiLat,
            longitude: taxiLon,
          }}
          title="Your Taxi"
          image={require("../assets/taximap.png")}
        />
      </MapView>

      {/*  TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.timerBox}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={18}
              color="#FFD700"
            />
            <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
          </View>
        </View>

        <View style={styles.topBarRight}>
          <Text style={styles.priceLabel}>Current Price</Text>
          <Text style={styles.priceValue}>{realTimePrice} DH</Text>
        </View>
      </View>

      {/* BOTTOM PREVIEW CARD */}
      <TouchableOpacity
        style={styles.previewCard}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.previewLeft}>
          <Text style={styles.avatarLarge}>{driver.avatar}</Text>
          <View style={styles.previewInfo}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{driver.rating}</Text>
            </View>
          </View>
        </View>

        <View style={styles.previewRight}>
          <Text style={styles.tapText}>Tap for details</Text>
          <MaterialCommunityIcons name="chevron-up" size={24} color="#FFD700" />
        </View>
      </TouchableOpacity>

      {/*  MODAL */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowModal(false)}
          />

          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* DRIVER CARD */}
              <View style={styles.driverCard}>
                <Text style={styles.avatarXL}>{driver.avatar}</Text>
                <Text style={styles.driverNameLarge}>{driver.name}</Text>

                <View style={styles.ratingLarge}>
                  <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
                  <Text style={styles.ratingNumberLarge}>{driver.rating}</Text>
                  <Text style={styles.reviewsText}>({driver.reviews} reviews)</Text>
                </View>

                <View style={styles.carDetails}>
                  <MaterialCommunityIcons name="car" size={20} color="#FFD700" />
                  <View>
                    <Text style={styles.carModel}>{driver.car}</Text>
                    <Text style={styles.platNumber}>Plate: {driver.plate}</Text>
                  </View>
                </View>
              </View>

              {/*  TRIP PROGRESS  */}
              <View style={styles.tripCard}>
                <Text style={styles.sectionTitle}>Trip Progress</Text>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(progress)}% completed
                </Text>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Distance Covered</Text>
                    <Text style={styles.statValue}>
                      {Math.round((progress / 100) * activeRide.distance * 10) / 10} km
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Remaining</Text>
                    <Text style={styles.statValue}>
                      {Math.round((1 - progress / 100) * activeRide.distance * 10) / 10} km
                    </Text>
                  </View>
                </View>

                <View style={styles.timeRow}>
                  <MaterialCommunityIcons name="clock" size={20} color="#FFD700" />
                  <Text style={styles.timeLabel}>Est. Arrival: {formatTime(remainingTime)}</Text>
                </View>
              </View>

              {/*  TRIP DETAILS */}
              <View style={styles.tripCard}>
                <Text style={styles.sectionTitle}>Trip Details</Text>

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="map-marker-check" size={20} color="#FFD700" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Pickup</Text>
                    <Text style={styles.detailValue}>{activeRide.departure.name}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="map-marker-radius" size={20} color="#DC143C" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Destination</Text>
                    <Text style={styles.detailValue}>{activeRide.destination.name}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="ruler" size={20} color="#FFD700" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Total Distance</Text>
                    <Text style={styles.detailValue}>{activeRide.distance} km</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="currency-usd" size={20} color="#FFD700" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Estimated Total</Text>
                    <Text style={styles.detailValue}>{activeRide.price} DH</Text>
                  </View>
                </View>
              </View>

              {/* ACTION BUTTONS */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCallDriver}>
                  <MaterialCommunityIcons name="phone" size={20} color="#FFD700" />
                  <Text style={styles.actionButtonText}>Call Driver</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <MaterialCommunityIcons name="message" size={20} color="#FFD700" />
                  <Text style={styles.actionButtonText}>Message</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <MaterialCommunityIcons name="share-variant" size={20} color="#FFD700" />
                  <Text style={styles.actionButtonText}>Share </Text>
                </TouchableOpacity>
              </View>

              {/*  END RIDE BUTTON  */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleEndRide}
              >
                <MaterialCommunityIcons name="close-circle" size={20} color="#fff" />
                <Text style={styles.cancelButtonText}>End Ride</Text>
              </TouchableOpacity>

              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/*COMPLETION BANNER  */}
      {rideCompleted && (
        <View style={styles.completedBanner}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#FFD700" />
          <Text style={styles.completedText}>Arrived at Destination!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  
  map: {
    flex: 1,
  },
  
  topBar: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timerBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FFFEF0",
    borderRadius: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  topBarRight: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginTop: 2,
  },
  
  previewCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  previewLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatarLarge: {
    fontSize: 40,
  },
  previewInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFD700",
  },
  previewRight: {
    alignItems: "center",
    gap: 4,
  },
  tapText: {
    fontSize: 10,
    color: "#999",
    fontStyle: "italic",
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    maxHeight: "80%",
  },
  modalHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#FFD700",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  driverCard: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 20,
  },
  avatarXL: {
    fontSize: 80,
    marginBottom: 15,
  },
  driverNameLarge: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  ratingLarge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },
  ratingNumberLarge: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFD700",
  },
  reviewsText: {
    fontSize: 12,
    color: "#999",
  },
  carDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
  },
  carModel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  platNumber: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  
  tripCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700",
  },
  progressText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },
 
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 10,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  
  actionsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f9f9f9",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  cancelButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#DC143C",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  
  completedBanner: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  completedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFD700",
  },
});