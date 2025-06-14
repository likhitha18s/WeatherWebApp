
import type { CurrentWeather, ForecastDay, WeatherCondition } from '@/types/weather';

// IMPORTANT: Move this API key to an environment variable (e.g., .env.local) in a real application!
// Example: const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const API_KEY = '7a05d9d12790440b8c963858251406';
const BASE_URL = 'https://api.weatherapi.com/v1'; // Changed to HTTPS

// Helper function to map API condition text to WeatherCondition type
const mapApiConditionToAppCondition = (apiConditionText: string, isDayApiFlag: number): WeatherCondition => {
  const text = apiConditionText.toLowerCase();
  const isDay = isDayApiFlag === 1;

  if (text.includes("thunder")) return 'Thunderstorm';
  if (text.includes("snow") || text.includes("sleet") || text.includes("blizzard") || text.includes("ice pellets")) return 'Snowy';
  if (text.includes("drizzle")) return 'Drizzly';
  if (text.includes("rain") || text.includes("shower")) return 'Rainy';
  if (text.includes("fog") || text.includes("mist")) return 'Foggy';
  if (text.includes("haze")) return 'Haze';
  if (text === "sunny") return 'Sunny';
  if (text === "clear") return isDay ? 'Sunny' : 'PartlyCloudyNight'; // Clear at night is often represented as 'Clear' or 'Partly Cloudy Night'
  if (text.includes("partly cloudy")) return isDay ? 'PartlyCloudyDay' : 'PartlyCloudyNight';
  if (text.includes("cloudy") || text.includes("overcast")) return 'Cloudy';
  
  // Default fallback if no specific match
  // Based on WeatherAPI docs, condition.text can be "Clear" for night.
  // is_day flag is crucial.
  if (isDayApiFlag === 1) return 'Sunny'; // Default to Sunny if is_day and unsure
  return 'PartlyCloudyNight'; // Default for night if unsure
};

// Helper to parse "HH:MM AM/PM" time string to timestamp for a given date epoch
const parseAstroTime = (astroTime: string, dateEpoch: number): number => {
  const dateForAstro = new Date(dateEpoch * 1000);
  const [time, modifier] = astroTime.split(' ');
  let [hoursStr, minutesStr] = time.split(':');
  
  let hours = parseInt(hoursStr, 10);
  let minutes = parseInt(minutesStr, 10);

  if (isNaN(hours) || isNaN(minutes) || !modifier) {
    // Fallback to the dateEpoch if parsing fails (e.g. astroTime is unexpected)
    // This might happen if API response for sunrise/sunset is missing or malformed
    console.warn(`Failed to parse astroTime: ${astroTime} for dateEpoch: ${dateEpoch}. Falling back to dateEpoch.`);
    return dateEpoch * 1000; 
  }

  if (modifier.toUpperCase() === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier.toUpperCase() === 'AM' && hours === 12) { // Midnight case: 12 AM is 00 hours
    hours = 0;
  }
  
  // Use the date part from dateEpoch and time part from astroTime
  const resultDate = new Date(dateForAstro.getFullYear(), dateForAstro.getMonth(), dateForAstro.getDate(), hours, minutes);
  return resultDate.getTime();
};


