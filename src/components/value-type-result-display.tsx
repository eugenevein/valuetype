
"use client";

import type { DetermineValueTypeOutput } from '@/ai/flows/determine-value-type';
import { VALUE_TYPES_CONFIG, type ValueCategoryKey } from '@/config/value-types';
import { Card, CardContent } from '@/components/ui/card';
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
      return 'bg-red-500 hover:bg-red-500/90 text-white border-red-700';
    case 'mid':
      return 'bg-yellow-400 hover:bg-yellow-400/90 text-yellow-900 border-yellow-600';
    case 'low':
      return 'bg-green-500 hover:bg-green-500/90 text-white border-green-700';
    default:
      return 'bg-secondary text-secondary-foreground border-transparent';
  }
};

export function ValueTypeResultDisplay({ results, isLoading, error }: ValueTypeResultDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg border-primary/10 max-w-xs mx-auto">
        <CardContent className="p-2 space-y-1">
          {VALUE_TYPES_CONFIG.map(category => (
            <div key={`skeleton-${category.id}`} className="py-1.5 flex items-center border-b last:border-b-0 animate-pulse">
              <div className="flex items-center flex-grow">
                <Skeleton className="h-3 w-3 mr-1.5 rounded-full bg-muted-foreground/20" />
                <Skeleton className="h-2.5 w-16 bg-muted-foreground/20" />
              </div>
              <Skeleton className="h-4 w-10 rounded-md bg-muted-foreground/20 ml-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
       <Card className="mt-8 shadow-lg border-destructive max-w-xs mx-auto">
        <CardContent className="p-2">
          <p className="text-destructive-foreground bg-destructive/10 p-2 rounded-md text-xs">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <Card className="mt-8 shadow-lg border-primary/10 max-w-xs mx-auto">
      <CardContent className="p-2">
        <div className="space-y-0">
          {(Object.keys(results) as ValueCategoryKey[]).map(key => {
            const categoryConfig = VALUE_TYPES_CONFIG.find(c => c.id === key);
            const value = results[key];
            if (!categoryConfig) return null;

            const Icon = categoryConfig.icon;
            const badgeStyle = getValueStyles(value);

            return (
              <div key={key} className="py-1.5 flex items-center border-b last:border-b-0">
                <div className="flex items-center flex-grow">
                  <Icon className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-card-foreground">{categoryConfig.label}</span>
                </div>
                <Badge
                  variant="default"
                  className={`capitalize text-xs font-semibold px-1.5 py-0.5 border ml-1.5 ${badgeStyle}`}
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
