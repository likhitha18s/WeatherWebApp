"use client";

import type { CurrentWeather, ForecastDay } from '@/types/weather';
import { CurrentWeatherCard } from './current-weather-card';
import { ForecastItem } from './forecast-item';

interface WeatherDisplayProps {
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
}

export function WeatherDisplay({ currentWeather, forecast }: WeatherDisplayProps) {
  return (
    <div className="space-y-8 w-full animate-fade-in-up">
      <CurrentWeatherCard data={currentWeather} />
      
      <div>
        <h2 className="text-2xl font-headline font-semibold mb-4 text-primary">5-Day Forecast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {forecast.map((day, index) => (
            <ForecastItem key={index} data={day} />
          ))}
        </div>
      </div>
    </div>
  );
}
