export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          // Default to a sensible location (e.g. London) if user denies or fails
          console.warn('Geolocation failed, falling back to default location');
          resolve({ lat: 51.5074, lon: -0.1278 }); // London
        }
      );
    }
  });
};

export const getCityName = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
    );
    const data = await response.json();
    const address = data.address || {};
    
    // Fallback chain for location name
    return (
      address.city || 
      address.town || 
      address.village || 
      address.suburb || 
      address.hamlet || 
      address.neighbourhood || 
      address.municipality || 
      address.city_district ||
      address.county ||
      address.state ||
      (data.display_name ? data.display_name.split(',')[0] : 'Unknown Location')
    );
  } catch (error) {
    console.error('Error fetching city name:', error);
    return 'Localized Data';
  }
};
