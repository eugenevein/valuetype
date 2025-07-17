
"use client";

import type { ValueTypeFormData } from '@/components/value-type-form-schema';
import { VALUE_TYPES_CONFIG, type ValueCategoryKey } from '@/config/value-types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ValueTypeResultDisplayProps {
  data: ValueTypeFormData | null;
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

export function ValueTypeResultDisplay({ data }: ValueTypeResultDisplayProps) {
  if (!data) {
    return null;
  }

  return (
    <Card className="shadow-lg border-primary/10">
      <CardContent className="p-4">
        <div className="space-y-2">
          {VALUE_TYPES_CONFIG.map(categoryConfig => {
            const key = categoryConfig.id as ValueCategoryKey;
            const selectedLevel = data[key]?.level;
            const notes = data[key]?.notes;

            if (!selectedLevel) return null;

            const Icon = categoryConfig.icon;
            const badgeStyle = getValueStyles(selectedLevel);

            return (
              <div key={key} className="py-2 border-b last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-bold text-card-foreground">{categoryConfig.label}</span>
                  </div>
                  <Badge
                    variant="default"
                    className={`capitalize text-xs font-semibold px-2 py-0.5 border ${badgeStyle}`}
                  >
                    {selectedLevel}
                  </Badge>
                </div>
                {notes && (
                  <p className="text-sm text-muted-foreground mt-1 ml-6 italic break-words">
                    {notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        {data.overallConsiderations && (
          <>
            <Separator className="my-2" />
            <div className="px-1 py-1">
              <p className="text-sm font-semibold text-card-foreground mb-1">Impact of not doing:</p>
              <p className="text-sm text-muted-foreground italic break-words">
                {data.overallConsiderations}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
