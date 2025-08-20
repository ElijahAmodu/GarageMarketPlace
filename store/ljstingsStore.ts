import { create } from "zustand";
import { createSelectors } from "./create-selectore";

export interface StorageListing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  images: string[];
  size: string;
  amenities: string[];
  ownerId: string;
  ownerName: string;
  rating: number;
  reviewCount: number;
  availability: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

interface ListingsState {
  listings: StorageListing[];
  myListings: StorageListing[];
  bookings: Booking[];
  isLoading: boolean;
  selectedListing: StorageListing | null;
  error: string | null;
}

interface ListingsActions {
  fetchListings: () => Promise<void>;
  fetchMyListings: () => Promise<void>;
  fetchMyBookings: () => Promise<void>;
  createListing: (
    listing: Omit<
      StorageListing,
      "id" | "ownerId" | "ownerName" | "rating" | "reviewCount" | "createdAt"
    >
  ) => Promise<void>;
  bookListing: (
    listingId: string,
    startDate: string,
    endDate: string
  ) => Promise<void>;
  getListingById: (id: string) => StorageListing | undefined;
  setSelectedListing: (listing: StorageListing | null) => void;
  clearError: () => void;
}

const mockListings: StorageListing[] = [
  {
    id: "1",
    title: "Spacious Single Car Garage",
    description:
      "Clean and secure garage space perfect for storage. Easy access, well-lit, and dry.",
    price: 150,
    location: {
      address: "123 Oak Street, Downtown",
      latitude: 37.7749,
      longitude: -122.4194,
    },
    images: ["https://picsum.photos/400/300?random=1"],
    size: "Single car garage (12x24 ft)",
    amenities: ["24/7 Access", "Security Camera", "Electricity"],
    ownerId: "2",
    ownerName: "Sarah Johnson",
    rating: 4.8,
    reviewCount: 12,
    availability: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Large Storage Space",
    description:
      "Half of a two-car garage available for rent. Perfect for furniture or seasonal items.",
    price: 120,
    location: {
      address: "456 Pine Avenue, Suburbs",
      latitude: 37.7849,
      longitude: -122.4094,
    },
    images: ["https://picsum.photos/400/300?random=2"],
    size: "Half garage (12x12 ft)",
    amenities: ["Shelving Included", "Dry Space", "Easy Access"],
    ownerId: "3",
    ownerName: "Mike Chen",
    rating: 4.6,
    reviewCount: 8,
    availability: true,
    createdAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "3",
    title: "Climate Controlled Storage",
    description:
      "Premium garage space with climate control. Perfect for sensitive items.",
    price: 220,
    location: {
      address: "789 Maple Drive, Uptown",
      latitude: 37.7649,
      longitude: -122.4294,
    },
    images: ["https://picsum.photos/400/300?random=3"],
    size: "Full garage (24x24 ft)",
    amenities: [
      "Climate Control",
      "24/7 Access",
      "Security System",
      "Electricity",
    ],
    ownerId: "4",
    ownerName: "Emily Davis",
    rating: 4.9,
    reviewCount: 15,
    availability: true,
    createdAt: "2024-01-10T09:15:00Z",
  },
];

export const useListingsStore = create<ListingsState & ListingsActions>(
  (set, get) => ({
    listings: [],
    myListings: [],
    bookings: [],
    isLoading: false,
    selectedListing: null,
    error: null,

    fetchListings: async () => {
      set({ isLoading: true, error: null });
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        set({ listings: mockListings, isLoading: false });
      } catch (error) {
        set({
          isLoading: false,
          error: "Failed to fetch listings",
        });
        console.error("Failed to fetch listings:", error);
      }
    },

    fetchMyListings: async () => {
      set({ isLoading: true, error: null });
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ myListings: [], isLoading: false });
      } catch (error) {
        set({
          isLoading: false,
          error: "Failed to fetch your listings",
        });
      }
    },

    fetchMyBookings: async () => {
      set({ isLoading: true, error: null });
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockBookings: Booking[] = [
          {
            id: "1",
            listingId: "1",
            userId: "1",
            startDate: "2024-02-01",
            endDate: "2024-03-01",
            totalPrice: 150,
            status: "confirmed",
            createdAt: "2024-01-25T10:00:00Z",
          },
        ];
        set({ bookings: mockBookings, isLoading: false });
      } catch (error) {
        set({
          isLoading: false,
          error: "Failed to fetch bookings",
        });
      }
    },

    createListing: async (listingData) => {
      set({ isLoading: true, error: null });
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newListing: StorageListing = {
          ...listingData,
          id: Math.random().toString(),
          ownerId: "1",
          ownerName: "John Doe",
          rating: 0,
          reviewCount: 0,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          listings: [...state.listings, newListing],
          myListings: [...state.myListings, newListing],
          isLoading: false,
        }));
      } catch (error) {
        set({
          isLoading: false,
          error: "Failed to create listing",
        });
        throw error;
      }
    },

    bookListing: async (listingId, startDate, endDate) => {
      set({ isLoading: true, error: null });
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const listing = get().listings.find((l) => l.id === listingId);
        if (!listing) throw new Error("Listing not found");

        const booking: Booking = {
          id: Math.random().toString(),
          listingId,
          userId: "1",
          startDate,
          endDate,
          totalPrice: listing.price,
          status: "pending",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          bookings: [...state.bookings, booking],
          isLoading: false,
        }));
      } catch (error) {
        set({
          isLoading: false,
          error: "Failed to book listing",
        });
        throw error;
      }
    },

    getListingById: (id: string) => {
      return get().listings.find((listing) => listing.id === id);
    },

    setSelectedListing: (listing) => set({ selectedListing: listing }),

    clearError: () => set({ error: null }),
  })
);

export const useListingsStoreSelectors = createSelectors(useListingsStore);
