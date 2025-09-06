import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export const geocodeAddress = async (address) => {
  try {
    const response = await client.geocode({
      params: {
        address: `${address}, Adama, Ethiopia`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return {
        latitude: lat,
        longitude: lng,
        formattedAddress: response.data.results[0].formatted_address,
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};