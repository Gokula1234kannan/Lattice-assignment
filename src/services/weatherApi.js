const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';

export const fetchWeatherForecast = async (lat, lon, date = null) => {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: 'temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset,uv_index_max',
    timezone: 'auto',
  });

  if (date) {
    params.append('start_date', date);
    params.append('end_date', date);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch weather data');
  return response.json();
};

export const fetchAirQuality = async (lat, lon) => {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: 'pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi',
    timezone: 'auto',
  });

  const response = await fetch(`${AIR_QUALITY_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch air quality data');
  return response.json();
};

export const fetchHistoricalData = async (lat, lon, startDate, endDate) => {
  // Weather Archive
  const weatherParams = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    start_date: startDate,
    end_date: endDate,
    daily: 'temperature_2m_mean,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant',
    timezone: 'Asia/Kolkata', 
  });


  const aqParams = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    start_date: startDate,
    end_date: endDate,
    hourly: 'pm10,pm2_5',
    timezone: 'Asia/Kolkata',
  });

  const [weatherRes, aqRes] = await Promise.all([
    fetch(`${ARCHIVE_URL}?${weatherParams.toString()}`),
    fetch(`${AIR_QUALITY_URL}?${aqParams.toString()}`)
  ]);

  if (!weatherRes.ok || !aqRes.ok) throw new Error('Failed to fetch historical data');

  return {
    weather: await weatherRes.json(),
    airQuality: await aqRes.json(),
  };
};
