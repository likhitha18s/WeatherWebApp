
"use client";

import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, MapPin, Loader2 } from "lucide-react";

const formSchema = z.object({
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
});

interface LocationInputFormProps {
  onLocationSubmit: (location: string) => void;
  onGeolocate: () => void;
  isLoading: boolean;
  isGeolocating: boolean;
  currentLocationName?: string | null; // New prop
}

export function LocationInputForm({ onLocationSubmit, onGeolocate, isLoading, isGeolocating, currentLocationName }: LocationInputFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
    },
  });

  useEffect(() => {
    if (currentLocationName && form.getValues("location") !== currentLocationName) {
      form.setValue("location", currentLocationName, { shouldValidate: false });
    }
    // If currentLocationName is null/undefined (e.g. after an error or initial load with no weather)
    // and the form has a value, we might want to clear it.
    // However, let's not do this aggressively to avoid clearing user input unexpectedly.
    // If !currentLocationName and form has value, it means either user is typing or an error occurred.
  }, [currentLocationName, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onLocationSubmit(values.location);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Enter Location (City or Zip Code)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="e.g., New York or 90210" 
                    {...field} 
                    className="pl-10 text-base"
                    aria-label="Location"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground flex-grow" disabled={isLoading || isGeolocating}>
            {isLoading && !isGeolocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Search
          </Button>
          <Button type="button" variant="outline" onClick={onGeolocate} className="w-full sm:w-auto border-accent text-foreground hover:bg-accent/10 flex-grow" disabled={isLoading || isGeolocating}>
             {isGeolocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4 text-foreground" />}
            Use My Location
          </Button>
        </div>
      </form>
    </Form>
  );
}
