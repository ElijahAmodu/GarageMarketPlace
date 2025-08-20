import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Create: undefined;
  Bookings: undefined;
  Profile: undefined;
};

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const { isAuthenticated, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const initializeApp = async () => {
      await initialize();

      if (!isAuthenticated) {
        router.replace("/loginScreen");
      }

      await SplashScreen.hideAsync();
    };

    initializeApp();
  }, [initialize, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "index" || route.name === "home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "create") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "bookings") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "help-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Storage Spaces",
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "List Space",
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "My Bookings",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
