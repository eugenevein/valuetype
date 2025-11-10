
"use client";

import type { Assessment } from '@/services/assessment-service';
import { VALUE_TYPES_CONFIG, type ValueCategoryKey, type ValueLevel } from '@/config/value-types.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Shirt, Sparkles } from 'lucide-react';

interface ValueTypeResultDisplayProps {
  data: Assessment;
  onEdit: () => void;
  onDelete: () => void;
}

const getValueStyles = (value: ValueLevel) => {
  switch (value) {
    case 'high':
      return 'bg-red-500 hover:bg-red-500/90 text-white border-red-700';
    case 'mid':
      return 'bg-yellow-400 hover:bg-yellow-400/90 text-yellow-900 border-yellow-600';
    case 'low':
      return 'bg-green-500 hover:bg-green-500/90 text-white border-green-700';
    case 'na':
       return 'bg-gray-400 hover:bg-gray-400/90 text-white border-gray-600';
    default:
      return 'bg-secondary text-secondary-foreground border-transparent';
  }
};

export function ValueTypeResultDisplay({ data, onEdit, onDelete }: ValueTypeResultDisplayProps) {
  if (!data) {
    return null;
  }

  return (
    <Card className="relative">
       <CardHeader className="pb-2 pt-4 px-4">
         <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-1">
                <CardTitle className="text-lg font-bold break-words">
                    {data.epicName}
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Shirt className="mr-1.5 h-4 w-4"/>
                    <span>T-Shirt Size:</span>
                    <Badge variant="secondary" className="ml-2 uppercase">{data.tShirtSize}</Badge>
                </div>
                 <div className="flex items-center text-sm text-muted-foreground">
                    <Sparkles className="mr-1.5 h-4 w-4"/>
                    <span>Confidence:</span>
                    <Badge variant="secondary" className="ml-2 capitalize">{data.confidence}</Badge>
                </div>
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
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
      <CardContent className="p-4 pt-2">
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
                    <span className="text-sm font-medium">{categoryConfig.label}</span>
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
                    {`"${notes}"`}
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
              <p className="text-sm font-semibold mb-1">Impact of not doing:</p>
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
