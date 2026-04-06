import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserLocation, getCityName } from '../services/locationService';
import { fetchWeatherForecast, fetchAirQuality } from '../services/weatherApi';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [cityName, setCityName] = useState('Detecting Location...');
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [unit, setUnit] = useState('celsius'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshData = useCallback(async (lat, lon) => {
    setLoading(true);
    try {
      const [weather, aq, city] = await Promise.all([
        fetchWeatherForecast(lat, lon),
        fetchAirQuality(lat, lon),
        getCityName(lat, lon)
      ]);
      setWeatherData(weather);
      setAirQualityData(aq);
      setCityName(city);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not fetch weather data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserLocation()
      .then((loc) => {
        setLocation(loc);
        refreshData(loc.lat, loc.lon);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [refreshData]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const value = {
    location,
    cityName,
    weatherData,
    airQualityData,
    unit,
    loading,
    error,
    toggleUnit,
    refreshData
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
