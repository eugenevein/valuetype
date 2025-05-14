
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
        itemBg: 'bg-red-100 border-red-300',
        itemText: 'text-red-900',
        badge: 'bg-red-500 hover:bg-red-500/90 text-white border-red-700',
      };
    case 'mid':
      return {
        itemBg: 'bg-yellow-100 border-yellow-300',
        itemText: 'text-yellow-900',
        badge: 'bg-yellow-400 hover:bg-yellow-400/90 text-yellow-900 border-yellow-600',
      };
    case 'low':
      return {
        itemBg: 'bg-green-100 border-green-300',
        itemText: 'text-green-900',
        badge: 'bg-green-500 hover:bg-green-500/90 text-white border-green-700',
      };
    default:
      return {
        itemBg: 'bg-card border-border',
        itemText: 'text-card-foreground',
        badge: 'bg-secondary text-secondary-foreground border-transparent',
      };
  }
};

export function ValueTypeResultDisplay({ results, isLoading, error }: ValueTypeResultDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-10 shadow-xl border-2 border-primary/20 max-w-md mx-auto">
        <CardHeader className="bg-primary/5 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center text-primary tracking-tight">
            Generating Analysis...
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-4">
          {VALUE_TYPES_CONFIG.map(category => (
            <div key={`skeleton-${category.id}`} className="p-4 rounded-lg shadow-md bg-muted flex items-center justify-between animate-pulse">
              <div className="flex items-center">
                <Skeleton className="h-6 w-6 mr-3 rounded-full bg-muted-foreground/20" />
                <Skeleton className="h-5 w-24 bg-muted-foreground/20" />
              </div>
              <Skeleton className="h-7 w-20 rounded-md bg-muted-foreground/20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
       <Card className="mt-10 shadow-lg border-destructive max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-destructive flex items-center justify-center">
            <AlertTriangle className="mr-2 h-6 w-6" />
            Error Generating Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground bg-destructive/10 p-4 rounded-md text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <Card className="mt-10 shadow-xl border-2 border-primary/20 max-w-md mx-auto">
      <CardHeader className="bg-primary/5 rounded-t-lg">
        <CardTitle className="text-3xl font-bold text-center text-primary tracking-tight">
          Value Type Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="space-y-4">
          {(Object.keys(results) as ValueCategoryKey[]).map(key => {
            const categoryConfig = VALUE_TYPES_CONFIG.find(c => c.id === key);
            const value = results[key];
            if (!categoryConfig) return null;

            const Icon = categoryConfig.icon;
            const styles = getValueStyles(value);

            return (
              <div key={key} className={`p-4 rounded-lg shadow-md flex items-center justify-between border ${styles.itemBg} ${styles.itemText}`}>
                <div className="flex items-center">
                  <Icon className="mr-3 h-6 w-6" />
                  <span className="text-lg font-semibold">{categoryConfig.label}</span>
                </div>
                <Badge
                  variant="default"
                  className={`capitalize text-md font-semibold px-3 py-1.5 border-2 ${styles.badge}`}
                >
                  {value} Impact
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
