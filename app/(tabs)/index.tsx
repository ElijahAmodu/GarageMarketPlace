import {
  type StorageListing,
  useListingsStoreSelectors,
} from "@/store/ljstingsStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HomeScreen = () => {
  const router = useRouter();
  const { listings, isLoading, fetchListings, setSelectedListing } =
    useListingsStoreSelectors();

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const onRefresh = () => {
    fetchListings();
  };

  const renderListingItem = ({ item }: { item: StorageListing }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => {
        setSelectedListing(item);
        router.push("/listingDetailScreen");
      }}
    >
      <Image source={{ uri: item.images[0] }} style={styles.listingImage} />

      <View style={styles.listingInfo}>
        <View style={styles.listingHeader}>
          <Text style={styles.listingTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.listingPrice}>${item.price}/month</Text>
        </View>

        <Text style={styles.listingLocation} numberOfLines={1}>
          <Ionicons name="location-outline" size={14} color="#6c757d" />{" "}
          {item.location.address}
        </Text>

        <Text style={styles.listingSize}>{item.size}</Text>

        <View style={styles.listingFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#ffc107" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount} reviews)</Text>
          </View>

          {item.availability && (
            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>Available</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="home-outline" size={64} color="#6c757d" />
      <Text style={styles.emptyTitle}>No storage spaces found</Text>
      <Text style={styles.emptySubtitle}>
        Be the first to list your garage space!
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Find Storage Space</Text>
      <Text style={styles.headerSubtitle}>
        Discover secure storage in your neighborhood
      </Text>
    </View>
  );

  if (isLoading && listings.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading storage spaces...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listings}
        renderItem={renderListingItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        contentContainerStyle={
          listings.length === 0 ? styles.emptyContainer : undefined
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6c757d",
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
  listingCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listingImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#e9ecef",
  },
  listingInfo: {
    padding: 16,
  },
  listingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  listingTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  listingLocation: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 4,
  },
  listingSize: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 12,
  },
  listingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: "#6c757d",
    marginLeft: 4,
  },
  availableBadge: {
    backgroundColor: "#28a745",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
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
  },
});

export default HomeScreen;
