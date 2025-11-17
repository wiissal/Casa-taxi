# M O V E - Casablanca Taxi Booking App

## Overview
TAXI-APP is a React Native mobile application designed to simplify booking red petit taxis in Casablanca, Morocco. Built during the SIMPLON bootcamp, this app provides an intuitive interface for users to book taxis, track rides in real-time, and experience dynamic pricing based on time of day.

**The goal**: Bring Casablanca's iconic red petit taxi system into the digital age with a modern, smooth mobile experience.

## 🎯 Features Implemented

### 1. **Splash Screen** (`index.jsx`)
- Beautiful animated welcome screen
- App branding and introduction
- Smooth transition to main app

### 2. **Home-Map Screen** (`home.jsx`)
- Interactive Google Map centered on Casablanca
- Display all major landmarks ( Hassan II Mosque, Medina, etc.)
- View available taxis in real-time on the map
- User location tracking
- Quick "Book Ride Now" button
- Responsive map markers for different location types

### 3. **Booking Screen** (`booking.jsx`)
- Bottom sheet UI for location selection
- Step-by-step flow: Select Pickup → Select Destination → Confirm
- Display ride summary with pickup and dropoff locations
- Dynamic pricing calculation (Day/Night mode)
- Beautiful chip-based location selector
- Immediate visual feedback on selections

### 4. **Active Ride Screen** (`ride.jsx`)
- Real-time taxi tracking on map
- Driver information display (name, rating, car number)
- Ride progress indicators
- Cancel ride functionality (before driver arrives)
- Current location coordinates

### 5. **Ride Summary Screen** (`rideSummary.jsx`)
- Trip details (pickup, dropoff, distance)
- Final price breakdown
- Ride duration
- Driver rating option
- Option to book another ride or go home

  ![image alt](https://github.com/wiissal/Casa-taxi/blob/27ba391c83e61e9fdea095b61178e16c18f53bc0/20251116_215846.jpg)

## 💻 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React Native** | Core mobile framework |
| **Expo** | Development environment & deployment |
| **React Native Maps** | Interactive map integration |
| **React Native Reanimated** | Smooth animations |
| **Zustand** | Global state management |
| **Expo Router** | Navigation & routing |
| **AsyncStorage** | Local data persistence |
| **Expo Location** | GPS & location services |

## 📁 Project Structure

```
TAXI-APP/
├── app/                         # Expo Router screens
│   ├── index.jsx                # Splash screen (entry point)
│   ├── home.jsx                 # Home-map screen with available taxis
│   ├── booking.jsx              # Booking flow screen
│   ├── ride.jsx                 # Active ride tracking screen
│   └── rideSummary.jsx          # Trip summary screen
├── data/                        # Static data & constants
│   ├── taxiData.js              # Taxi information & mock data
│   └── casaLocations.js         # Casablanca landmarks & coordinates
├── store/                       # Global state management
│   └── useTaxiStore.js          # Zustand global state store
├── utils/                       # Utility functions
│   └── calculations.js          # Price calculations & helper functions
├── assets/                      # Images & styles
│   ├── taximap.png              # Taxi marker icon
├── .expo/                       # Expo configuration
├── README.md                    # This file
├── REFLECTION.md                # Project reflection & learning
├── app.json                     # Expo app configuration
├── babel.config.js              # Babel configuration
├── package.json                 # Dependencies
└── index.js                     # Entry point
```

## 🚀 Installation & Setup

```bash
# 1. Clone the repository
git clone [your-repo-link]
cd casataxi

# 2. Install dependencies
npm install
# or
yarn install

# 3. Install Expo CLI globally (if not already installed)
npm install -g expo-cli

# 4. Start the development server
npx expo start

# 5. Scan QR code with Expo Go app (iOS/Android)
```

### Requirements
- Node.js v16+
- npm or yarn
- Expo Go app (on your phone)
- Location permissions enabled on your device

## 📱 How to Use the App

1. **Launch App** - See splash screen animation
3. **View Map** - See available taxis and Casablanca landmarks
4. **Book Ride**
   - Tap " Book Now"
   - Select your pickup location from the list
   - Select your destination
   - See calculated price (day/night rate applied)
   - Confirm booking
5. **Track Ride** - Watch your taxi approach in real-time
6. **Complete Ride** - Rate driver and see trip summary
7. **Repeat** - Option to book another ride

![Screenshot_20251116_211514_Expo_Go 1](https://github.com/user-attachments/assets/b4467209-6433-4e8a-acc9-0c2cdb53542d)

![Screenshot_20251116_211853_Expo_Go 1](https://github.com/user-attachments/assets/303e1fd9-5b8e-4d63-b482-aeeef82f22c2)

  ![Screenshot_20251116_211915_Expo_Go 1](https://github.com/user-attachments/assets/63c84438-1c89-4221-a559-f3c280becadd)

  
![Screenshot_20251116_211921_Expo_Go 1](https://github.com/user-attachments/assets/b8fc53dc-2c65-4a70-b674-3045facfc401)

![Screenshot_20251116_211939_Expo_Go 1](https://github.com/user-attachments/assets/5c2d1694-3a69-4126-9508-aaba36452132)

![Screenshot_20251116_211944_Expo_Go 1](https://github.com/user-attachments/assets/810896ca-40df-4000-b18d-d0c24c2833fb)

![Screenshot_20251116_211949_Expo_Go 1](https://github.com/user-attachments/assets/e6de8b91-24c2-45ce-b696-357702f84de3)



**Challenge**: Markers were flickering when parent state changed. Solution used React.memo to prevent re-renders of static map content.

**Challenge**: Implementing realistic pricing for day vs night mode. Solution: Created flexible pricing calculations in utils folder that adjusts based on time of day.

## 🎨 Design Highlights

- **Color Scheme**: Gold (#FFD700) for primary action, Red (#DC143C) for taxis, Blue for user location
- **Typography**: Clear hierarchy with bold headings for important information
- **Animations**: Smooth, purposeful animations that enhance UX without being distracting
- **Accessibility**: Large touch targets, readable text sizes



## 👤 Author

**Wissal OUBOUJEMAA** 

## 📚 Learning Resources Used

- React Native Official Documentation
- Expo Documentation
- React Native Maps Guide
- Reanimated Animation Tutorials
- Zustand State Management Patterns

