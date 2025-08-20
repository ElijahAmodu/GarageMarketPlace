import { useListingsStoreSelectors } from "@/store/ljstingsStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const { width } = Dimensions.get("window");

export default function ListingDetail() {
  const router = useRouter();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  const { bookListing, selectedListing } = useListingsStoreSelectors();

  if (!selectedListing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#dc3545" />
          <Text style={styles.errorText}>Listing not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBooking = async () => {
    Alert.alert(
      "Book Storage Space",
      "Would you like to send a booking inquiry for this storage space?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Inquiry",
          onPress: async () => {
            setIsBooking(true);
            try {
              const startDate = new Date();
              startDate.setDate(startDate.getDate() + 1);
              const endDate = new Date(startDate);
              endDate.setMonth(endDate.getMonth() + 1);

              await bookListing(
                selectedListing.id,
                startDate.toISOString().split("T")[0],
                endDate.toISOString().split("T")[0]
              );

              Alert.alert(
                "Inquiry Sent!",
                "Your booking inquiry has been sent to the owner. They will contact you soon.",
                [{ text: "OK", onPress: () => router.back() }]
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to send booking inquiry. Please try again."
              );
            } finally {
              setIsBooking(false);
            }
          },
        },
      ]
    );
  };

  const renderImageCarousel = () => (
    <View style={styles.imageCarousel}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentImageIndex(index);
        }}
      >
        {selectedListing.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.carouselImage}
          />
        ))}
      </ScrollView>

      {selectedListing.images.length > 1 && (
        <View style={styles.imageIndicators}>
          {selectedListing.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentImageIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderImageCarousel()}

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{selectedListing.title}</Text>
              <Text style={styles.price}>${selectedListing.price}/month</Text>
            </View>

            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#ffc107" />
              <Text style={styles.rating}>{selectedListing.rating}</Text>
              <Text style={styles.reviewCount}>
                ({selectedListing.reviewCount} reviews)
              </Text>
            </View>
          </View>

          {/* Owner Info */}
          <View style={styles.ownerSection}>
            <View style={styles.ownerInfo}>
              <View style={styles.ownerAvatar}>
                <Ionicons name="person" size={24} color="#6c757d" />
              </View>
              <View>
                <Text style={styles.ownerName}>
                  {selectedListing.ownerName || "Owner"}
                </Text>
                <Text style={styles.ownerLabel}>Property Owner</Text>
              </View>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Ionicons name="resize-outline" size={20} color="#007AFF" />
              <Text style={styles.detailText}>
                {selectedListing.size || "Size not specified"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color="#007AFF" />
              <Text style={styles.detailText}>
                {selectedListing.location.address || "Location not specified"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color="#007AFF" />
              <Text style={styles.detailText}>
                Available {selectedListing.availability || "immediately"}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {selectedListing.description || "No description available."}
            </Text>
          </View>

          {/* Amenities */}
          {selectedListing.amenities &&
            selectedListing.amenities.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Amenities</Text>
                <View style={styles.amenitiesContainer}>
                  {selectedListing.amenities.map((amenity, index) => (
                    <View key={index} style={styles.amenityItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#28a745"
                      />
                      <Text style={styles.amenityText}>{amenity}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

          {/* Location Map */}
          {selectedListing.location && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: selectedListing.location.latitude,
                    longitude: selectedListing.location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: selectedListing.location.latitude,
                      longitude: selectedListing.location.longitude,
                    }}
                    title={selectedListing.title}
                  />
                </MapView>
              </View>
              <Text style={styles.addressText}>
                {selectedListing.location.address}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Booking Bar */}
      <View style={styles.bookingBar}>
        <TouchableOpacity
          style={[styles.bookButton, isBooking && styles.bookButtonDisabled]}
          onPress={handleBooking}
          disabled={isBooking}
        >
          {isBooking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.bookButtonText}>Send Booking Inquiry</Text>
              <Text style={styles.bookButtonSubtext}>
                ${selectedListing.price}/month
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: "#dc3545",
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  imageCarousel: {
    position: "relative",
  },
  carouselImage: {
    width: width,
    height: 250,
    backgroundColor: "#e9ecef",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginRight: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: "#6c757d",
    marginLeft: 4,
  },
  ownerSection: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  ownerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#dee2e6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  ownerLabel: {
    fontSize: 12,
    color: "#6c757d",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: "#495057",
    marginLeft: 12,
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: "#495057",
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    color: "#495057",
    marginLeft: 8,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  map: {
    height: 200,
  },
  addressText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
  },
  bookingBar: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
  },
  bookButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  bookButtonSubtext: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
});
