import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

interface PetReport {
  name: string;
  species: string;
  color: string;
  description: string;
  photo_url: string;
  last_seen_location: {
    lon: number;
    lat: number;
  };
  last_seen_date: string;
  contact_info: string;
}

export default function ReportScreen() {
  const [formData, setFormData] = useState<PetReport>({
    name: "",
    species: "",
    color: "",
    description: "",
    photo_url: "",
    last_seen_location: { lon: 0, lat: 0 },
    last_seen_date: new Date().toISOString(),
    contact_info: "",
  });
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: locationStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (cameraStatus !== "granted" || locationStatus !== "granted") {
      Alert.alert(
        "Permissions Required",
        "Camera and location permissions are needed to report a missing pet."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, photo_url: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, photo_url: result.assets[0].uri });
    }
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const location = await Location.getCurrentPositionAsync({});
      setFormData({
        ...formData,
        last_seen_location: {
          lon: location.coords.longitude,
          lat: location.coords.latitude,
        },
      });
      Alert.alert(
        "Location Set",
        "Current location has been set as last seen location."
      );
    } catch (error) {
      Alert.alert("Location Error", "Could not get current location.");
    }
  };

  const submitReport = async () => {
    if (!formData.species || !formData.contact_info) {
      Alert.alert(
        "Required Fields",
        "Please fill in species and contact information."
      );
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:8000/api/v1/reports/missing', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(formData),
      // });

      // Mock success
      Alert.alert("Success", "Missing pet report submitted successfully!");
      setFormData({
        name: "",
        species: "",
        color: "",
        description: "",
        photo_url: "",
        last_seen_location: { lon: 0, lat: 0 },
        last_seen_date: new Date().toISOString(),
        contact_info: "",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Report Missing Pet</Text>
          <Text style={styles.headerSubtitle}>
            Help us find your lost companion
          </Text>
        </View>

        <View style={styles.form}>
          {/* Photo Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pet Photo *</Text>
            {formData.photo_url ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: formData.photo_url }}
                  style={styles.petImage}
                />
                <TouchableOpacity
                  style={styles.changePhotoButton}
                  onPress={pickImage}
                >
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoButtons}>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={pickImage}
                >
                  <Text style={styles.photoButtonText}>
                    Choose from Gallery
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={takePhoto}
                >
                  <Text style={styles.photoButtonText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Pet Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pet Information</Text>

            <TextInput
              style={styles.input}
              placeholder="Pet name (optional)"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <TextInput
              style={[styles.input, styles.required]}
              placeholder="Species (dog, cat, etc.) *"
              value={formData.species}
              onChangeText={(text) =>
                setFormData({ ...formData, species: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Color (brown, black, white, etc.)"
              value={formData.color}
              onChangeText={(text) => setFormData({ ...formData, color: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (breed, size, distinctive features)"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last Seen Location</Text>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCurrentLocation}
            >
              <Text style={styles.locationButtonText}>
                Use Current Location
              </Text>
            </TouchableOpacity>
            <Text style={styles.locationText}>
              {formData.last_seen_location.lat !== 0
                ? `Location: ${formData.last_seen_location.lat.toFixed(
                    4
                  )}, ${formData.last_seen_location.lon.toFixed(4)}`
                : "Location not set"}
            </Text>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information *</Text>
            <TextInput
              style={[styles.input, styles.required]}
              placeholder="Phone number or email"
              value={formData.contact_info}
              onChangeText={(text) =>
                setFormData({ ...formData, contact_info: text })
              }
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={submitReport}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Submitting..." : "Submit Report"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
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
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },
  required: {
    borderColor: "#3B82F6",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  photoButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  photoButton: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: "center",
  },
  photoButtonText: {
    color: "white",
    fontWeight: "600",
  },
  imageContainer: {
    alignItems: "center",
  },
  petImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  changePhotoButton: {
    backgroundColor: "#6b7280",
    padding: 8,
    borderRadius: 6,
  },
  changePhotoText: {
    color: "white",
    fontWeight: "600",
  },
  locationButton: {
    backgroundColor: "#10b981",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  locationButtonText: {
    color: "white",
    fontWeight: "600",
  },
  locationText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
