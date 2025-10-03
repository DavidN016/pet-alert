import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PetAlert {
  id: string;
  title: string;
  description: string;
  photos: string[];
  location: string;
  contact_info: string;
  created_at: string;
  is_active: boolean;
}

export default function HomeScreen() {
  const [alerts, setAlerts] = useState<PetAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlerts = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:8000/api/v1/reports/missing');
      // const data = await response.json();

      // Mock data for now
      const mockData: PetAlert[] = [
        {
          id: "1",
          title: "Missing Dog: Buddy",
          description: "Friendly Siberian Husky with blue eyes",
          photos: ["https://via.placeholder.com/300x200"],
          location: "Golden Gate Park, San Francisco",
          contact_info: "Call 555-123-4567",
          created_at: "2025-01-15T10:30:00Z",
          is_active: true,
        },
        {
          id: "2",
          title: "Missing Cat: Whiskers",
          description: "Orange tabby cat with white paws",
          photos: ["https://via.placeholder.com/300x200"],
          location: "Mission District, San Francisco",
          contact_info: "Text 555-987-6543",
          created_at: "2025-01-15T14:20:00Z",
          is_active: true,
        },
      ];

      setAlerts(mockData);
    } catch (error) {
      Alert.alert("Error", "Failed to load missing pets");
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  const renderAlert = ({ item }: { item: PetAlert }) => (
    <TouchableOpacity style={styles.alertCard}>
      <Image source={{ uri: item.photos[0] }} style={styles.alertImage} />
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>{item.title}</Text>
        <Text style={styles.alertDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.alertLocation}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <Text style={styles.contactInfo}>{item.contact_info}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Missing Pets</Text>
        <Text style={styles.headerSubtitle}>
          Help reunite pets with their families
        </Text>
      </View>

      <FlatList
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  listContainer: {
    padding: 16,
  },
  alertCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  alertContent: {
    padding: 16,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  alertDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  alertLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
  },
});
