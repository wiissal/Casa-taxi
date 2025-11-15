import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CASA_CENTER, USER_POSITION, AVAILABLE_TAXIS } from "../data/taxiData";
import { casaLocations } from "../data/casaLocations";

const MapComponent = React.memo(() => {
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

  return (
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
  );
});

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  locationMarkerContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapComponent;