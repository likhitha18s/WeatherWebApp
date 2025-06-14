"use client";

import type { CurrentWeather } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import WeatherIconMapper, { TemperatureIcon, HumidityIcon, WindSpeedIcon, PressureIcon, VisibilityIcon, SunriseIcon, SunsetIcon } from '@/components/icons/weather-icon-mapper';
import { format } from 'date-fns';

interface CurrentWeatherCardProps {
  data: CurrentWeather;
}

export function CurrentWeatherCard({ data }: CurrentWeatherCardProps) {
  return (
    <Card className="w-full shadow-lg animate-fade-in-up">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-headline text-primary">{data.location}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a")}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex flex-col items-center md:items-start">
          <WeatherIconMapper condition={data.condition} isDay={data.isDay} size={100} className="mb-2" />
          <p className="text-6xl font-bold text-foreground">{Math.round(data.temperature)}°C</p>
          <p className="text-lg text-muted-foreground capitalize">{data.description}</p>
          <p className="text-sm text-muted-foreground">Feels like {Math.round(data.feelsLike)}°C</p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <InfoItem icon={<HumidityIcon size={20} />} label="Humidity" value={`${data.humidity}%`} />
          <InfoItem icon={<WindSpeedIcon size={20} />} label="Wind Speed" value={`${data.windSpeed} km/h`} />
          <InfoItem icon={<PressureIcon size={20} />} label="Pressure" value={`${data.pressure} hPa`} />
          <InfoItem icon={<VisibilityIcon size={20} />} label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} />
          <InfoItem icon={<SunriseIcon size={20} />} label="Sunrise" value={format(new Date(data.sunrise), 'h:mm a')} />
          <InfoItem icon={<SunsetIcon size={20} />} label="Sunset" value={format(new Date(data.sunset), 'h:mm a')} />
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2 p-2 bg-background rounded-md shadow-sm border border-border/50">
    <span className="text-primary">{icon}</span>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  </div>
);
