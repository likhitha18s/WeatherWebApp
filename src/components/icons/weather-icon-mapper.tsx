"use client";

import type { WeatherCondition } from '@/types/weather';
import {
  Sun, Cloud, CloudSun, CloudMoon, CloudRain, CloudSnow, Wind, CloudFog, CloudLightning, CloudDrizzle, CloudSunRain, CloudMoonRain, Thermometer, Droplets, Eye, Sunrise, Sunset, Gauge, CloudHail, HazeIcon
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface WeatherIconMapperProps extends LucideProps {
  condition: WeatherCondition;
  isDay?: boolean;
}

const WeatherIconMapper: React.FC<WeatherIconMapperProps> = ({ condition, isDay = true, ...props }) => {
  const iconProps = { size: props.size || 48, ...props };

  switch (condition) {
    case 'Sunny':
      return <Sun {...iconProps} className={cn("text-yellow-500", props.className)} />;
    case 'Cloudy':
      return <Cloud {...iconProps} className={cn("text-gray-500", props.className)} />;
    case 'PartlyCloudyDay':
      return <CloudSun {...iconProps} className={cn("text-yellow-500", props.className)} />;
    case 'PartlyCloudyNight':
      return <CloudMoon {...iconProps} className={cn("text-slate-400", props.className)} />;
    case 'Rainy':
      if (isDay) return <CloudSunRain {...iconProps} className={cn("text-blue-500", props.className)} />;
      return <CloudMoonRain {...iconProps} className={cn("text-blue-400", props.className)} />;
    case 'Snowy':
      return <CloudSnow {...iconProps} className={cn("text-sky-400", props.className)} />;
    case 'Windy':
      return <Wind {...iconProps} className={cn("text-teal-500", props.className)} />;
    case 'Foggy':
      return <CloudFog {...iconProps} className={cn("text-gray-400", props.className)} />;
    case 'Haze':
      return <HazeIcon {...iconProps} className={cn("text-amber-400", props.className)} />;
    case 'Thunderstorm':
      return <CloudLightning {...iconProps} className={cn("text-purple-500", props.className)} />;
    case 'Drizzly':
      return <CloudDrizzle {...iconProps} className={cn("text-blue-300", props.className)} />;
    default:
      return <Cloud {...iconProps} className={cn("text-gray-500", props.className)} />;
  }
};

export const TemperatureIcon: React.FC<LucideProps> = (props) => <Thermometer {...props} className={cn("text-red-500", props.className)} />;
export const HumidityIcon: React.FC<LucideProps> = (props) => <Droplets {...props} className={cn("text-blue-500", props.className)} />;
export const WindSpeedIcon: React.FC<LucideProps> = (props) => <Wind {...props} className={cn("text-teal-500", props.className)} />;
export const PressureIcon: React.FC<LucideProps> = (props) => <Gauge {...props} className={cn("text-slate-500", props.className)} />;
export const VisibilityIcon: React.FC<LucideProps> = (props) => <Eye {...props} className={cn("text-purple-500", props.className)} />;
export const SunriseIcon: React.FC<LucideProps> = (props) => <Sunrise {...props} className={cn("text-orange-400", props.className)} />;
export const SunsetIcon: React.FC<LucideProps> = (props) => <Sunset {...props} className={cn("text-orange-600", props.className)} />;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}


export default WeatherIconMapper;
