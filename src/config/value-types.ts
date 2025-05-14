
import type { LucideIcon } from 'lucide-react';
import { TimerIcon, TrendingUpIcon, TargetIcon, CircleDollarSignIcon, BanknoteIcon } from 'lucide-react';
import type { DetermineValueTypeInput } from '@/ai/flows/determine-value-type';

export type ValueLevel = 'high' | 'mid' | 'low';
export type ValueCategoryKey = Exclude<keyof DetermineValueTypeInput, 'overallConsiderations'>;

// This type might change based on how DetermineValueTypeInput is reshaped.
// For now, assuming DetermineValueTypeInput will have keys like 'urgency', 'marketImpact', etc.
// And overallConsiderations. This ValueCategoryKey will represent 'urgency', 'marketImpact', etc.

export interface LevelOption {
  value: ValueLevel;
  label: string; // e.g., "High Impact"
  description: string; // Description for this specific level to display next to radio button
}

export interface ValueTypeConfig {
  id: ValueCategoryKey;
  label: string; // e.g., "Level of Urgency" - for the Card Title
  icon: LucideIcon;
  categoryDescription: string; // General description for the category - for CardDescription
  levelOptions: LevelOption[]; // To generate RadioGroup options
}

export const VALUE_TYPES_CONFIG: ValueTypeConfig[] = [
  {
    id: 'urgency',
    label: 'Level of Urgency',
    icon: TimerIcon,
    categoryDescription: '', // Ensure this is empty or not set if no description is desired
    levelOptions: [
      { value: 'high', label: 'High', description: 'Now - has to be resolved immediately' },
      { value: 'mid', label: 'Mid', description: 'Soon - has to be resolved in next 6 months' },
      { value: 'low', label: 'Low', description: 'Later - has to be resolved in more than 6 months' },
    ],
  },
  {
    id: 'marketImpact',
    label: 'Market Impact',
    icon: TrendingUpIcon,
    categoryDescription: '', // Ensure this is empty or not set if no description is desired
    levelOptions: [
      { value: 'high', label: 'High', description: 'Epic covering issues of global network.' },
      { value: 'mid', label: 'Mid', description: 'Epic covering issues of local network (>1 Business region but not global, e.g. North America only).' },
      { value: 'low', label: 'Low', description: 'Epic covering issues of local network (1 Business region).' },
    ],
  },
  {
    id: 'strategic',
    label: 'Strategic',
    icon: TargetIcon,
    categoryDescription: 'Strategic topics which cannot only be allocated to a EUR impact (e.g. because of Governance, Basis for future business cases, etc.) → this should only be used for exceptions',
    levelOptions: [
      { value: 'high', label: 'High', description: 'Strategic decision (C-level request). Also includes improving scalability (e.g., new markets, more KM expansion).' },
      { value: 'mid', label: 'Mid', description: 'External dependencies (Cross-Domain level)' },
      { value: 'low', label: 'Low', description: 'Internal dependencies (Domain level)' },
    ],
  },
  {
    id: 'revenue',
    label: 'Maximise Revenue',
    icon: CircleDollarSignIcon,
    categoryDescription: '', // Ensure this is empty or not set if no description is desired
    levelOptions: [
      { value: 'high', label: 'High', description: 'Generates significant new revenue, substantially increases LTV, opens major new sales channels.' },
      { value: 'mid', label: 'Mid', description: 'Improves conversion rates/AOV, reduces churn, enhances up-sell/cross-sell opportunities.' },
      { value: 'low', label: 'Low', description: 'Indirect or long-term revenue potential, primarily non-revenue focused, no clear path to revenue impact.' },
    ],
  },
  {
    id: 'cost',
    label: 'Minimize Cost',
    icon: BanknoteIcon,
    categoryDescription: '', // Ensure this is empty or not set if no description is desired
    levelOptions: [
      { value: 'high', label: 'High', description: 'Drastically reduces OpEx, avoids substantial CapEx, greatly improves resource efficiency.' },
      { value: 'mid', label: 'Mid', description: 'Reduces some operational costs, optimizes processes for cost-effectiveness, avoids minor future costs.' },
      { value: 'low', label: 'Low', description: 'Cost impact negligible or uncertain, may involve upfront costs with unclear savings, not cost-focused.' },
    ],
  },
];
