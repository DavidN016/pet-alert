import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ onLogout }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assume logged in since we're in the main app
  const [userEmail, setUserEmail] = useState("user@example.com");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          onLogout();
        },
      },
    ]);
  };

  const handleMyReports = () => {
    Alert.alert("My Reports", "Show user's reports");
  };

  const handleFoundPets = () => {
    Alert.alert("Found Pets", "Show pets I've helped find");
  };

  const handleSettings = () => {
    Alert.alert("Settings", "Open settings");
  };

  const handleHelp = () => {
    Alert.alert("Help", "Show help information");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>
          {isLoggedIn ? `Welcome back, ${userEmail}` : "Manage your account"}
        </Text>
      </View>

      <View style={styles.content}>
        {!isLoggedIn ? (
          <View style={styles.authSection}>
            <View style={styles.authCard}>
              <Text style={styles.authTitle}>Get Started</Text>
              <Text style={styles.authDescription}>
                Create an account to report missing pets and help reunite
                families
              </Text>
              <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
                <Text style={styles.authButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.authButtonSecondary}
                onPress={handleRegister}
              >
                <Text style={styles.authButtonSecondaryText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#3B82F6" />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{userEmail}</Text>
                <Text style={styles.userStatus}>Active Member</Text>
              </View>
            </View>

            <View style={styles.menuSection}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleMyReports}
              >
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color="#3B82F6"
                />
                <Text style={styles.menuItemText}>My Reports</Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleFoundPets}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="#10b981"
                />
                <Text style={styles.menuItemText}>Found Pets</Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleSettings}
              >
                <Ionicons name="settings-outline" size={24} color="#6b7280" />
                <Text style={styles.menuItemText}>Settings</Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color="#6b7280"
                />
                <Text style={styles.menuItemText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
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
  content: {
    padding: 20,
  },
  authSection: {
    marginTop: 40,
  },
  authCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  authDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  authButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: "100%",
  },
  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  authButtonSecondary: {
    backgroundColor: "transparent",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3B82F6",
    width: "100%",
  },
  authButtonSecondaryText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  userSection: {
    marginTop: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "500",
  },
  menuSection: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuItemText: {
    fontSize: 16,
    color: "#1f2937",
    marginLeft: 12,
    flex: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "600",
    marginLeft: 8,
  },
});
