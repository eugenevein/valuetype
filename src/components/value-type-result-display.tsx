
"use client";

import type { DetermineValueTypeOutput, DetermineValueTypeInput } from '@/ai/flows/determine-value-type';
import { VALUE_TYPES_CONFIG, type ValueCategoryKey } from '@/config/value-types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

interface ValueTypeResultDisplayProps {
  results: DetermineValueTypeOutput | null;
  inputData: DetermineValueTypeInput | null;
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

export function ValueTypeResultDisplay({ results, inputData, isLoading, error }: ValueTypeResultDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg border-primary/10 max-w-xs mx-auto">
        <CardContent className="p-2 space-y-1.5">
          {VALUE_TYPES_CONFIG.map(category => (
            <div key={`skeleton-${category.id}`} className="py-1 border-b last:border-b-0 animate-pulse">
              <div className="flex items-center">
                <Skeleton className="h-3 w-3 mr-1.5 rounded-full bg-muted-foreground/20" />
                <Skeleton className="h-2.5 w-16 bg-muted-foreground/20" />
                <Skeleton className="h-4 w-8 rounded-md bg-muted-foreground/20 ml-auto" />
              </div>
              <Skeleton className="h-2 w-24 mt-1 ml-4 bg-muted-foreground/15" />
            </div>
          ))}
          <Separator className="my-1" />
          <Skeleton className="h-2.5 w-20 mt-1 bg-muted-foreground/20" />
          <Skeleton className="h-2 w-full mt-1 bg-muted-foreground/15" />
          <Skeleton className="h-2 w-3/4 mt-1 bg-muted-foreground/15" />
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

  if (!results || !inputData) {
    return null;
  }

  return (
    <Card className="mt-8 shadow-lg border-primary/10 max-w-xs mx-auto">
      <CardContent className="p-2">
        <div className="space-y-0">
          {VALUE_TYPES_CONFIG.map(categoryConfig => {
            const key = categoryConfig.id as ValueCategoryKey;
            const value = results[key];
            const notes = inputData[key]?.notes;
            if (!value) return null; 

            const Icon = categoryConfig.icon;
            const badgeStyle = getValueStyles(value);

            return (
              <div key={key} className="py-1.5 border-b last:border-b-0">
                <div className="flex items-center">
                  <Icon className="mr-1.5 h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs font-bold text-card-foreground mr-1 whitespace-nowrap">{categoryConfig.label}</span>
                  <Badge
                    variant="default"
                    className={`capitalize text-xs font-semibold px-1.5 py-0.5 border ml-auto ${badgeStyle}`}
                  >
                    {value}
                  </Badge>
                </div>
                {notes && (
                  <p className="text-xs text-muted-foreground mt-0.5 ml-5 italic break-words">
                    {notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        {inputData.overallConsiderations && (
          <>
            <Separator className="my-1.5" />
            <div className="px-1 py-1">
              <p className="text-xs font-semibold text-card-foreground mb-0.5">Impact of not doing:</p>
              <p className="text-xs text-muted-foreground italic break-words">
                {inputData.overallConsiderations}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
