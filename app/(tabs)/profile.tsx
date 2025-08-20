import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../store/authStore";

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", onPress: logout, style: "destructive" },
    ]);
  };

  const profileOptions = [
    {
      icon: "person-outline",
      title: "Edit Profile",
      subtitle: "Update your personal information",
      onPress: () =>
        Alert.alert("Coming Soon", "This feature will be available soon!"),
    },
    {
      icon: "settings-outline",
      title: "Settings",
      subtitle: "App preferences and privacy",
      onPress: () =>
        Alert.alert("Coming Soon", "This feature will be available soon!"),
    },
  ];

  const renderProfileOption = (
    option: (typeof profileOptions)[0],
    index: number
  ) => (
    <TouchableOpacity
      key={index}
      style={styles.optionItem}
      onPress={option.onPress}
    >
      <View style={styles.optionIcon}>
        {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
        <Ionicons name={option.icon as any} size={24} color="#007AFF" />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6c757d" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color="#6c757d" />
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.memberSince}>
            Member since{" "}
            {new Date(user?.createdAt || "").toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5.0</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsSection}>
          {profileOptions.map(renderProfileOption)}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>GarageSpace v1.0.0</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "About",
                "GarageSpace - Your trusted storage marketplace"
              )
            }
          >
            <Text style={styles.aboutLink}>About</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#dc3545" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#dee2e6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: "#6c757d",
  },
  statsSection: {
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingVertical: 20,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6c757d",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#dee2e6",
    marginVertical: 8,
  },
  optionsSection: {
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
    color: "#6c757d",
  },
  appInfo: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  appInfoText: {
    fontSize: 14,
    color: "#6c757d",
  },
  aboutLink: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    color: "#dc3545",
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default ProfileScreen;
