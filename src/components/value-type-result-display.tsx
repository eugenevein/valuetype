
"use client";

import type { Assessment } from '@/app/page';
import { VALUE_TYPES_CONFIG, type ValueCategoryKey } from '@/config/value-types.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button, buttonVariants } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface ValueTypeResultDisplayProps {
  data: Assessment;
  onEdit: () => void;
  onDelete: () => void;
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

export function ValueTypeResultDisplay({ data, onEdit, onDelete }: ValueTypeResultDisplayProps) {
  if (!data) {
    return null;
  }

  return (
    <Card className="shadow-lg border-primary/10 relative">
       <CardHeader className="pb-2 pt-4 px-4">
         <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold text-primary pr-20 break-words">
                {data.epicName}
            </CardTitle>
            <div className="absolute top-4 right-4 flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            </div>
         </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
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
