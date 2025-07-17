
"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Assessment } from '@/app/page';
import { VALUE_TYPES_CONFIG, type ValueCategoryKey } from '@/config/value-types.tsx';

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

const weightedPrioritization = (assessments: Assessment[], primaryCategory: ValueCategoryKey) => {
  const otherCategories = VALUE_TYPES_CONFIG.map(c => c.id).filter(id => id !== primaryCategory);

  return [...assessments].sort((a, b) => {
    // 1. Compare by primary category
    const aPrimaryScore = levelPoints[a[primaryCategory].level];
    const bPrimaryScore = levelPoints[b[primaryCategory].level];
    if (aPrimaryScore !== bPrimaryScore) {
      return bPrimaryScore - aPrimaryScore;
    }

    // 2. Tie-breaker: Compare by other categories in their default order
    for (const categoryId of otherCategories) {
      const aScore = levelPoints[a[categoryId].level];
      const bScore = levelPoints[b[categoryId].level];
      if (aScore !== bScore) {
        return bScore - aScore;
      }
    }

    // 3. If still a tie, maintain original relative order (or by name)
    return a.epicName.localeCompare(b.epicName);
  });
};

// --- Component ---

export function PrioritizationDialog({ isOpen, onClose, assessments }: PrioritizationDialogProps) {
  const [primaryCategory, setPrimaryCategory] = React.useState<ValueCategoryKey>('urgency');

  const directResults = React.useMemo(() => directPrioritization(assessments), [assessments]);
  const weightedResults = React.useMemo(() => weightedPrioritization(assessments, primaryCategory), [assessments, primaryCategory]);

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

          {/* Weighted Prioritization */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-card-foreground">Weighted Prioritization</h3>
            <p className="text-sm text-muted-foreground">Sort epics with one value type as the primary tie-breaker.</p>
            
            <div className="space-y-2">
                <Label htmlFor="primary-category-select">Prioritize by:</Label>
                <Select value={primaryCategory} onValueChange={(value) => setPrimaryCategory(value as ValueCategoryKey)}>
                    <SelectTrigger id="primary-category-select">
                        <SelectValue placeholder="Select a value type" />
                    </SelectTrigger>
                    <SelectContent>
                        {VALUE_TYPES_CONFIG.map(cat => (
                           <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
