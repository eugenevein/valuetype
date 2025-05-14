
"use client";

import type { DetermineValueTypeOutput } from '@/ai/flows/determine-value-type';
import { VALUE_TYPES_CONFIG, type ValueCategoryKey } from '@/config/value-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

interface ValueTypeResultDisplayProps {
  results: DetermineValueTypeOutput | null;
  isLoading: boolean;
  error?: string | null;
}

const getValueStyles = (value: 'high' | 'mid' | 'low') => {
  switch (value) {
    case 'high':
      return {
        card: 'bg-red-200 border-red-400 text-red-900',
        badge: 'bg-red-500 text-white border-red-700',
      };
    case 'mid':
      return {
        card: 'bg-yellow-100 border-yellow-300 text-yellow-900',
        badge: 'bg-yellow-400 text-yellow-900 border-yellow-600',
      };
    case 'low':
      return {
        card: 'bg-green-100 border-green-300 text-green-900',
        badge: 'bg-green-500 text-white border-green-700',
      };
    default: // Should not happen with strict typing, but as a fallback
      return {
        card: 'bg-card border-border text-card-foreground',
        badge: 'bg-secondary text-secondary-foreground border-transparent',
      };
  }
};

export function ValueTypeResultDisplay({ results, isLoading, error }: ValueTypeResultDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Generated Value Types</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUE_TYPES_CONFIG.map(category => (
            <Card key={`skeleton-${category.id}`} className="bg-card">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Skeleton className="h-7 w-7 mr-3 rounded-full" />
                  <Skeleton className="h-6 w-3/5" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
       <Card className="mt-8 shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-destructive flex items-center">
            <AlertTriangle className="mr-2 h-6 w-6" />
            Error Generating Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground bg-destructive/10 p-4 rounded-md">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <Card className="mt-10 shadow-xl border-2 border-primary/20">
      <CardHeader className="bg-primary/5 rounded-t-lg">
        <CardTitle className="text-3xl font-bold text-center text-primary tracking-tight">
          Value Type Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(results) as ValueCategoryKey[]).map(key => {
            const categoryConfig = VALUE_TYPES_CONFIG.find(c => c.id === key);
            const value = results[key];
            if (!categoryConfig) return null;

            const Icon = categoryConfig.icon;
            const styles = getValueStyles(value);

            return (
              <Card key={key} className={`shadow-md hover:shadow-lg transition-shadow duration-300 border ${styles.card}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-xl font-semibold">
                    <Icon className="mr-3 h-6 w-6" /> {/* Icon inherits text color from styles.card */}
                    {categoryConfig.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge 
                    variant="default" // Use default variant and override with specific styles
                    className={`capitalize text-lg font-medium px-4 py-1 border-2 ${styles.badge}`}
                  >
                    {value} Impact
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
