'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  timezone: number;
  sunrise: number;
  sunset: number;
}

// Weather Icon Components
const SunIcon = () => (
  <svg className="w-32 h-32 text-yellow-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"/>
  </svg>
);

const MoonIcon = () => (
  <svg className="w-32 h-32 text-blue-200 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

const CloudIcon = () => (
  <svg className="w-32 h-32 text-gray-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
  </svg>
);

const RainIcon = () => (
  <svg className="w-32 h-32 text-blue-400 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 19v2m4-2v2m4-2v2" />
  </svg>
);

const ThunderstormIcon = () => (
  <svg className="w-32 h-32 text-yellow-300 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10l-3 6h4l-3 6" fill="currentColor"/>
  </svg>
);

const SnowIcon = () => (
  <svg className="w-32 h-32 text-blue-100 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    <circle cx="8" cy="20" r="1" fill="currentColor"/>
    <circle cx="12" cy="19" r="1" fill="currentColor"/>
    <circle cx="16" cy="20" r="1" fill="currentColor"/>
    <circle cx="10" cy="21" r="1" fill="currentColor"/>
    <circle cx="14" cy="21" r="1" fill="currentColor"/>
  </svg>
);

const FogIcon = () => (
  <svg className="w-32 h-32 text-gray-400 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14h16M4 18h12M4 10h10" />
  </svg>
);

const CloudSunIcon = () => (
  <svg className="w-32 h-32 text-yellow-300 drop-shadow-lg" fill="none" viewBox="0 0 24 24">
    <circle cx="16" cy="8" r="3" fill="currentColor" className="text-yellow-400"/>
    <path d="M16 1v2m5.66 1.34l-1.41 1.41M23 8h-2m-1.34 5.66l-1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-yellow-400"/>
    <path d="M14 14h-1.26A6 6 0 106 20h8a4 4 0 000-8z" fill="currentColor" className="text-gray-300"/>
  </svg>
);

// Helper function to get weather icon based on description and actual time
const getWeatherIcon = (description: string, icon: string, sunrise: number, sunset: number) => {
  const desc = description.toLowerCase();

  // Determine if it's actually night time based on sunrise/sunset
  const now = Date.now() / 1000; // Current time in seconds (UTC)
  const isNight = now < sunrise || now > sunset;

  // Clear
  if (desc.includes('clear')) {
    return isNight ? <MoonIcon /> : <SunIcon />;
  }
  // Thunderstorm
  if (desc.includes('thunder') || desc.includes('storm')) {
    return <ThunderstormIcon />;
  }
  // Rain/Drizzle
  if (desc.includes('rain') || desc.includes('drizzle')) {
    return <RainIcon />;
  }
  // Snow
  if (desc.includes('snow') || desc.includes('sleet')) {
    return <SnowIcon />;
  }
  // Fog/Mist
  if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) {
    return <FogIcon />;
  }
  // Partly cloudy
  if (desc.includes('few clouds') || desc.includes('scattered')) {
    return <CloudSunIcon />;
  }
  // Cloudy
  if (desc.includes('cloud') || desc.includes('overcast')) {
    return <CloudIcon />;
  }

  // Default based on time
  return isNight ? <MoonIcon /> : <CloudSunIcon />;
};

// Helper function to get time of day and progress through it
const getTimeOfDay = (timezone: number, sunrise: number, sunset: number) => {
  const now = Date.now() / 1000; // Current time in seconds

  // Dawn period: 1.5 hours before sunrise to sunrise
  const dawnStart = sunrise - 5400;
  const dawnEnd = sunrise;

  // Day period: sunrise to sunset
  const dayStart = sunrise;
  const dayEnd = sunset;

  // Dusk period: sunset to 1.5 hours after sunset
  const duskStart = sunset;
  const duskEnd = sunset + 5400;

  // Calculate progress through each period (0 to 1)
  let period = 'night';
  let progress = 0;

  if (now >= dawnStart && now < dawnEnd) {
    period = 'dawn';
    progress = (now - dawnStart) / (dawnEnd - dawnStart);
  } else if (now >= dayStart && now < dayEnd) {
    period = 'day';
    progress = (now - dayStart) / (dayEnd - dayStart);
  } else if (now >= duskStart && now < duskEnd) {
    period = 'dusk';
    progress = (now - duskStart) / (duskEnd - duskStart);
  } else {
    period = 'night';
    // Calculate progress through night
    const nightStart = duskEnd;
    const nextDawnStart = sunrise + 86400 - 5400; // Next day's dawn

    if (now >= nightStart) {
      progress = (now - nightStart) / (nextDawnStart - nightStart);
    } else {
      // Before sunrise (early morning)
      const prevDuskEnd = sunset - 86400 + 5400;
      progress = (now - prevDuskEnd) / (dawnStart - prevDuskEnd);
    }
  }

  return { period, progress: Math.max(0, Math.min(1, progress)) };
};

