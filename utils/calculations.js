// Haversine formula to calculate distance between 2 coordinates
export const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.latitude * Math.PI) / 180) *
      Math.cos((coord2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Round to 2 decimals
};

// Calculate price based on distance and time (day/night)
export const calculatePrice = (distanceKm, isNightMode) => {
  const PRISE_EN_CHARGE = 7.5; // DH
  const PRIX_PAR_KM_DAY = 1.5; // DH
  const PRIX_PAR_KM_NIGHT = 2.0; // DH

  const pricePerKm = isNightMode ? PRIX_PAR_KM_NIGHT : PRIX_PAR_KM_DAY;
  const totalPrice = PRISE_EN_CHARGE + distanceKm * pricePerKm;
  return Math.round(totalPrice * 100) / 100; // Round to 2 decimals
};

// Calculate time based on distance (average speed 30 km/h)
export const calculateTime = (distanceKm) => {
  const AVERAGE_SPEED = 30; // km/h
  const timeMinutes = (distanceKm / AVERAGE_SPEED) * 60;
  return Math.round(timeMinutes); // Return as integer minutes
};