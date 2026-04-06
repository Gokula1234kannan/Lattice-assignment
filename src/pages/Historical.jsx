import React, { useState, useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { fetchHistoricalData } from '../services/weatherApi';
import GlassCard from '../components/UI/GlassCard';
import ChartComponent from '../components/Charts/ChartComponent';
import { 
  Calendar, 
  Search, 
  TrendingUp, 
  Activity, 
  CloudRain, 
  Wind, 
  Sunrise, 
  Sunset
} from 'lucide-react';
import { format, subDays, subYears, isBefore, isAfter, parseISO } from 'date-fns';
import { ChartSkeleton, SkeletonBox } from '../components/UI/Skeleton';

const Historical = () => {
  const { location } = useWeather();
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    if (!location) return;
    
    // Validation: Max 2 years range
    const startDate = parseISO(dateRange.start);
    const endDate = parseISO(dateRange.end);
    const maxDate = subYears(new Date(), 2);

    if (isBefore(startDate, maxDate)) {
      setError('Historical data is limited to the last 2 years.');
      return;
    }

    if (isAfter(startDate, endDate)) {
      setError('Start date must be before end date.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await fetchHistoricalData(location.lat, location.lon, dateRange.start, dateRange.end);
      setData(result);
    } catch (err) {
      setError('Failed to fetch historical trends. Please refine your date range.');
    } finally {
      setLoading(false);
    }
  };

  const chartCategories = useMemo(() => {
    if (!data) return [];
    return data.weather.daily.time.map(t => format(new Date(t), 'MMM dd'));
  }, [data]);

  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-1 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            History<span className="text-white/20">.</span>
          </h1>
          <p className="text-text-muted font-medium text-sm">Analyze long-term weather patterns (Max 2 years)</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="date-input-wrapper">
             <Calendar size={16} className="text-primary" />
             <div className="flex flex-col">
               <span className="text-8px font-black text-primary uppercase tracking-widest">Start Date</span>
               <input 
                 type="date" 
                 className="bg-transparent border-none text-text-main focus:ring-0 text-xs font-bold"
                 value={dateRange.start}
                 onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
               />
             </div>
          </div>
          
          <div className="text-text-muted font-black text-xs px-2">TO</div>
          
          <div className="date-input-wrapper">
             <Calendar size={16} className="text-secondary" />
             <div className="flex flex-col">
               <span className="text-8px font-black text-secondary uppercase tracking-widest">End Date</span>
               <input 
                 type="date" 
                 className="bg-transparent border-none text-text-main focus:ring-0 text-xs font-bold"
                 value={dateRange.end}
                 onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
               />
             </div>
          </div>

          <button 
            onClick={handleFetch}
            disabled={loading}
            className="bg-primary hover:bg-white text-bg-dark font-black py-4 px-8 rounded-2xl transition-all flex flex-row items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50 text-xs md:text-sm whitespace-nowrap w-full md:w-auto mt-2 md:mt-0"
          >
            {loading ? <div className="animate-spin h-4 w-4 border-2 border-bg-dark border-t-transparent rounded-full" /> : <Search size={18} strokeWidth={3} className="flex-shrink-0" />} 
            <span className="tracking-widest uppercase">Analyze Trends</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="glass-card border-red-500/50 p-4 text-center text-white font-medium shadow-2xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard title="Historical Temperature (Mean/Max/Min)">
             <ChartComponent 
               series={[
                 { name: 'Max Temp', data: data.weather.daily.temperature_2m_max },
                 { name: 'Mean Temp', data: data.weather.daily.temperature_2m_mean },
                 { name: 'Min Temp', data: data.weather.daily.temperature_2m_min }
               ]}
               categories={chartCategories}
               yAxisTitle="Temperature (°C)"
               colors={['#fb7185', '#38bdf8', '#818cf8']}
             />
          </GlassCard>

          <GlassCard title="Total Precipitation">
             <ChartComponent 
               type="bar"
               series={[{ name: 'Precipitation', data: data.weather.daily.precipitation_sum }]}
               categories={chartCategories}
               yAxisTitle="mm"
               colors={['#38bdf8']}
             />
          </GlassCard>

          <GlassCard title="Sun Cycle (Sunrise/Sunset IST)">
             <ChartComponent 
               series={[
                 { name: 'Sunrise', data: data.weather.daily.sunrise.map(t => new Date(t).getHours() + new Date(t).getMinutes() / 60) },
                 { name: 'Sunset', data: data.weather.daily.sunset.map(t => new Date(t).getHours() + new Date(t).getMinutes() / 60) }
               ]}
               categories={chartCategories}
               yAxisTitle="Time (24h Decimal)"
               colors={['#fbbf24', '#f472b6']}
             />
          </GlassCard>

          <GlassCard title="Wind Patterns (Max Speed)">
             <ChartComponent 
               series={[{ name: 'Wind Speed', data: data.weather.daily.wind_speed_10m_max }]}
               categories={chartCategories}
               yAxisTitle="km/h"
               colors={['#818cf8']}
             />
          </GlassCard>

          <GlassCard title="Air Quality PM10 & PM2.5 Trends">
             <ChartComponent 
               series={[
                 { name: 'PM10 (Mean)', data: data.airQuality.hourly.pm10.filter((_, i) => i % 24 === 0) },
                 { name: 'PM2.5 (Mean)', data: data.airQuality.hourly.pm2_5.filter((_, i) => i % 24 === 0) }
               ]}
               categories={chartCategories}
               yAxisTitle="μg/m³"
               colors={['#2dd4bf', '#fb923c']}
             />
          </GlassCard>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 opacity-30 animate-pulse">
          <TrendingUp size={80} className="mb-4 text-primary" />
          <h2 className="text-2xl font-black">Select a date range to begin analysis</h2>
        </div>
      )}
    </div>
  );
};

export default Historical;