// Helper function to get gradual sky color based on weather and time of day
const getSkyColor = (description: string, timezone: number, sunrise: number, sunset: number) => {
  const desc = description.toLowerCase();
  const { period, progress } = getTimeOfDay(timezone, sunrise, sunset);

  // Define color palettes for different times of day
  let skyGradient, grassGradient;

  // Get base colors based on period and progress
  switch (period) {
    case 'dawn':
      // Transition from night to day (dark -> pink/orange -> bright)
      if (progress < 0.3) {
        // Early dawn: dark blue to purple
        skyGradient = 'from-indigo-900 via-purple-800 to-orange-900';
        grassGradient = 'from-green-900 to-green-800';
      } else if (progress < 0.7) {
        // Mid dawn: purple to pink/orange
        skyGradient = 'from-orange-400 via-pink-400 to-blue-500';
        grassGradient = 'from-green-800 to-green-700';
      } else {
        // Late dawn: approaching full daylight
        skyGradient = 'from-orange-300 via-sky-300 to-blue-400';
        grassGradient = 'from-green-700 to-green-600';
      }
      break;

    case 'day':
      // Bright daytime, slight variation throughout the day
      if (progress < 0.3) {
        // Morning: fresh, bright
        skyGradient = 'from-sky-300 to-blue-400';
        grassGradient = 'from-green-600 to-green-700';
      } else if (progress < 0.7) {
        // Midday: brightest
        skyGradient = 'from-sky-400 to-blue-500';
        grassGradient = 'from-green-600 to-green-700';
      } else {
        // Late afternoon: slightly warmer
        skyGradient = 'from-sky-400 via-blue-400 to-blue-600';
        grassGradient = 'from-green-600 to-green-700';
      }
      break;

    case 'dusk':
      // Transition from day to night (bright -> orange/purple -> dark)
      if (progress < 0.3) {
        // Early dusk: golden hour
        skyGradient = 'from-orange-400 via-amber-400 to-blue-600';
        grassGradient = 'from-green-700 to-green-800';
      } else if (progress < 0.7) {
        // Mid dusk: vibrant sunset colors
        skyGradient = 'from-orange-500 via-purple-500 to-indigo-800';
        grassGradient = 'from-green-800 to-green-900';
      } else {
        // Late dusk: approaching night
        skyGradient = 'from-purple-900 via-indigo-900 to-black';
        grassGradient = 'from-green-900 to-black';
      }
      break;

    case 'night':
      // Deep night colors
      skyGradient = 'from-indigo-950 to-black';
      grassGradient = 'from-green-950 to-black';
      break;

    default:
      skyGradient = 'from-sky-400 to-blue-500';
      grassGradient = 'from-green-600 to-green-700';
  }

  // Adjust for weather conditions
  // Thunderstorm (overrides time of day)
  if (desc.includes('thunder') || desc.includes('storm')) {
    return { sky: 'from-gray-800 to-gray-900', grass: 'from-green-900 to-black' };
  }

  // Rain - darken the sky but keep time-based variations
  if (desc.includes('rain') || desc.includes('drizzle')) {
    if (period === 'night') {
      return { sky: 'from-slate-900 to-black', grass: 'from-green-900 to-black' };
    } else if (period === 'dawn' || period === 'dusk') {
      return { sky: 'from-slate-600 via-slate-700 to-slate-800', grass: 'from-green-800 to-green-900' };
    }
    return { sky: 'from-slate-600 to-slate-700', grass: 'from-green-800 to-green-900' };
  }

  // Snow
  if (desc.includes('snow') || desc.includes('sleet')) {
    if (period === 'night') {
      return { sky: 'from-blue-950 to-slate-900', grass: 'from-blue-100 to-slate-200' };
    } else if (period === 'dawn' || period === 'dusk') {
      return { sky: 'from-blue-200 via-purple-200 to-blue-300', grass: 'from-white to-blue-100' };
    }
    return { sky: 'from-blue-100 to-blue-200', grass: 'from-white to-blue-50' };
  }

  // Fog/Mist
  if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) {
    if (period === 'night') {
      return { sky: 'from-gray-800 to-gray-950', grass: 'from-gray-700 to-gray-900' };
    } else if (period === 'dawn' || period === 'dusk') {
      return { sky: 'from-gray-400 via-gray-500 to-gray-600', grass: 'from-gray-500 to-gray-700' };
    }
    return { sky: 'from-gray-300 to-gray-400', grass: 'from-gray-500 to-gray-600' };
  }

  // Clouds - slightly darken the base sky
  if (desc.includes('cloud') || desc.includes('overcast')) {
    if (period === 'night') {
      return { sky: 'from-slate-900 to-black', grass: 'from-green-900 to-black' };
    } else if (period === 'dawn') {
      return { sky: 'from-gray-500 via-purple-400 to-slate-600', grass: grassGradient };
    } else if (period === 'dusk') {
      return { sky: 'from-orange-600 via-purple-500 to-slate-700', grass: grassGradient };
    }
    return { sky: 'from-gray-400 to-gray-500', grass: 'from-green-700 to-green-800' };
  }

  // Clear - return time-based colors
  return { sky: skyGradient, grass: grassGradient };
};

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [skyColor, setSkyColor] = useState({ sky: 'from-blue-400 to-blue-500', grass: 'from-green-600 to-green-700' });

  const fetchWeatherByCoords = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(`/api/weather-by-coords?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      setWeather(data);
      setCity(data.location);
      setSkyColor(getSkyColor(data.description, data.timezone, data.sunrise, data.sunset));
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setAutoDetecting(false);
    }
  };

  const fetchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      setWeather(data);
      setSkyColor(getSkyColor(data.description, data.timezone, data.sunrise, data.sunset));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    if ('geolocation' in navigator) {
      setAutoDetecting(true);
      setLoading(true);
      setError('');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // If timeout, try one more time with cached position
          if (error.code === 3) {
            console.log('Retrying with maximumAge option...');
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
              },
              (retryError) => {
                console.error('Geolocation retry error:', retryError);
                setError('Unable to detect your location. Please check your browser permissions and try again.');
                setLoading(false);
                setAutoDetecting(false);
              },
              {
                timeout: 30000,
                maximumAge: 60000,
                enableHighAccuracy: false
              }
            );
          } else {
            setError('Unable to detect your location. Please check your browser permissions.');
            setLoading(false);
            setAutoDetecting(false);
          }
        },
        {
          timeout: 15000,
          maximumAge: 0,
          enableHighAccuracy: false
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter a city manually.');
      setAutoDetecting(false);
    }
  };

  useEffect(() => {
    // Auto-detect location using IP-based geolocation
    const detectLocationByIP = async () => {
      setAutoDetecting(true);
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/detect-location');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to detect location');
        }

        // Use the detected coordinates to fetch weather
        if (data.latitude && data.longitude) {
          fetchWeatherByCoords(data.latitude, data.longitude);
        } else {
          throw new Error('Invalid location data');
        }
      } catch (err) {
        console.error('IP Geolocation error:', err);
        setLoading(false);
        setAutoDetecting(false);
        // Silently fail - user can search manually
      }
    };

    detectLocationByIP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Sky Background - Top 2/3 */}
      <div className={`absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b ${skyColor.sky} transition-all duration-1000 ease-in-out`}></div>

      {/* Grass Background - Bottom 1/3 with curved horizon */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 overflow-hidden">
        {/* Curved grass hill using radial gradient and border radius */}
        <div className={`absolute -bottom-20 left-1/2 -translate-x-1/2 w-[150%] h-[200%] bg-gradient-to-b ${skyColor.grass} transition-all duration-1000 ease-in-out rounded-t-[50%]`}>
          {/* Grass texture pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grass" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" strokeWidth="2" className="text-green-900"/>
                  <line x1="20" y1="5" x2="20" y2="25" stroke="currentColor" strokeWidth="2" className="text-green-900"/>
                  <line x1="30" y1="2" x2="30" y2="22" stroke="currentColor" strokeWidth="2" className="text-green-900"/>
                  <line x1="40" y1="7" x2="40" y2="27" stroke="currentColor" strokeWidth="2" className="text-green-900"/>
                  <line x1="50" y1="3" x2="50" y2="23" stroke="currentColor" strokeWidth="2" className="text-green-900"/>
                  <line x1="60" y1="8" x2="60" y2="28" stroke="currentColor" strokeWidth="2" className="text-green-900"/>
                  <line x1="70" y1="1" x2="70" y2="21" stroke="currentColor" strokeWidth="2" className="text-green-900"/>
                  <line x1="80" y1="6" x2="80" y2="26" stroke="currentColor" strokeWidth="2" className="text-green-900"/>
                  <line x1="90" y1="4" x2="90" y2="24" stroke="currentColor" strokeWidth="2" className="text-green-900"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grass)"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sun - only show for clear/sunny weather */}
        {weather?.description.toLowerCase().includes('clear') && !weather?.icon.endsWith('n') && (
          <div className="absolute top-10 right-10 animate-float">
            <svg className="w-24 h-24 text-yellow-300 opacity-40" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        {/* Moon - only show for clear night */}
        {weather?.description.toLowerCase().includes('clear') && weather?.icon.endsWith('n') && (
          <div className="absolute top-10 right-10 animate-float-slow">
            <svg className="w-24 h-24 text-blue-100 opacity-60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </div>
        )}

        {/* Floating Clouds - constrained to top 50% of screen to stay in sky */}
        <div className="absolute top-[10%] left-10 animate-drift opacity-30" style={{animationDelay: '0s'}}>
          <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
          </svg>
        </div>

        <div className="absolute top-[20%] right-20 animate-drift-slow opacity-20" style={{animationDelay: '-10s'}}>
          <svg className="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
          </svg>
        </div>

        <div className="absolute top-[15%] left-1/4 animate-drift opacity-25" style={{animationDelay: '-20s'}}>
          <svg className="w-28 h-28 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
          </svg>
        </div>

        <div className="absolute top-[35%] right-1/3 animate-drift-slow opacity-30" style={{animationDelay: '-30s'}}>
          <svg className="w-36 h-36 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
          </svg>
        </div>

        <div className="absolute top-[25%] left-1/2 animate-drift opacity-20" style={{animationDelay: '-40s'}}>
          <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
          </svg>
        </div>

        {/* Rain drops - only for rainy weather */}
        {(weather?.description.toLowerCase().includes('rain') || weather?.description.toLowerCase().includes('drizzle')) && (
          <>
            {/* Create multiple rain drops across the screen */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-12 bg-blue-400 animate-rain"
                style={{
                  left: `${(i * 5 + Math.random() * 5)}%`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: 0.6
                }}
              ></div>
            ))}
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Weather AI
          </h1>

          {autoDetecting && (
            <div className="mb-4 text-center">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Detecting your location...</span>
              </div>
            </div>
          )}

          <form onSubmit={fetchWeather} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Search'}
              </button>
            </div>
          </form>

          <button
            onClick={detectLocation}
            disabled={loading}
            className="w-full mb-6 px-4 py-2 bg-white border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Use My Precise Location
          </button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {weather && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {weather.location}
              </h2>

              <div className="flex items-center justify-center mb-4 animate-bounce">
                {getWeatherIcon(weather.description, weather.icon, weather.sunrise, weather.sunset)}
              </div>

              <div className="text-6xl font-bold text-gray-800 mb-2">
                {Math.round(weather.temperature)}°C
              </div>

              <div className="text-xl text-gray-600 capitalize mb-6">
                {weather.description}
              </div>

              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm text-gray-500">Humidity</div>
                  <div className="text-2xl font-semibold">{weather.humidity}%</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm text-gray-500">Wind Speed</div>
                  <div className="text-2xl font-semibold">{weather.windSpeed} m/s</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
