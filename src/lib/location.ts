/**
 * MyFood Location Service
 * 
 * Handles geolocation, address resolution, and location permissions.
 */

export interface LocationResult {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  bairro?: string;
}

/**
 * Request user's current location
 */
export function requestLocation(): Promise<LocationResult | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        resolve({ latitude, longitude, ...address });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  });
}

/**
 * Reverse geocode coordinates to address using free Nominatim API
 */
export async function reverseGeocode(lat: number, lng: number): Promise<{ address?: string; city?: string; bairro?: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt`
    );
    const data = await res.json();

    const addr = data.address || {};
    const parts = [
      addr.road || addr.street,
      addr.suburb || addr.neighbourhood || addr.quarter,
      addr.city || addr.town || addr.village,
    ].filter(Boolean);

    return {
      address: parts.join(', ') || data.display_name?.split(',').slice(0, 3).join(',') || '',
      city: addr.city || addr.town || addr.state || '',
      bairro: addr.suburb || addr.neighbourhood || addr.quarter || '',
    };
  } catch {
    return {};
  }
}

/**
 * Check if location permission is granted
 */
export async function checkLocationPermission(): Promise<'granted' | 'denied' | 'prompt'> {
  if (!navigator.permissions) return 'prompt';
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch {
    return 'prompt';
  }
}

/**
 * Watch user position (for driver tracking)
 */
export function watchPosition(callback: (pos: LocationResult) => void): number | null {
  if (!navigator.geolocation) return null;

  return navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      callback({ latitude, longitude });
    },
    () => {},
    { enableHighAccuracy: true, maximumAge: 5000 }
  );
}

export function stopWatching(watchId: number): void {
  navigator.geolocation.clearWatch(watchId);
}
