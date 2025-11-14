import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { casaLocations } from "../data/casaLocations";

export default function Booking() {
  const router = useRouter();
  const [departure, setDeparture] = useState(casaLocations[0].id);
  const [destination, setDestination] = useState(casaLocations[1].id);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" paddingTop={20} />
        </TouchableOpacity>
        <Text style={styles.title}>Book Your Taxi</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text>Booking screen placeholder</Text>
      </ScrollView>
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
    borderBottomWidth: 2,
    borderBottomColor: "#f0f0f0",
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    paddingTop: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
  },
});
