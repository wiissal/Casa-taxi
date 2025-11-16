import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Share,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTaxiStore } from "../store/useTaxiStore";

export default function RideSummary() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [rideData, setRideData] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Animation for checkmark
  const checkmarkScale = useSharedValue(0);
  const checkmarkRotate = useSharedValue(0);

  // Animate checkmark on mount
  useEffect(() => {
    checkmarkScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.back(1.2)),
    });
    checkmarkRotate.value = withTiming(360, {
      duration: 600,
      easing: Easing.out(Easing.quad),
    });
  }, []);

  // Get ride data from params or store
  useEffect(() => {
    if (params?.rideData && !rideData) {
      try {
        setRideData(JSON.parse(params.rideData));
      } catch (error) {
        console.log("Error parsing ride data:", error);
      }
    }
  }, []);

  const checkmarkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: checkmarkScale.value },
        { rotateZ: `${checkmarkRotate.value}deg` },
      ],
    };
  });

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Handle share receipt
  const handleShareReceipt = async () => {
    try {
      const message = `MOVE Receipt\n\nPickup: ${rideData?.departure?.name}\nDestination: ${rideData?.destination?.name}\nDistance: ${rideData?.distance}km\nTime: ${formatTime(rideData?.duration || 0)}\nTotal: ${rideData?.totalPrice}DH\n\nThank you for using CASATAXI!`;
      
      await Share.share({
        message: message,
        title: "Ride Receipt",
      });
    } catch (error) {
      Alert.alert("Error", "Could not share receipt");
    }
  };

  // Handle book again
  const handleBookAgain = () => {
    router.push("/");
  };

  // Handle done
  const handleDone = () => {
    router.push("/");
  };

  // Handle submit rating
  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert("Rating Required", "Please select a rating to continue");
      return;
    }
    Alert.alert("Thank You", `You rated this ride ${rating}⭐`);
    handleDone();
  };

  if (!rideData) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="loading" size={50} color="#FFD700" />
          <Text style={styles.loadingText}>Loading ride summary...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/*  SUCCESS HEADER  */}
        <View style={styles.successHeader}>
          <Animated.View style={[styles.checkmarkCircle, checkmarkAnimatedStyle]}>
            <MaterialCommunityIcons name="check" size={60} color="#fff" />
          </Animated.View>
          <Text style={styles.successTitle}>Ride Completed!</Text>
          <Text style={styles.successSubtitle}>Thank you for riding with MOVE</Text>
        </View>

        {/*  TRIP SUMMARY CARD  */}
        <View style={styles.summaryCard}>
          <View style={styles.routeContainer}>
            {/* Pickup */}
            <View style={styles.locationRow}>
              <View style={styles.locationDot}>
                <MaterialCommunityIcons name="map-marker" size={24} color="#4CAF50" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Pickup</Text>
                <Text style={styles.locationName}>{rideData.departure?.name}</Text>
              </View>
            </View>

            {/* Route Line */}
            <View style={styles.routeLine} />

            {/* Destination */}
            <View style={styles.locationRow}>
              <View style={styles.locationDot}>
                <MaterialCommunityIcons name="map-marker" size={24} color="#DC143C" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Destination</Text>
                <Text style={styles.locationName}>{rideData.destination?.name}</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Trip Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="ruler" size={20} color="#FFD700" />
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>{rideData.distance} km</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#FFD700" />
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Duration</Text>
                <Text style={styles.statValue}>{formatTime(rideData.duration || 0)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/*  DRIVER INFO  */}
        <View style={styles.driverCard}>
          <Text style={styles.cardTitle}>Driver Info</Text>
          <View style={styles.driverContent}>
            <Text style={styles.driverAvatar}>{rideData.driverAvatar || "👨‍🚗"}</Text>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{rideData.driverName || "Driver"}</Text>
              <View style={styles.driverRating}>
                <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingValue}>
                  {rideData.driverRating || 4.8} ({rideData.driverReviews || 245})
                </Text>
              </View>
            </View>
            <View style={styles.carBadge}>
              <MaterialCommunityIcons name="car" size={16} color="#FFD700" />
            </View>
          </View>
          <View style={styles.carInfo}>
            <Text style={styles.carModel}>{rideData.carModel || "Red Taxi"}</Text>
            <Text style={styles.carPlate}>Plate: {rideData.carPlate || "AB 12345"}</Text>
          </View>
        </View>

        {/*  COST BREAKDOWN  */}
        <View style={styles.costCard}>
          <Text style={styles.cardTitle}>Cost Breakdown</Text>

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Base Fare</Text>
            <Text style={styles.costValue}>7.50 DH</Text>
          </View>

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>
              Distance ({rideData.distance} km × {rideData.pricePerKm || 1.5} DH/km)
            </Text>
            <Text style={styles.costValue}>
              {(rideData.distance * (rideData.pricePerKm || 1.5)).toFixed(2)} DH
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{rideData.totalPrice || rideData.price} DH</Text>
          </View>

          <View style={styles.paymentMethod}>
            <MaterialCommunityIcons name="wallet" size={16} color="#FFD700" />
            <Text style={styles.paymentText}>Paid via Cash</Text>
          </View>
        </View>

        {/*  RATING SECTION  */}
        <View style={styles.ratingCard}>
          <Text style={styles.cardTitle}>Rate Your Ride</Text>
          <Text style={styles.ratingPrompt}>How was your experience?</Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                style={styles.starButton}
                onPress={() => setRating(star)}
              >
                <MaterialCommunityIcons
                  name={rating >= star ? "star" : "star-outline"}
                  size={40}
                  color={rating >= star ? "#FFD700" : "#ccc"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {rating > 0 && (
            <View style={styles.ratingDisplay}>
              <Text style={styles.ratingDisplayText}>
                You rated this ride {rating}⭐
              </Text>
            </View>
          )}
        </View>

        {/* ACTION BUTTONS  */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSubmitRating}
          >
            <MaterialCommunityIcons name="heart" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Submit Rating</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleShareReceipt}
          >
            <MaterialCommunityIcons name="share-variant" size={20} color="#FFD700" />
            <Text style={styles.secondaryButtonText}>Share Receipt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleBookAgain}
          >
            <MaterialCommunityIcons name="plus-circle" size={20} color="#FFD700" />
            <Text style={styles.secondaryButtonText}>Book Again</Text>
          </TouchableOpacity>
        </View>

        {/*  DONE BUTTON  */}
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#999",
    marginTop: 15,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  successHeader: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 10,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  
  summaryCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  routeContainer: {
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  locationDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
    marginBottom: 2,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: "#FFD700",
    marginLeft: 19,
    marginVertical: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statInfo: {
    flex: 1,
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
    marginTop: 2,
  },
 
  driverCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  driverContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  driverAvatar: {
    fontSize: 50,
    marginRight: 15,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  driverRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },
  carBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE8B6",
    justifyContent: "center",
    alignItems: "center",
  },
  carInfo: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  carModel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
  },
  carPlate: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  
  costCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  costLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  costValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  paymentText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
 
  ratingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  ratingPrompt: {
    fontSize: 13,
    color: "#999",
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 12,
  },
  starButton: {
    padding: 5,
  },
  ratingDisplay: {
    backgroundColor: "#FFFEF0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  ratingDisplayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFD700",
  },
  
  actionsContainer: {
    gap: 10,
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFD700",
  },
  
  doneButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
});