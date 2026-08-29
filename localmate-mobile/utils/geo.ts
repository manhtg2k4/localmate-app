/**
 * Haversine formula to calculate the great-circle distance between two GPS coordinates in kilometers.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1)); // Distance in km with 1 decimal
}

/**
 * Formats distance into human-readable text e.g. "850m" or "1.8 km"
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Preset GPS coordinates for major Vietnam travel landmarks
 */
export const LANDMARK_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Hồ Hoàn Kiếm': { lat: 21.0285, lng: 105.8542 },
  'Phố Cổ Hà Nội': { lat: 21.034, lng: 105.849 },
  'Văn Miếu - Quốc Tử Giám': { lat: 21.0269, lng: 105.8354 },
  'Hồ Tây': { lat: 21.0557, lng: 105.8234 },
  'Chợ Đồng Xuân': { lat: 21.0379, lng: 105.846 },
  'Lăng Chủ tịch Hồ Chí Minh': { lat: 21.0366, lng: 105.8348 },
  'Vịnh Hạ Long': { lat: 20.9101, lng: 107.1839 },
  'Bãi biển Mỹ Khê': { lat: 16.0544, lng: 108.2468 },
  'Phố Cổ Hội An': { lat: 15.8801, lng: 108.338 }
};

// Default fallback Hanoi center position
export const DEFAULT_HANOI_COORDS = { lat: 21.0285, lng: 105.8542 };
