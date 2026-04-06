import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import GlassCard from '../components/UI/GlassCard';
import ChartComponent from '../components/Charts/ChartComponent';
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind, 
  Eye, 
  Zap, 
  CloudRain,
  Activity,
  Navigation,
  Sunrise,
  Sunset,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { GridSkeleton, ChartSkeleton, SkeletonBox } from '../components/UI/Skeleton';

const Dashboard = () => {
  const { weatherData, airQualityData, unit, loading, error, cityName } = useWeather();

  const currentHourIndex = new Date().getHours();

  const currentVars = useMemo(() => {
    if (!weatherData) return null;
    const daily = weatherData.daily;
    const hourly = weatherData.hourly;
    
    return [
      { id: 1, title: 'Temperature', value: `${unit === 'celsius' ? hourly.temperature_2m[currentHourIndex] : (hourly.temperature_2m[currentHourIndex] * 9/5 + 32).toFixed(1)}°${unit === 'celsius' ? 'C' : 'F'}`, icon: Thermometer, sub: `Max: ${daily.temperature_2m_max[0]}° Min: ${daily.temperature_2m_min[0]}°` },
      { id: 2, title: 'Precipitation', value: `${daily.precipitation_sum[0]} mm`, icon: CloudRain, sub: `${daily.precipitation_probability_max[0]}% Probability` },
      { id: 3, title: 'Humidity', value: `${hourly.relative_humidity_2m[currentHourIndex]}%`, icon: Droplets, sub: 'Relative Humidity' },
      { id: 4, title: 'UV Index', value: daily.uv_index_max[0], icon: Zap, sub: 'Maximum Index' },
      { id: 5, title: 'Wind', value: `${daily.wind_speed_10m_max[0]} km/h`, icon: Wind, sub: 'Maximum Speed' },
      { id: 6, title: 'Sun Cycle', value: format(new Date(daily.sunrise[0]), 'HH:mm'), icon: Sunrise, sub: `Sunset: ${format(new Date(daily.sunset[0]), 'HH:mm')}` },
    ];
  }, [weatherData, unit, currentHourIndex]);

  const aqVars = useMemo(() => {
    if (!airQualityData) return null;
    const h = airQualityData.hourly;
    const idx = currentHourIndex;

    return [
      { id: 'aqi', title: 'AQI', value: h.european_aqi[idx], sub: 'European Index' },
      { id: 'pm10', title: 'PM10', value: `${h.pm10[idx]} μg/m³`, sub: 'Particulate Matter' },
      { id: 'pm2.5', title: 'PM2.5', value: `${h.pm2_5[idx]} μg/m³`, sub: 'Fine Particles' },
      { id: 'co', title: 'CO', value: `${h.carbon_monoxide[idx]} μg/m³`, sub: 'Carbon Monoxide' },
      { id: 'co2', title: 'CO2', value: `${h.carbon_dioxide[idx]} ppm`, sub: 'Carbon Dioxide' },
      { id: 'no2', title: 'NO2', value: `${h.nitrogen_dioxide[idx]} μg/m³`, sub: 'Nitrogen Dioxide' },
      { id: 'so2', title: 'SO2', value: `${h.sulphur_dioxide[idx]} μg/m³`, sub: 'Sulphur Dioxide' },
      { id: 'oz', title: 'Ozone', value: `${h.ozone[idx]} μg/m³`, sub: 'O3 Levels' },
    ];
  }, [airQualityData, currentHourIndex]);

  const hourlyCategories = useMemo(() => {
    if (!weatherData) return [];
    return weatherData.hourly.time.slice(0, 24).map(t => format(new Date(t), 'HH:00'));
  }, [weatherData]);

  if (loading) return (
    <div className="animate-fade-in space-y-8">
      <header className="mb-4">
        <SkeletonBox height="40px" width="40%" className="mb-2" />
        <SkeletonBox height="16px" width="20%" />
      </header>
      <GridSkeleton count={6} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="glass-card border-red-500/50 p-8 text-center max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-2 text-white">Oops! Something went wrong</h2>
        <p className="text-text-muted">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-12 pb-12">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {cityName}
          </h1>
          <p className="text-text-muted flex items-center gap-2 font-medium">
            <Navigation size={14} className="text-primary" /> 
            {format(new Date(), 'EEEE, dd MMMM yyyy')}
          </p>
        </div>
      </header>

      {/* Weather Variable Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {currentVars?.map(v => (
          <GlassCard key={v.id} className="text-center group relative overflow-hidden flex flex-col items-center justify-center p-6 !rounded-2xl border-white/5 hover:border-primary/30">
             <div className="mb-4 bg-primary/5 p-3 rounded-2xl text-primary group-hover:scale-110 transition-transform">
               <v.icon size={32} strokeWidth={2.5} />
             </div>
             <h4 className="text-10px font-black text-text-muted uppercase tracking-widest mb-1">{v.title}</h4>
             <p className="text-2xl font-black text-text-main mb-1">{v.value}</p>
             <p className="text-10px text-text-muted font-bold opacity-80">{v.sub}</p>
          </GlassCard>
        ))}
      </section>

      {/* Air Quality Grid */}
      <section>
        <h2 className="text-xl font-black mb-6 flex items-center gap-3 opacity-90">
          <div className="p-1.5 bg-secondary/20 rounded-lg"><Activity size={20} className="text-secondary" /></div> 
          Air Quality Index
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4">
          {aqVars?.map(v => (
             <GlassCard key={v.id} className="p-4 text-center !rounded-xl border-white/5 hover:bg-white/5">
                <h4 className="text-9px font-black text-text-muted uppercase tracking-wider mb-2">{v.title}</h4>
                <p className="text-lg font-black text-text-main">{v.value}</p>
                <div className="mt-2 text-8px text-text-muted font-bold bg-white/5 py-1 rounded-md">{v.sub}</div>
             </GlassCard>
          ))}
        </div>
      </section>

      {/* Hourly Forecast Charts */}
      <section className="space-y-6">
        <h2 className="text-xl font-black flex items-center gap-3 opacity-90">
          <div className="p-1.5 bg-primary/20 rounded-lg"><TrendingUp size={20} className="text-primary" /></div> 
          Environmental Forecasts
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Temperature Forecast">
          <ChartComponent 
            series={[{ name: 'Temp', data: weatherData.hourly.temperature_2m.slice(0, 24).map(v => unit === 'celsius' ? v : (v * 9/5 + 32).toFixed(1)) }]} 
            categories={hourlyCategories}
            yAxisTitle={`Value (${unit === 'celsius' ? '°C' : '°F'})`}
            colors={['#38bdf8']}
          />
        </GlassCard>

        <GlassCard title="Precipitation & Humidity">
          <ChartComponent 
            series={[
              { name: 'Humidity (%)', type: 'line', data: weatherData.hourly.relative_humidity_2m.slice(0, 24) },
              { name: 'Precipitation (mm)', type: 'bar', data: weatherData.hourly.precipitation.slice(0, 24) }
            ]} 
            categories={hourlyCategories}
            yAxisTitle="Value"
            colors={['#818cf8', '#38bdf8']}
          />
        </GlassCard>

        <GlassCard title="Visibility & Wind">
          <ChartComponent 
            series={[
              { name: 'Visibility (m)', data: weatherData.hourly.visibility.slice(0, 24) },
              { name: 'Wind Speed (km/h)', data: weatherData.hourly.wind_speed_10m.slice(0, 24) }
            ]} 
            categories={hourlyCategories}
            yAxisTitle="Value"
            colors={['#fbbf24', '#f472b6']}
          />
        </GlassCard>

        <GlassCard title="Particulate Matter (PM10 & PM2.5)">
          <ChartComponent 
            series={[
              { name: 'PM10', data: airQualityData.hourly.pm10.slice(0, 24) },
              { name: 'PM2.5', data: airQualityData.hourly.pm2_5.slice(0, 24) }
            ]} 
            categories={hourlyCategories}
            yAxisTitle="μg/m³"
            colors={['#2dd4bf', '#fb923c']}
          />
        </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
