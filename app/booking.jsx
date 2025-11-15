import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
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

  // Get current mode (automatic - not user selectable)
  const isNightMode = getDayNightMode();

  // Parse locations from params
  useEffect(() => {
    if (params?.departure) {
      setDeparture(JSON.parse(params.departure));
    }
    if (params?.destination) {
      setDestination(JSON.parse(params.destination));
    }
  }, [params]);

  // Calculate distances and prices
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

  const handleConfirmBooking = () => {
    if (!departure || !destination) {
      Alert.alert("Error", "Locations not found!");
      return;
    }

    // Use price based on current time
    const selectedPrice = isNightMode ? nightPrice : dayPrice;

    const rideData = {
      departure,
      destination,
      distance,
      price: selectedPrice,
      time,
      isNightMode: isNightMode,
      timestamp: new Date().toISOString(),
    };

    startRide(rideData);
    router.push("/ride");
  };

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
        {/* Map showing route */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
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
            {/* Departure marker - Green */}
            <Marker
              coordinate={departure.coordinates}
              pinColor="green"
              title={departure.name}
            />

            {/* Destination marker - Red */}
            <Marker
              coordinate={destination.coordinates}
              pinColor="red"
              title={destination.name}
            />

            {/* Route line - Golden */}
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

        {/* Trip Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color="#FFD700"
            />
            <Text style={styles.cardTitle}>Trip Details</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍 Pickup</Text>
            <Text style={styles.detailValue}>{departure.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🎯 Dropoff</Text>
            <Text style={styles.detailValue}>{destination.name}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📏 Distance</Text>
            <Text style={styles.detailValue}>{distance} km</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>⏱️ Estimated Time</Text>
            <Text style={styles.detailValue}>{time} min</Text>
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

          {/* Current Mode Display */}
          <View style={styles.modeDisplay}>
            <MaterialCommunityIcons
              name={isNightMode ? "moon" : "weather-sunny"}
              size={20}
              color="#FFD700"
            />
            <Text style={styles.modeText}>{getModeString()}</Text>
          </View>

          {/* Day Rate Info */}
          <View style={styles.rateInfo}>
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>☀️ Day Rate (6 AM - 6 PM)</Text>
              <Text style={styles.ratePrice}>{dayPrice} DH</Text>
            </View>
          </View>

          {/* Night Rate Info */}
          <View style={styles.rateInfo}>
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>🌙 Night Rate (6 PM - 6 AM)</Text>
              <Text style={styles.ratePrice}>{nightPrice} DH</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Total Amount */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalPrice}>{currentPrice} DH</Text>
          </View>

          {/* Mode Info */}
          <View style={styles.modeInfo}>
            <MaterialCommunityIcons
              name="information"
              size={16}
              color="#FFD700"
            />
            <Text style={styles.modeInfoText}>
              Price automatically calculated based on current time
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleConfirmBooking}
      >
        <MaterialCommunityIcons name="check-circle" size={20} color="#000" />
        <Text style={styles.bookButtonText}>Book Now</Text>
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
  mapContainer: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 15,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  map: {
    flex: 1,
  },
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
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  modeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFEF0",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
    marginBottom: 12,
  },
  modeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  rateInfo: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginVertical: 6,
  },
  rateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rateLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  ratePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#DC143C",
  },
  totalRow: {
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
  },
  modeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  modeInfoText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    flex: 1,
  },
  bookButton: {
    flexDirection: "row",
    backgroundColor: "#FFD700",
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  bookButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});