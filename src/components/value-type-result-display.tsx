
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
        badge: 'bg-red-500 hover:bg-red-500/90 text-white border-red-700',
      };
    case 'mid':
      return {
        badge: 'bg-yellow-400 hover:bg-yellow-400/90 text-yellow-900 border-yellow-600',
      };
    case 'low':
      return {
        badge: 'bg-green-500 hover:bg-green-500/90 text-white border-green-700',
      };
    default:
      return {
        badge: 'bg-secondary text-secondary-foreground border-transparent',
      };
  }
};

export function ValueTypeResultDisplay({ results, isLoading, error }: ValueTypeResultDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg border-primary/10 max-w-xs mx-auto">
        <CardHeader className="bg-primary/5 rounded-t-lg py-4">
          <CardTitle className="text-xl font-semibold text-center text-primary">
            Generating Analysis...
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {VALUE_TYPES_CONFIG.map(category => (
            <div key={`skeleton-${category.id}`} className="py-2.5 flex items-center justify-between border-b last:border-b-0 animate-pulse">
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 mr-2.5 rounded-full bg-muted-foreground/20" />
                <Skeleton className="h-4 w-20 bg-muted-foreground/20" />
              </div>
              <Skeleton className="h-6 w-14 rounded-md bg-muted-foreground/20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
       <Card className="mt-8 shadow-lg border-destructive max-w-xs mx-auto">
        <CardHeader className="py-3">
          <CardTitle className="text-lg font-semibold text-destructive flex items-center justify-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <p className="text-destructive-foreground bg-destructive/10 p-3 rounded-md text-xs">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <Card className="mt-8 shadow-lg border-primary/10 max-w-xs mx-auto">
      <CardHeader className="bg-primary/5 rounded-t-lg py-4">
        <CardTitle className="text-xl font-semibold text-center text-primary">
          Value Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-0"> {/* Removed space-y-4, border-b will handle spacing */}
          {(Object.keys(results) as ValueCategoryKey[]).map(key => {
            const categoryConfig = VALUE_TYPES_CONFIG.find(c => c.id === key);
            const value = results[key];
            if (!categoryConfig) return null;

            const Icon = categoryConfig.icon;
            const styles = getValueStyles(value);

            return (
              <div key={key} className="py-2.5 flex items-center justify-between border-b last:border-b-0">
                <div className="flex items-center">
                  <Icon className="mr-2.5 h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">{categoryConfig.label}</span>
                </div>
                <Badge
                  variant="default"
                  className={`capitalize text-xs font-semibold px-2 py-0.5 border ${styles.badge}`}
                >
                  {value}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