export const getCurrentWeather = async (location: string): Promise<CurrentWeather> => {
  if (!API_KEY) {
    throw new Error('Weather API key is not configured.');
  }
  // For current weather, also fetch 1 day forecast to get sunrise/sunset for today.
  const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=1`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Failed to fetch current weather data.');
    }

    const current = data.current;
    const forecastDay = data.forecast.forecastday[0]; // Today's forecast for astro data

    return {
      location: `${data.location.name}, ${data.location.region ? data.location.region + ', ' : ''}${data.location.country}`,
      temperature: current.temp_c,
      feelsLike: current.feelslike_c,
      humidity: current.humidity,
      windSpeed: current.wind_kph,
      description: current.condition.text,
      condition: mapApiConditionToAppCondition(current.condition.text, current.is_day),
      isDay: current.is_day === 1,
      sunrise: forecastDay?.astro?.sunrise ? parseAstroTime(forecastDay.astro.sunrise, forecastDay.date_epoch) : Date.now(),
      sunset: forecastDay?.astro?.sunset ? parseAstroTime(forecastDay.astro.sunset, forecastDay.date_epoch) : Date.now(),
      pressure: current.pressure_mb,
      visibility: current.vis_km * 1000, // Convert km to meters
    };
  } catch (error: any) {
    console.error("Error fetching current weather:", error);
    // Rethrow a more generic error or the original one.
    // It's important not to expose too many details of the internal error to the user.
    throw new Error(error.message || 'An unknown error occurred while fetching current weather.');
  }
};

export const getForecast = async (location: string): Promise<ForecastDay[]> => {
  if (!API_KEY) {
    throw new Error('Weather API key is not configured.');
  }
  // Request 5 days, API might cap it based on plan (free typically 3 days)
  const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=5`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Failed to fetch forecast data.');
    }

    return data.forecast.forecastday.map((dayData: any): ForecastDay => ({
      date: dayData.date_epoch * 1000,
      highTemp: dayData.day.maxtemp_c,
      lowTemp: dayData.day.mintemp_c,
      description: dayData.day.condition.text,
      // For daily forecast, assume 'day' for icon choice (isDay=1)
      condition: mapApiConditionToAppCondition(dayData.day.condition.text, 1), 
      humidity: dayData.day.avghumidity,
      windSpeed: dayData.day.maxwind_kph,
    }));
  } catch (error: any) {
    console.error("Error fetching forecast:", error);
    throw new Error(error.message || 'An unknown error occurred while fetching forecast data.');
  }
};

// Function to get both current weather and forecast for coordinates
export const getWeatherByCoords = async (lat: number, lon: number): Promise<{current: CurrentWeather, forecast: ForecastDay[]}> => {
  if (!API_KEY) {
    throw new Error('Weather API key is not configured.');
  }
  const locationQuery = `${lat},${lon}`;
  // Request 5 days for forecast part
  const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(locationQuery)}&days=5`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Failed to fetch weather data by coordinates.');
    }

    const current = data.current;
    const forecastDayToday = data.forecast.forecastday[0]; // Use today's forecast for sunrise/sunset

    const currentWeatherData: CurrentWeather = {
      location: `${data.location.name}, ${data.location.region ? data.location.region + ', ' : ''}${data.location.country}`,
      temperature: current.temp_c,
      feelsLike: current.feelslike_c,
      humidity: current.humidity,
      windSpeed: current.wind_kph,
      description: current.condition.text,
      condition: mapApiConditionToAppCondition(current.condition.text, current.is_day),
      isDay: current.is_day === 1,
      sunrise: forecastDayToday?.astro?.sunrise ? parseAstroTime(forecastDayToday.astro.sunrise, forecastDayToday.date_epoch) : Date.now(),
      sunset: forecastDayToday?.astro?.sunset ? parseAstroTime(forecastDayToday.astro.sunset, forecastDayToday.date_epoch) : Date.now(),
      pressure: current.pressure_mb,
      visibility: current.vis_km * 1000, // Convert km to meters
    };

    const forecastData: ForecastDay[] = data.forecast.forecastday.map((dayData: any): ForecastDay => ({
      date: dayData.date_epoch * 1000,
      highTemp: dayData.day.maxtemp_c,
      lowTemp: dayData.day.mintemp_c,
      description: dayData.day.condition.text,
      condition: mapApiConditionToAppCondition(dayData.day.condition.text, 1), // Assume day for forecast icons
      humidity: dayData.day.avghumidity,
      windSpeed: dayData.day.maxwind_kph,
    }));
    
    return {
      current: currentWeatherData,
      forecast: forecastData
    };
  } catch (error: any) {
    console.error("Error fetching weather by coords:", error);
    throw new Error(error.message || 'An unknown error occurred while fetching weather by coordinates.');
  }
};
