import React, { useEffect, useState } from 'react';
import './Weather.css';

import sun_icon   from '../assets/sun.png';
import rain_icon  from '../assets/barrish.png';
import night_icon from '../assets/night.png';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');

  // Map from weather.main → icon
  const iconByMain = {
    Clear:   sun_icon,
    Rain:    rain_icon,
    
    // …add more as you like
  };

  const APIkey = import.meta.env.VITE_APP_ID;

  // Reusable setter
  const applyWeatherData = (data) => {
    // pick based on data.weather[0].main
    const main = data.weather[0].main;
    const icon = iconByMain[main] || sun_icon; // default to sun

    setWeatherData({
      temperature: Math.round(data.main.temp),
      location:    data.name,
      icon,
    });
  };

  // fetch by coords
  const fetchByCoords = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    applyWeatherData(data);
  };

  // fetch by city
  const fetchByCity = async () => {
    if (!city) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    applyWeatherData(data);
  };

  // On mount, use geolocation or fallback
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => fetchByCoords(coords.latitude, coords.longitude),
        () => {
          setCity('New York');
          fetchByCity();
        }
      );
    } else {
      setCity('New York');
      fetchByCity();
    }
  }, []);

  return (
    <div className='Weather'>
      <div className="search-bar">
        <input
  type="text"
  placeholder="Search city…"
  value={city}
  onChange={e => setCity(e.target.value)}
  onKeyDown={e => {
    if (e.key === 'Enter') {
      fetchByCity();
    }
  }}
/>
        <button onClick={fetchByCity}>Search</button>
      </div>

      {/* Always render an icon */}
      <img
        src={weatherData ? weatherData.icon : sun_icon}
        alt="Weather Icon"
        className='Weather-icon'
      />

      {/* Show temp/location once loaded */}
      {weatherData && (
        <>
          <p className='temperature'>{weatherData.temperature}°C</p>
          <p className='location'>{weatherData.location}</p>
        </>
      )}
    </div>
  );
};

export default Weather;
