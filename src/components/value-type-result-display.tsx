
"use client";

import type { ValueTypeFormData } from '@/components/value-type-form-schema';
import { VALUE_TYPES_CONFIG, type ValueCategoryKey } from '@/config/value-types.tsx';
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
    <Card className="mt-8 shadow-lg border-primary/10 max-w-xs mx-auto">
      <CardContent className="p-2">
        <div className="space-y-0">
          {VALUE_TYPES_CONFIG.map(categoryConfig => {
            const key = categoryConfig.id as ValueCategoryKey;
            const selectedLevel = data[key]?.level;
            const notes = data[key]?.notes;

            if (!selectedLevel) return null;

            const Icon = categoryConfig.icon;
            const badgeStyle = getValueStyles(selectedLevel);

            return (
              <div key={key} className="py-1.5 border-b last:border-b-0">
                <div className="flex items-center">
                  <Icon className="mr-1.5 h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs font-bold text-card-foreground mr-1 whitespace-nowrap">{categoryConfig.label}</span>
                  <Badge
                    variant="default"
                    className={`capitalize text-xs font-semibold px-1.5 py-0.5 border ml-auto ${badgeStyle}`}
                  >
                    {selectedLevel}
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
        {data.overallConsiderations && (
          <>
            <Separator className="my-1.5" />
            <div className="px-1 py-1">
              <p className="text-xs font-semibold text-card-foreground mb-0.5">Impact of not doing:</p>
              <p className="text-xs text-muted-foreground italic break-words">
                {data.overallConsiderations}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
