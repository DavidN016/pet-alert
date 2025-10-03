import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import screens
import HomeScreen from "./src/screens/HomeScreen";
import ReportScreen from "./src/screens/ReportScreen";
import MapScreen from "./src/screens/MapScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Report") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Missing Pets" }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{ title: "Report Pet" }}
      />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: "Map" }} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user has a valid token
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        // TODO: Validate token with backend
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (token: string) => {
    try {
      await AsyncStorage.setItem("authToken", token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error saving auth token:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error removing auth token:", error);
    }
  };

  if (isLoading) {
    return (
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator>
          <Stack.Screen
            name="Loading"
            component={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <Text style={{ fontSize: 18, color: "#6b7280" }}>
                  Loading...
                </Text>
              </View>
            )}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        {isAuthenticated ? (
          // Authenticated user - show main app
          <>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={(props: any) => (
                <ProfileScreen {...props} onLogout={handleLogout} />
              )}
              options={{ title: "Profile" }}
            />
          </>
        ) : (
          // Not authenticated - show auth screens
          <>
            <Stack.Screen
              name="Login"
              component={(props: any) => (
                <LoginScreen {...props} onLogin={handleLogin} />
              )}
              options={{ title: "Login" }}
            />
            <Stack.Screen
              name="Register"
              component={(props: any) => (
                <RegisterScreen {...props} onLogin={handleLogin} />
              )}
              options={{ title: "Register" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
