
import { View, StyleSheet, TouchableOpacity, Text, Switch } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CASA_CENTER, USER_POSITION, AVAILABLE_TAXIS } from "../data/taxiData";
import { casaLocations } from "../data/casaLocations";

export default function Home() {
  const [isNightMode, setIsNightMode] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView style={styles.map} initialRegion={CASA_CENTER}>
        {/* User Position - Blue Marker */}
        <Marker
          coordinate={USER_POSITION}
          pinColor="blue"
          title="Your Position"
          description="You are here"
        />

        {/* All Locations - Green Markers with Taxi Icons */}
        {casaLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={location.coordinates}
            title={location.name}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() => {
              console.log("Location selected:", location.name);
            }}
          >
            <View style={styles.locationMarkerContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={40}
                color="#22C55E"
              />
            </View>
          </Marker>
        ))}

        {/* Available Taxis - Red Taxi Icons */}
        {AVAILABLE_TAXIS.map((taxi) => (
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
        ))}
      </MapView>

      {/* Top Right: Night/Day Mode Switch */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>
          {isNightMode ? " Night" : " Day"}
        </Text>
        <Switch
          value={isNightMode}
          onValueChange={setIsNightMode}
          trackColor={{ false: "#FFD700", true: "#666" }}
          thumbColor={isNightMode ? "#1a1a1a" : "#fff"}
        />
      </View>

      {/* Bottom: Book Ride Button */}
      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.buttonText}>Book Ride Now</Text>
      </TouchableOpacity>
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
  switchContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  switchLabel: {
    fontWeight: "bold",
    fontSize: 14,
  },
  bookButton: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "#DC143C",
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
