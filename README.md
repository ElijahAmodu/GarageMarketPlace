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

A React Native garage marketplace application for renting unused garage storage spaces, similar to Airbnb but for storage.

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

- **Native Navigation** - Bottom tabs
- **Image Carousel** - Swipeable photo galleries for listings
- **Interactive Maps** - Location selection and viewing with markers
- **Form Validation** - Real-time form validation with error handling
- **Loading States** - Loading indicators and pull-to-refresh
- **Empty States** - Helpful empty state screens throughout

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand (lightweight alternative to Redux)
- **Forms**: React Hook Form
- **Maps**: React Native Maps
- **Icons**: Expo Vector Icons (Ionicons)
- **Image Handling**: Expo Image Picker
- **Location**: Expo Location

## Project Structure

```
app/
├── (tab)/
│   ├── index.tsx          # Browse listings
│   ├── search.tsx        # Search with map view
│   ├── create.tsx # Create new listings
│   ├── bookings.tsx      # User's bookings
│   ├── profile.tsx       # User profile
|── login.tsx            # Authentication
|
├── store/             # Zustand state management
│   ├── authStore.ts            # Authentication state
│   └── listingsStore.ts        # Listings and bookings state

```

## Installation & Setup

### Prerequisites

- Node.js
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
npm install
Or
npx expo install
```

## Current Features Status

- User authentication (mock implementation)
- Listing creation with photos and location
- Browse and search listings
- Interactive maps with markers
- Booking inquiry system
- Navigation and basic UI polish
- Form validation and error handling

### 🚧 In Progress / Next Steps

- Real backend integration (Firebase/Supabase/ or an actual backend )
- In-app messaging system
- Payment processing
- Push notifications
- Reviews and ratings system
- Advanced search filters

## Key Technical Decisions

### State Management - Zustand

Chose Zustand over Redux because it is lightweight.

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
- Accessible design with proper contrast
