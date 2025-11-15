import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Switch,
  Modal,
  ScrollView,
} from "react-native";
import { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CASA_CENTER, USER_POSITION, AVAILABLE_TAXIS } from "../data/taxiData";
import { casaLocations } from "../data/casaLocations";

export default function Home() {
  const [isNightMode, setIsNightMode] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const router = useRouter();

  // Memoize location markers to prevent re-rendering
  const locationMarkers = useMemo(
    () =>
      casaLocations.map((location) => (
        <Marker
          key={location.id}
          coordinate={location.coordinates}
          title={location.name}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.locationMarkerContainer}>
            <MaterialCommunityIcons
              name="map-marker"
              size={40}
              color="#3B82F6"
            />
          </View>
        </Marker>
      )),
    []
  );

  // Memoize taxi markers
  const taxiMarkers = useMemo(
    () =>
      AVAILABLE_TAXIS.map((taxi) => (
        <Marker
          key={taxi.id}
          coordinate={{
            latitude: taxi.latitude,
            longitude: taxi.longitude,
          }}
          title={taxi.name}
          description={taxi.id}
          anchor={{ x: 0.5, y: 0.5 }}
          image={require("../assets/taximap.png")}
        />
      )),
    []
  );

  const handleBooking = () => {
    if (selectedDeparture && selectedDestination) {
      router.push({
        pathname: "/booking",
        params: {
          departure: JSON.stringify(selectedDeparture),
          destination: JSON.stringify(selectedDestination),
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView style={styles.map} initialRegion={CASA_CENTER}>
        {/* User Position - Green Marker */}
        <Marker
          coordinate={USER_POSITION}
          pinColor="green"
          title="Your Position"
          description="You are here"
        />
        {locationMarkers}
        {taxiMarkers}
      </MapView>

      {/* Bottom: Book Ride Button */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => setShowBottomSheet(true)}
      >
        <Text style={styles.buttonText}> Book Ride Now</Text>
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={showBottomSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBottomSheet(false)}
      >
        <View style={styles.bottomSheetContainer}>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setShowBottomSheet(false)}
          />

          <View style={styles.bottomSheetContent}>
            <View style={styles.handleBar} />

            {/* Pickup & Dropoff Summary */}
            <View style={styles.rideInfo}>
              <View style={styles.infoRow}>
                <View style={styles.infoPart}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color="#FFD700"
                  />
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Pick up</Text>
                    <Text style={styles.infoValue}>
                      {selectedDeparture?.name || "Select departure"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoPart}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color="#DC143C"
                  />
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Drop off</Text>
                    <Text style={styles.infoValue}>
                      {selectedDestination?.name || "Select destination"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Location Selection */}
            <ScrollView
              style={styles.optionsScroll}
              showsVerticalScrollIndicator={false}
            >
              {!selectedDeparture ? (
                <View style={styles.selectionSection}>
                  <Text style={styles.filterLabel}>Choose Departure</Text>
                  <View style={styles.filterContainer}>
                    {casaLocations.map((location) => (
                      <TouchableOpacity
                        key={location.id}
                        style={styles.filterChip}
                        onPress={() => setSelectedDeparture(location)}
                      >
                        <Text style={styles.filterChipText}>
                          {location.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : !selectedDestination ? (
                <View style={styles.selectionSection}>
                  <Text style={styles.filterLabel}>Choose Destination</Text>
                  <View style={styles.filterContainer}>
                    {casaLocations.map((location) => (
                      <TouchableOpacity
                        key={location.id}
                        style={styles.filterChip}
                        onPress={() => setSelectedDestination(location)}
                      >
                        <Text style={styles.filterChipText}>
                          {location.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : null}
            </ScrollView>

            {/* Book Button */}
            {selectedDeparture && selectedDestination && (
              <TouchableOpacity
                style={styles.bookNowButton}
                onPress={() => {
                  handleBooking();
                  setShowBottomSheet(false);
                }}
              >
                <Text style={styles.bookNowText}>Book Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  locationMarkerContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  taxiMarkerContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomSheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    flex: 1,
  },
  bottomSheetContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: "60%",
  },
  handleBar: {
    width: 50,
    height: 5,
    backgroundColor: "#FFD700",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 15,
  },
  rideInfo: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoRow: {
    marginBottom: 12,
  },
  infoPart: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
    marginTop: 2,
  },
  optionsScroll: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selectionSection: {
    marginVertical: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  filterChipText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  bookNowButton: {
    backgroundColor: "#FFD700",
    marginHorizontal: 20,
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  bookNowText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  bookButton: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "#FFD700",
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
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
