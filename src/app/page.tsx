
"use client";

import { useState, useEffect } from 'react';
import { LocationInputForm } from '@/components/location-input-form';
import { WeatherDisplay } from '@/components/weather-display';
import { WeatherSkeleton } from '@/components/weather-skeleton';
import { getCurrentWeather, getForecast, getWeatherByCoords } from '@/lib/weather-api';
import type { CurrentWeather, ForecastDay } from '@/types/weather';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function HomePage() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWeatherData = async (location: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [currentData, forecastData] = await Promise.all([
        getCurrentWeather(location),
        getForecast(location)
      ]);
      setCurrentWeather(currentData);
      setForecast(forecastData);
    } catch (err: any) {
      const errorMessage = err.message || "An unknown error occurred.";
      setError(errorMessage);

      let toastTitle = "Uh oh! Something went wrong.";
      let toastDescription = errorMessage;

      if (errorMessage.toLowerCase().includes("no matching location found")) {
        toastTitle = "Location Not Found";
        toastDescription = "The location you entered could not be found. Please check the spelling or try a different city or zip code.";
      } else if (errorMessage.toLowerCase().includes("api key")) {
        toastTitle = "API Error";
        toastDescription = "There's an issue with the weather service configuration. Please try again later.";
      }
      
      toast({
        variant: "destructive",
        title: toastTitle,
        description: toastDescription,
      });
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSubmit = (location: string) => {
    fetchWeatherData(location);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      toast({
        variant: "destructive",
        title: "Geolocation Error",
        description: "Geolocation is not supported by your browser.",
      });
      return;
    }

    setIsGeolocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const {current, forecast: forecastData} = await getWeatherByCoords(latitude, longitude);
          setCurrentWeather(current);
          setForecast(forecastData);
        } catch (err: any) {
          const errorMessage = err.message || "Failed to fetch weather for your location.";
          setError(errorMessage);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: errorMessage,
          });
          setCurrentWeather(null);
          setForecast(null);
        } finally {
          setIsGeolocating(false);
        }
      },
      (err) => {
        let description = "Could not determine your location.";
        if (err.code === err.PERMISSION_DENIED) {
          description = "Geolocation permission denied. Please enable location services in your browser settings.";
        } else if (err.message) {
          description = err.message;
        }
        setError(description);
        toast({
          variant: "destructive",
          title: "Geolocation Error",
          description: description,
        });
        setIsGeolocating(false);
        setCurrentWeather(null); 
        setForecast(null);
      }
    );
  };
  
  useEffect(() => {
    // No initial fetch; user interaction required.
  }, []);


  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center min-h-screen bg-background text-foreground">
      <header className="w-full max-w-2xl mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary drop-shadow-sm">
          WeatherWise
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Your friendly weather companion.
        </p>
      </header>
      
      <section aria-labelledby="location-search-heading" className="w-full max-w-lg mb-10 p-6 bg-card rounded-xl shadow-xl">
        <h2 id="location-search-heading" className="sr-only">Search for weather by location</h2>
        <LocationInputForm 
          onLocationSubmit={handleLocationSubmit} 
          onGeolocate={handleGeolocate}
          isLoading={isLoading && !isGeolocating}
          isGeolocating={isGeolocating}
          currentLocationName={currentWeather?.location}
        />
      </section>

      { (isLoading || isGeolocating) && <WeatherSkeleton /> }

      { !isLoading && !isGeolocating && error && (
        <Alert variant="destructive" className="w-full max-w-md mb-8 animate-fade-in-up">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      { !isLoading && !isGeolocating && !error && currentWeather && forecast && (
        <section aria-live="polite" className="w-full max-w-4xl">
          <WeatherDisplay currentWeather={currentWeather} forecast={forecast} />
        </section>
      )}
      
      { !isLoading && !isGeolocating && !error && !currentWeather && (
         <div className="text-center text-muted-foreground mt-10 animate-fade-in-up">
            <p className="text-xl">Welcome to WeatherWise!</p>
            <p>Enter a location or use your current location to get the latest weather updates.</p>
          </div>
      )}

      <footer className="w-full max-w-2xl mt-auto pt-8 pb-4 text-center text-muted-foreground text-sm">
        <p>Created by S. Likhitha, CSE, MVGR college</p>
      </footer>
    </div>
  );
}
