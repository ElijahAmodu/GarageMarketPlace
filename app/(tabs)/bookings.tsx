import { type Booking, useListingsStoreSelectors } from "@/store/ljstingsStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BookingsScreen = () => {
  const {
    bookings,
    listings,
    isLoading,
    fetchMyBookings,
    getListingById,
    setSelectedListing,
  } = useListingsStoreSelectors();

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#28a745";
      case "pending":
        return "#ffc107";
      case "cancelled":
        return "#dc3545";
      case "completed":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return "checkmark-circle";
      case "pending":
        return "time";
      case "cancelled":
        return "close-circle";
      case "completed":
        return "flag";
      default:
        return "help-circle";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const listing = getListingById(item.listingId);

    if (!listing) return null;

    return (
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() => {
          setSelectedListing(listing);
          router.navigate("/listingDetailScreen");
        }}
      >
        <Image
          source={{ uri: listing.images[0] }}
          style={styles.bookingImage}
        />

        <View style={styles.bookingContent}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingTitle} numberOfLines={2}>
              {listing.title}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Ionicons
                name={getStatusIcon(item.status)}
                size={12}
                color="#fff"
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.bookingLocation}>
            <Ionicons name="location-outline" size={14} color="#6c757d" />{" "}
            {listing.location.address}
          </Text>

          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={14} color="#6c757d" />
              <Text style={styles.detailText}>
                {formatDate(item.startDate)} - {formatDate(item.endDate)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="card-outline" size={14} color="#6c757d" />
              <Text style={styles.detailText}>${item.totalPrice} total</Text>
            </View>
          </View>

          <Text style={styles.bookingDate}>
            Booked on {formatDate(item.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color="#6c757d" />
      <Text style={styles.emptyTitle}>No bookings yet</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring storage spaces to make your first booking
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.navigate("/(tabs)")}
      >
        <Text style={styles.exploreButtonText}>Explore Spaces</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Bookings</Text>
      <Text style={styles.headerSubtitle}>
        Manage your storage space bookings
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchMyBookings} />
        }
        contentContainerStyle={
          bookings.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6c757d",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  bookingImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#e9ecef",
  },
  bookingContent: {
    padding: 16,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bookingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  bookingLocation: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 12,
  },
  bookingDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#495057",
    marginLeft: 8,
  },
  bookingDate: {
    fontSize: 12,
    color: "#6c757d",
    fontStyle: "italic",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BookingsScreen;
