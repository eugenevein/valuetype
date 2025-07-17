
"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import type { Assessment } from '@/app/page';
import { VALUE_TYPES_CONFIG, type ValueCategoryKey } from '@/config/value-types.tsx';
import { cn } from '@/lib/utils';

interface PrioritizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assessments: Assessment[];
}

const levelPoints: { [key: string]: number } = { low: 1, mid: 2, high: 3 };

// --- Sorting Logic ---

const calculateDirectScore = (assessment: Assessment): number => {
  return VALUE_TYPES_CONFIG.reduce((total, config) => {
    const category = assessment[config.id as ValueCategoryKey];
    return total + (category ? levelPoints[category.level] : 0);
  }, 0);
};

const directPrioritization = (assessments: Assessment[]) => {
  return [...assessments]
    .map(a => ({ ...a, score: calculateDirectScore(a) }))
    .sort((a, b) => b.score - a.score);
};

const rankedPrioritization = (assessments: Assessment[], rankedCategories: ValueCategoryKey[]) => {
  return [...assessments].sort((a, b) => {
    // Iterate through the user-defined ranking of categories
    for (const categoryId of rankedCategories) {
      const aScore = levelPoints[a[categoryId].level];
      const bScore = levelPoints[b[categoryId].level];
      if (aScore !== bScore) {
        return bScore - aScore; // Higher score comes first
      }
    }
    // If all value types are identical, maintain original relative order (or sort by name)
    return a.epicName.localeCompare(b.epicName);
  });
};


// --- Component ---

export function PrioritizationDialog({ isOpen, onClose, assessments }: PrioritizationDialogProps) {
  const [rankedCategories, setRankedCategories] = React.useState<ValueCategoryKey[]>(
    VALUE_TYPES_CONFIG.map(c => c.id)
  );

  const directResults = React.useMemo(() => directPrioritization(assessments), [assessments]);
  const weightedResults = React.useMemo(() => rankedPrioritization(assessments, rankedCategories), [assessments, rankedCategories]);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newRankedCategories = [...rankedCategories];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newRankedCategories.length) {
      return;
    }

    // Swap elements
    [newRankedCategories[index], newRankedCategories[newIndex]] = [newRankedCategories[newIndex], newRankedCategories[index]];
    
    setRankedCategories(newRankedCategories);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Epic Prioritization Results</DialogTitle>
          <DialogDescription>
            View prioritized lists of your epics based on different calculation methods.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto flex-grow pr-3">
          {/* Direct Prioritization */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-card-foreground">Direct Prioritization</h3>
            <p className="text-sm text-muted-foreground">Epics sorted by the sum of points from all value types (High=3, Mid=2, Low=1).</p>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[100px]">Rank</TableHead>
                        <TableHead>Epic Name</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {directResults.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">#{index + 1}</TableCell>
                            <TableCell>{item.epicName}</TableCell>
                            <TableCell className="text-right">{item.score}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          </div>

          {/* Ranked Prioritization */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-card-foreground">Ranked Prioritization</h3>
            <p className="text-sm text-muted-foreground">Define the priority order of value types. Drag-and-drop or use buttons to reorder.</p>
            
            <div className="space-y-2">
                <Label htmlFor="primary-category-select">Prioritize by:</Label>
                <div className="border rounded-lg p-2 space-y-1 bg-background">
                  {rankedCategories.map((categoryId, index) => {
                    const categoryConfig = VALUE_TYPES_CONFIG.find(c => c.id === categoryId);
                    if (!categoryConfig) return null;
                    
                    return (
                       <div key={categoryId} className="flex items-center justify-between p-2 rounded-md bg-card hover:bg-secondary/50">
                         <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">#{index + 1}</span>
                            <categoryConfig.icon className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">{categoryConfig.label}</span>
                         </div>
                         <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={index === 0}>
                                <ChevronUp className="h-4 w-4" />
                            </Button>
                             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={index === rankedCategories.length - 1}>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                         </div>
                       </div>
                    );
                  })}
                </div>
            </div>
            
            <div className="border rounded-lg">
                <Table>
                     <TableHeader>
                        <TableRow>
                        <TableHead className="w-[100px]">Rank</TableHead>
                        <TableHead>Epic Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {weightedResults.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">#{index + 1}</TableCell>
                            <TableCell>{item.epicName}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
