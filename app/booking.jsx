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
  // Parse locations from params (only once on mount)
  useEffect(() => {
    if (params?.departure && params?.destination) {
      try {
        setDeparture(JSON.parse(params.departure));
        setDestination(JSON.parse(params.destination));
      } catch (error) {
        console.log("Error parsing params:", error);
      }
    }
  }, []);

  // Calculate distances and prices (only when departure/destination change)
  useEffect(() => {
    if (departure && destination) {
      const dist = calculateDistance(
        departure.coordinates,
        destination.coordinates
      );
      const dayPriceCalc = calculatePrice(dist, false);
      const nightPriceCalc = calculatePrice(dist, true);
      const timeCalc = calculateTime(dist);

      setDistance(dist);
      setDayPrice(dayPriceCalc);
      setNightPrice(nightPriceCalc);
      setTime(timeCalc);
    }
  }, [departure, destination]);
  //handler functions
  const handleConfirmBooking = () => {
    if (!departure || !destination) {
      Alert.alert("Error", "Locations Not Found");
      return;
    }
    const selectedPrice = isNightMode ? nightPrice : dayPrice;
    const rideData = {
      departure,
      destination,
      distance,
      price: selectedPrice,
      time,
      isNightMode: isNightMode,
      timestamp: new Data().toISOString(),
    };
    startRide(rideData);
    router.push("/ride");
  };
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? TAXI_IMAGES.length - 1 : prev - 1
    );
  };
  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === TAXI_IMAGES.length - 1 ? 0 : prev + 1
    );
  };
//loading state
// Loading state
  if (!departure || !destination) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Request to Book</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  const currentPrice = isNightMode ? nightPrice : dayPrice;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Request to Book</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Taxi Image Container */}
        <View style={styles.taxiImageSection}>
          <View style={styles.taxiImageBg}>
            <Image
              source={TAXI_IMAGES[currentImageIndex]}
              style={styles.taxiImage}
            />
          </View>
          {/* Navigation Arrows */}
          <View style={styles.arrowContainer}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={handlePrevImage}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={20}
                color="#FFD700"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={handleNextImage}
            >
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#FFD700"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={20}
              color="#FFD700"
            />
            <Text style={styles.cardTitle}>Trip Details</Text>
          </View>

          <View style={styles.tripRow}>
            <View>
              <Text style={styles.tripLabel}>Pickup</Text>
              <Text style={styles.tripValue}>{departure.name}</Text>
            </View>
          </View>

          <View style={styles.tripRow}>
            <View>
              <Text style={styles.tripLabel}>Dropoff</Text>
              <Text style={styles.tripValue}>{destination.name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.tripRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tripLabel}>Distance</Text>
              <Text style={styles.tripValue}>{distance} km</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tripLabel}>Time</Text>
              <Text style={styles.tripValue}>{time} min</Text>
            </View>
          </View>
        </View>
        {/* Payment Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="credit-card"
              size={20}
              color="#FFD700"
            />
            <Text style={styles.cardTitle}>Payment Details</Text>
          </View>

          {/* Current Mode Badge */}
          <View style={styles.modeBadge}>
            <MaterialCommunityIcons
              name={isNightMode ? "moon-waning-crescent" : "weather-sunny"}
              size={18}
              color="#FFD700"
            />
            <Text style={styles.modeBadgeText}>{getModeString()}</Text>
          </View>

          {/* Day Rate */}
          <View style={styles.rateRow}>
            <View>
              <Text style={styles.rateLabel}>☀️ Day Rate (6 AM - 6 PM)</Text>
              <Text style={styles.rateDetail}>1.50 DH/km + 7.50 DH base</Text>
            </View>
            <Text style={styles.rateAmount}>{dayPrice} DH</Text>
          </View>

          {/* Night Rate */}
          <View style={styles.rateRow}>
            <View>
              <Text style={styles.rateLabel}>🌙 Night Rate (6 PM - 6 AM)</Text>
              <Text style={styles.rateDetail}>2.00 DH/km + 7.50 DH base</Text>
            </View>
            <Text style={styles.rateAmount}>{nightPrice} DH</Text>
          </View>

          <View style={styles.divider} />

          {/* Total Amount */}
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalPrice}>{currentPrice} DH</Text>
          </View>

          {/* Info Message */}
          <View style={styles.infoBox}>
            <MaterialCommunityIcons
              name="information"
              size={16}
              color="#FFD700"
            />
            <Text style={styles.infoText}>
              Price calculated based on current time
            </Text>
          </View>
        </View>

        {/* Map Preview */}
        <View style={styles.mapPreviewContainer}>
          <Text style={styles.mapPreviewTitle}>Route Map</Text>
          <View style={styles.mapPreview}>
            <MapView
              style={styles.mapPreviewMap}
              region={{
                latitude:
                  (departure.coordinates.latitude +
                    destination.coordinates.latitude) /
                  2,
                longitude:
                  (departure.coordinates.longitude +
                    destination.coordinates.longitude) /
                  2,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              {/* Departure marker */}
              <Marker
                coordinate={departure.coordinates}
                pinColor="green"
                title={departure.name}
              />

              {/* Destination marker */}
              <Marker
                coordinate={destination.coordinates}
                pinColor="red"
                title={destination.name}
              />

              {/* Route line */}
              <Polyline
                coordinates={[
                  departure.coordinates,
                  destination.coordinates,
                ]}
                strokeColor="#FFD700"
                strokeWidth={3}
              />
            </MapView>
          </View>
        </View>
      </ScrollView>
      {/* Book Now Button */}
      <TouchableOpacity
        style={styles.bookNowButton}
        onPress={handleConfirmBooking}
      >
        <Text style={styles.bookNowButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Taxi Image Section
  taxiImageSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  taxiImageBg: {
    width: 280,
    height: 200,
    backgroundColor: "#FFE8B6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700",
    marginBottom: 15,
  },
  taxiImage: {
    width: 220,
    height: 150,
    resizeMode: "contain",
  },
  arrowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  // Cards
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  tripRow: {
    paddingVertical: 10,
  },
  tripLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 4,
  },
  tripValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFEF0",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
    marginBottom: 12,
  },
  modeBadgeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  rateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginVertical: 6,
  },
  rateLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  rateDetail: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  rateAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#DC143C",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    flex: 1,
  },
  // Map Preview
  mapPreviewContainer: {
    marginVertical: 20,
  },
  mapPreviewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  mapPreview: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  mapPreviewMap: {
    flex: 1,
  },
  // Book Now Button
  bookNowButton: {
    backgroundColor: "#FFD700",
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  bookNowButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

