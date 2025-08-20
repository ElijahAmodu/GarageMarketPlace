import {
  type StorageListing,
  useListingsStoreSelectors,
} from "@/store/ljstingsStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const { height } = Dimensions.get("window");

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [filteredListings, setFilteredListings] = useState<StorageListing[]>(
    []
  );
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { listings, fetchListings, setSelectedListing } =
    useListingsStoreSelectors();

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    filterListings();
  }, [searchQuery, listings, priceRange]);

  const filterListings = () => {
    let filtered = listings.filter((listing) => listing.availability);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(query) ||
          listing.location.address.toLowerCase().includes(query) ||
          listing.amenities.some((amenity) =>
            amenity.toLowerCase().includes(query)
          )
      );
    }

    filtered = filtered.filter(
      (listing) =>
        listing.price >= priceRange.min && listing.price <= priceRange.max
    );

    setFilteredListings(filtered);
  };

  const renderListingCard = ({ item }: { item: StorageListing }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => {
        setSelectedListing(item);
        router.navigate("/listingDetailScreen");
      }}
    >
      <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardPrice}>${item.price}/mo</Text>
        </View>
        <Text style={styles.cardLocation} numberOfLines={1}>
          <Ionicons name="location-outline" size={12} color="#6c757d" />{" "}
          {item.location.address}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#ffc107" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.cardSize}>{item.size}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMapMarkers = () => {
    return filteredListings.map((listing) => (
      <Marker
        key={listing.id}
        coordinate={{
          latitude: listing.location.latitude,
          longitude: listing.location.longitude,
        }}
        onPress={() =>
          navigation.navigate("ListingDetail", { listingId: listing.id })
        }
      >
        <View style={styles.markerContainer}>
          <Text style={styles.markerPrice}>${listing.price}</Text>
        </View>
      </Marker>
    ));
  };

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <Text style={styles.filterTitle}>Price Range</Text>
      <View style={styles.priceFilter}>
        <TextInput
          style={styles.priceInput}
          value={priceRange.min.toString()}
          onChangeText={(text) =>
            setPriceRange((prev) => ({
              ...prev,
              min: Number.parseInt(text) || 0,
            }))
          }
          placeholder="Min"
          keyboardType="numeric"
        />
        <Text style={styles.priceSeparator}>-</Text>
        <TextInput
          style={styles.priceInput}
          value={priceRange.max.toString()}
          onChangeText={(text) =>
            setPriceRange((prev) => ({
              ...prev,
              max: Number.parseInt(text) || 1000,
            }))
          }
          placeholder="Max"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#6c757d"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location, amenities..."
            placeholderTextColor="#adaeafff"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6c757d" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.searchActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              showFilters && styles.actionButtonActive,
            ]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons
              name="options"
              size={20}
              color={showFilters ? "#007AFF" : "#6c757d"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, showMap && styles.actionButtonActive]}
            onPress={() => setShowMap(!showMap)}
          >
            <Ionicons
              name={showMap ? "list" : "map"}
              size={20}
              color={showMap ? "#007AFF" : "#6c757d"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      {showFilters && renderFilters()}

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredListings.length} storage space
          {filteredListings.length !== 1 ? "s" : ""} available
        </Text>
      </View>

      {/* Content */}
      {showMap ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {renderMapMarkers()}
        </MapView>
      ) : (
        <FlatList
          data={filteredListings}
          renderItem={renderListingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color="#6c757d" />
              <Text style={styles.emptyTitle}>No storage spaces found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  searchHeader: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  searchActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionButtonActive: {
    backgroundColor: "#e3f2fd",
  },
  filtersContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  priceFilter: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  priceSeparator: {
    marginHorizontal: 12,
    fontSize: 16,
    color: "#6c757d",
  },
  resultsHeader: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  listContainer: {
    padding: 16,
  },
  listingCard: {
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
  cardImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#e9ecef",
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  cardLocation: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    marginLeft: 2,
  },
  cardSize: {
    fontSize: 12,
    color: "#6c757d",
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  markerPrice: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
  },
});

export default SearchScreen;
