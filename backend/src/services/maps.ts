/**
 * Google Maps Service
 * Proxies polling location searches using the Google Maps/Places API.
 * Provides geocoding and nearby search for polling stations.
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PollingLocation {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: string;
  openingHours?: string[];
  accessibility: {
    wheelchair: boolean;
    audioBallot: boolean;
  };
  directionsUrl: string;
}

export interface GeocoordinatesResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

// ─── Polling Location Search ───────────────────────────────────────────────────

/**
 * Searches for polling locations near a given address.
 * Uses Google Maps Geocoding + Places API.
 */
export async function findPollingLocations(
  address: string
): Promise<PollingLocation[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('[MAPS] Google Maps API key not configured');
    return [];
  }

  try {
    // Step 1: Geocode the address
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const geocodeRes = await fetch(geocodeUrl);
    const geocodeData: any = await geocodeRes.json();

    if (!geocodeData.results || geocodeData.results.length === 0) {
      return [];
    }

    const location = geocodeData.results[0].geometry.location;

    // Step 2: Search for nearby polling locations
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=5000&keyword=polling+station+voting+center&key=${apiKey}`;
    const placesRes = await fetch(placesUrl);
    const placesData: any = await placesRes.json();

    if (!placesData.results || placesData.results.length === 0) {
      return [];
    }

    return placesData.results.slice(0, 5).map((place: any) => ({
      name: place.name,
      address: place.vicinity || place.formatted_address || '',
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      openingHours: place.opening_hours?.weekday_text || ['Contact location for hours'],
      accessibility: {
        wheelchair: true,  // Default assumption — real data would come from election authority
        audioBallot: false,
      },
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name + ' ' + (place.vicinity || ''))}`,
    }));
  } catch (error) {
    console.error('[MAPS] Polling location search failed:', error);
    return [];
  }
}

/**
 * Returns default/placeholder polling locations when API is unavailable.
 * Directs users to official election authority websites.
 */
function getDefaultPollingLocations(postalCode: string, country: string): PollingLocation[] {
  const countryInfo: Record<string, { name: string; website: string }> = {
    US: { name: 'United States', website: 'https://www.vote.org/polling-place-locator/' },
    UK: { name: 'United Kingdom', website: 'https://www.electoralcommission.org.uk/' },
    IN: { name: 'India', website: 'https://eci.gov.in/' },
    CA: { name: 'Canada', website: 'https://www.elections.ca/' },
    AU: { name: 'Australia', website: 'https://www.aec.gov.au/' },
    DE: { name: 'Germany', website: 'https://www.bundeswahlleiter.de/' },
    FR: { name: 'France', website: 'https://www.service-public.fr/' },
    BR: { name: 'Brazil', website: 'https://www.tse.jus.br/' },
  };

  const info = countryInfo[country] || { name: country, website: '' };

  return [
    {
      name: `${info.name} Election Authority`,
      address: `Search for polling locations at: ${info.website || 'your local election authority website'}`,
      latitude: 0,
      longitude: 0,
      openingHours: ['Visit the official website for Election Day hours'],
      accessibility: { wheelchair: true, audioBallot: true },
      directionsUrl: info.website || 'https://www.google.com/search?q=polling+location+' + postalCode,
    },
  ];
}

/**
 * Generates a Google Maps embed URL for a given location.
 */
export function getMapEmbedUrl(latitude: number, longitude: number, apiKey: string): string {
  return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${latitude},${longitude}&zoom=14`;
}
