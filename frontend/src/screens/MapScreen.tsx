import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";

interface PetLocation {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  photos: string[];
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [petLocations, setPetLocations] = useState<PetLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
    fetchPetLocations();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to show nearby pets."
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      Alert.alert("Location Error", "Could not get current location.");
    }
  };

  const fetchPetLocations = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:8000/api/v1/alerts/near?lon=-122.4194&lat=37.7749&radius_m=5000');
      // const data = await response.json();

      // Mock data for now
      const mockData: PetLocation[] = [
        {
          id: "1",
          title: "Missing Dog: Buddy",
          description: "Friendly Siberian Husky",
          latitude: 37.7749,
          longitude: -122.4194,
          photos: ["https://via.placeholder.com/100x100"],
        },
        {
          id: "2",
          title: "Missing Cat: Whiskers",
          description: "Orange tabby cat",
          latitude: 37.7849,
          longitude: -122.4094,
          photos: ["https://via.placeholder.com/100x100"],
        },
      ];

      setPetLocations(mockData);
    } catch (error) {
      Alert.alert("Error", "Failed to load pet locations");
      console.error("Error fetching pet locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const centerOnUserLocation = () => {
    if (location) {
      // This would center the map on user location
      // Implementation depends on map ref
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Missing Pets Map</Text>
        <Text style={styles.headerSubtitle}>See missing pets near you</Text>
      </View>

      <ScrollView style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapTitle}>🗺️ Map View</Text>
          <Text style={styles.mapSubtitle}>
            Interactive map will show here with missing pet locations
          </Text>

          {location && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>Your Location:</Text>
              <Text style={styles.locationText}>
                {location.coords.latitude.toFixed(4)},{" "}
                {location.coords.longitude.toFixed(4)}
              </Text>
            </View>
          )}

          <View style={styles.petsList}>
            <Text style={styles.petsTitle}>Missing Pets Nearby:</Text>
            {petLocations.map((pet) => (
              <View key={pet.id} style={styles.petCard}>
                <Text style={styles.petTitle}>{pet.title}</Text>
                <Text style={styles.petDescription}>{pet.description}</Text>
                <Text style={styles.petLocation}>
                  📍 {pet.latitude.toFixed(4)}, {pet.longitude.toFixed(4)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.centerButton}
        onPress={centerOnUserLocation}
      >
        <Text style={styles.centerButtonText}>Refresh Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#3B82F6",
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  mapSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  locationInfo: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#6b7280",
  },
  petsList: {
    width: "100%",
  },
  petsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  petCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  petTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  petDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  petLocation: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    fontSize: 18,
    color: "#6b7280",
  },
  centerButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  centerButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
