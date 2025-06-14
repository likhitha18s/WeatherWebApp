"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function WeatherSkeleton() {
  return (
    <div className="space-y-8 w-full max-w-4xl animate-pulse">
      <Card className="w-full shadow-lg">
        <CardHeader className="pb-2">
          <Skeleton className="h-8 w-3/5 mb-2" /> 
          <Skeleton className="h-4 w-2/5" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center md:items-start">
            <Skeleton className="h-24 w-24 rounded-full mb-2" />
            <Skeleton className="h-16 w-32 mb-1" />
            <Skeleton className="h-6 w-40 mb-1" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2 p-2 bg-muted/50 rounded-md">
                <Skeleton className="h-5 w-5 rounded" />
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div>
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <Card key={index} className="w-full shadow-md">
              <CardHeader className="p-3 text-center border-b">
                <Skeleton className="h-5 w-3/4 mx-auto mb-1" />
                <Skeleton className="h-3 w-1/2 mx-auto" />
              </CardHeader>
              <CardContent className="p-3 flex flex-col items-center space-y-1">
                <Skeleton className="h-10 w-10 rounded-full mb-1" />
                <Skeleton className="h-6 w-12 mb-1" />
                <Skeleton className="h-4 w-10 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
