# Welcome to Garage Market Place 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

# GarageSpace - Storage Marketplace App

A React Native marketplace application for renting unused garage storage spaces, similar to Airbnb but for storage.

## Features Implemented

### Core Functionality

- **User Authentication** - Sign up and login with form validation
- **Browse Listings** - View available storage spaces with photos and details
- **Create Listings** - List your garage space with photos, location, and amenities
- **Search & Filter** - Search by location/amenities with price filtering
- **Map Integration** - View storage locations on an interactive map
- **Booking System** - Send booking inquiries to storage owners
- **User Profiles** - Basic user profile management

### UI/UX Features

- **Native Navigation** - Bottom tabs with stack navigation
- **Image Carousel** - Swipeable photo galleries for listings
- **Interactive Maps** - Location selection and viewing with markers
- **Form Validation** - Real-time form validation with error handling
- **Loading States** - Loading indicators and pull-to-refresh
- **Empty States** - Helpful empty state screens throughout

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand (lightweight alternative to Redux)
- **Navigation**: React Navigation 6
- **Forms**: React Hook Form
- **Maps**: React Native Maps
- **Icons**: Expo Vector Icons (Ionicons)
- **Image Handling**: Expo Image Picker
- **Location**: Expo Location

## Project Structure

```
src/
├── screens/           # All screen components
│   ├── HomeScreen.tsx          # Browse listings
│   ├── SearchScreen.tsx        # Search with map view
│   ├── CreateListingScreen.tsx # Create new listings
│   ├── ListingDetailScreen.tsx # Detailed listing view
│   ├── BookingsScreen.tsx      # User's bookings
│   ├── ProfileScreen.tsx       # User profile
│   └── LoginScreen.tsx         # Authentication
├── store/             # Zustand state management
│   ├── authStore.ts            # Authentication state
│   └── listingsStore.ts        # Listings and bookings state
└── App.tsx           # Main app component with navigation
```

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio/device

### Installation Steps

1. **Initialize Expo Project**

```bash
npx create-expo-app GarageSpace --template typescript
cd GarageSpace
```

2. **Install Dependencies**

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
npm install react-native-maps expo-location expo-image-picker
npm install react-hook-form zustand
npx expo install expo-font expo-splash-screen
```

3. **Copy Project Files**

- Copy all the provided source files into your project structure
- Replace the default App.tsx with the provided version
- Update package.json with the provided dependencies

4. **Run the Project**

```bash
npm start
# or
expo start
```

5. **Run on Device/Simulator**

- Press 'i' for iOS Simulator
- Press 'a' for Android Emulator
- Scan QR code with Expo Go app on physical device

## Current Features Status

### ✅ Completed (Day 1-3 Sprint)

- User authentication (mock implementation)
- Listing creation with photos and location
- Browse and search listings
- Interactive maps with markers
- Booking inquiry system
- Navigation and basic UI polish
- Form validation and error handling

### 🚧 In Progress / Next Steps

- Real backend integration (Firebase/Supabase)
- In-app messaging system
- Payment processing
- Push notifications
- Reviews and ratings system
- Advanced search filters

## Key Technical Decisions

### State Management - Zustand

Chose Zustand over Redux for its simplicity and smaller bundle size. Perfect for rapid prototyping while maintaining scalability.

### Navigation - React Navigation 6

Used bottom tabs for main navigation with stack navigation for detail screens. Provides native feel and smooth transitions.

### Maps - React Native Maps

Integrated native maps for location selection and viewing. Essential for a location-based marketplace.

### Forms - React Hook Form

Chosen for performance and developer experience. Minimal re-renders and excellent TypeScript support.

### Mock Data Strategy

Implemented comprehensive mock data to demonstrate functionality without backend dependency. Easy to replace with real API calls.

## Scaling Considerations

### Backend Integration

- Replace mock stores with real API calls
- Implement proper authentication (JWT tokens)
- Add image upload to cloud storage (AWS S3, Cloudinary)
- Implement real-time messaging (WebSocket/Firebase)

### Performance Optimizations

- Implement lazy loading for listing images
- Add infinite scroll for listing feeds
- Cache location data and search results
- Optimize map rendering for large datasets

### Enhanced Features

- Advanced search (radius, amenities, availability calendar)
- Payment processing (Stripe integration)
- Review and rating system
- Push notifications for bookings
- In-app messaging with photo sharing

## Development Notes

### Code Organization

- Separated concerns with dedicated stores for auth and listings
- Reusable components and consistent styling
- TypeScript for better development experience
- Proper error handling and loading states

### UI/UX Decisions

- Familiar patterns from popular marketplace apps
- Consistent color scheme and spacing
- Accessible design with proper contrast
- Native platform conventions for navigation

This project demonstrates a solid foundation for a storage marketplace app with room for extensive feature expansion and backend integration.
