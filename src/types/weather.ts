export type WeatherCondition = 
  | 'Sunny'
  | 'Cloudy'
  | 'PartlyCloudyDay'
  | 'PartlyCloudyNight'
  | 'Rainy'
  | 'Snowy'
  | 'Windy'
  | 'Foggy'
  | 'Thunderstorm'
  | 'Drizzly'
  | 'Haze';

export interface CurrentWeather {
  location: string;
  temperature: number; // Celsius
  feelsLike: number; // Celsius
  humidity: number; // Percentage
  windSpeed: number; // km/h
  description: string; 
  condition: WeatherCondition; 
  isDay: boolean;
  sunrise: number; // timestamp
  sunset: number; // timestamp
  pressure: number; // hPa
  visibility: number; // meters
}

export interface ForecastDay {
  date: number; // timestamp
  highTemp: number; // Celsius
  lowTemp: number; // Celsius
  description: string;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
}
