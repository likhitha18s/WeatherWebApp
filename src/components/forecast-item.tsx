"use client";

import type { ForecastDay } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeatherIconMapper, { HumidityIcon, WindSpeedIcon } from '@/components/icons/weather-icon-mapper';
import { format } from 'date-fns';

interface ForecastItemProps {
  data: ForecastDay;
}

export function ForecastItem({ data }: ForecastItemProps) {
  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 bg-card">
      <CardHeader className="p-3 text-center border-b">
        <CardTitle className="text-md font-headline text-primary">
          {format(new Date(data.date), 'EEE')}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{format(new Date(data.date), 'MMM d')}</p>
      </CardHeader>
      <CardContent className="p-3 flex flex-col items-center space-y-1">
        <WeatherIconMapper condition={data.condition} size={40} className="mb-1" />
        <p className="text-xl font-bold text-foreground">{Math.round(data.highTemp)}°C</p>
        <p className="text-sm text-muted-foreground">{Math.round(data.lowTemp)}°C</p>
        <p className="text-xs text-muted-foreground capitalize text-center h-8 overflow-hidden" title={data.description}>
          {data.description.length > 30 ? data.description.substring(0, 27) + "..." : data.description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground pt-1">
          <HumidityIcon size={14} className="mr-1" /> {data.humidity}%
          <WindSpeedIcon size={14} className="ml-2 mr-1" /> {data.windSpeed} km/h
        </div>
      </CardContent>
    </Card>
  );
}
