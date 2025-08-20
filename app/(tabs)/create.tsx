import { useListingsStore } from "@/store/ljstingsStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CreateListingForm {
  title: string;
  description: string;
  price: string;
  address: string;
  size: string;
  amenities: string;
}

const PRESET_AMENITIES = [
  "24/7 Access",
  "Security Camera",
  "Electricity",
  "Climate Control",
  "Shelving Included",
  "Dry Space",
  "Easy Access",
  "Security System",
  "Lighting",
  "Ground Level",
];

const CreateListingScreen = () => {
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createListing } = useListingsStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateListingForm>();

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location access is needed to set your storage location"
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Location permission error:", error);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      Alert.alert("Success", "Location set successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to get current location");
    }
  };

  const pickImages = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera roll permission to add photos"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri);
        setImages((prev) => [...prev, ...newImages].slice(0, 5));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const onSubmit = async (data: CreateListingForm) => {
    if (images.length === 0) {
      Alert.alert(
        "Missing Photos",
        "Please add at least one photo of your storage space"
      );
      return;
    }

    if (!location) {
      Alert.alert(
        "Missing Location",
        "Please set the location of your storage space"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await createListing({
        title: data.title,
        description: data.description,
        price: Number.parseFloat(data.price),
        location: {
          address: data.address,
          latitude: location.latitude,
          longitude: location.longitude,
        },
        images,
        size: data.size,
        amenities: selectedAmenities,
        availability: true,
      });

      Alert.alert(
        "Success!",
        "Your storage listing has been created successfully.",
        [{ text: "OK", onPress: () => resetForm() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    setImages([]);
    setLocation(null);
    setSelectedAmenities([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>List Your Storage Space</Text>
          <Text style={styles.subtitle}>
            Share your unused garage space with others and earn extra income
          </Text>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title *</Text>
              <Controller
                control={control}
                name="title"
                rules={{ required: "Title is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.title && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="e.g., Spacious Single Car Garage"
                    maxLength={100}
                  />
                )}
              />
              {errors.title && (
                <Text style={styles.errorText}>{errors.title.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description *</Text>
              <Controller
                control={control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.textArea,
                      errors.description && styles.inputError,
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Describe your storage space, access details, security features..."
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                  />
                )}
              />
              {errors.description && (
                <Text style={styles.errorText}>
                  {errors.description.message}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Monthly Price (USD) *</Text>
              <Controller
                control={control}
                name="price"
                rules={{
                  required: "Price is required",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Enter a valid price",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.price && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="150"
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.price && (
                <Text style={styles.errorText}>{errors.price.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Size *</Text>
              <Controller
                control={control}
                name="size"
                rules={{ required: "Size is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.size && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="e.g., Single car garage (12x24 ft)"
                  />
                )}
              />
              {errors.size && (
                <Text style={styles.errorText}>{errors.size.message}</Text>
              )}
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address *</Text>
              <Controller
                control={control}
                name="address"
                rules={{ required: "Address is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.address && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="123 Main Street, City, State"
                  />
                )}
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address.message}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCurrentLocation}
            >
              <Ionicons name="location" size={20} color="#007AFF" />
              <Text style={styles.locationButtonText}>
                {location ? "Location Set ✓" : "Set Current Location"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Photos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <Text style={styles.sectionSubtitle}>
              Add up to 5 photos of your storage space
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
            >
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={pickImages}
              >
                <Ionicons name="camera" size={32} color="#6c757d" />
                <Text style={styles.addImageText}>Add Photos</Text>
              </TouchableOpacity>

              {images.map((uri, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={20} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <Text style={styles.sectionSubtitle}>Select all that apply</Text>

            <View style={styles.amenitiesContainer}>
              {PRESET_AMENITIES.map((amenity) => (
                <TouchableOpacity
                  key={amenity}
                  style={[
                    styles.amenityTag,
                    selectedAmenities.includes(amenity) &&
                      styles.amenityTagSelected,
                  ]}
                  onPress={() => toggleAmenity(amenity)}
                >
                  <Text
                    style={[
                      styles.amenityTagText,
                      selectedAmenities.includes(amenity) &&
                        styles.amenityTagTextSelected,
                    ]}
                  >
                    {amenity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Create Listing</Text>
            )}
          </TouchableOpacity>
        </View>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 32,
    lineHeight: 24,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 4,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  locationButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  imageScroll: {
    marginTop: 8,
  },
  addImageButton: {
    width: 120,
    height: 120,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#dee2e6",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addImageText: {
    marginTop: 8,
    fontSize: 12,
    color: "#6c757d",
  },
  imageContainer: {
    position: "relative",
    marginRight: 12,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#e9ecef",
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  amenityTagSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  amenityTagText: {
    fontSize: 14,
    color: "#495057",
  },
  amenityTagTextSelected: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default CreateListingScreen;
