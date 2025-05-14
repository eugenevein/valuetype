
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
    categoryDescription: 'Assess the time-sensitivity and critical nature of the epic.',
    levelOptions: [
      { value: 'high', label: 'High', description: 'Now - has to be resolved immediately' },
      { value: 'mid', label: 'Medium', description: 'Soon - has to be resolved in next 6 months' },
      { value: 'low', label: 'Low', description: 'Later - has to be resolved in more than 6 months' },
    ],
  },
  {
    id: 'marketImpact',
    label: 'Market Impact',
    icon: TrendingUpIcon,
    categoryDescription: 'Evaluate the epic\'s potential effect on your market position and brand.',
    levelOptions: [
      { value: 'high', label: 'High', description: 'Addresses large market need, potential to disrupt competitors, enhances brand significantly.' },
      { value: 'mid', label: 'Medium', description: 'Targets valuable niche, offers some competitive advantage, improves customer perception moderately.' },
      { value: 'low', label: 'Low', description: 'Maintains current position, limited differentiation, internal improvement with little external visibility.' },
    ],
  },
  {
    id: 'strategic',
    label: 'Strategic',
    icon: TargetIcon,
    categoryDescription: 'Determine how well the epic aligns with and supports core company goals.',
    levelOptions: [
      { value: 'high', label: 'High', description: 'Directly supports key company OKRs/goals, unlocks future strategic opportunities, mitigates major strategic risk.' },
      { value: 'mid', label: 'Medium', description: 'Aligns with departmental goals, provides incremental strategic progress, reduces minor strategic risks.' },
      { value: 'low', label: 'Low', description: 'Opportunistic or tactical, no clear link to current strategy, could be pursued independently.' },
    ],
  },
  {
    id: 'revenue',
    label: 'Maximise Revenue',
    icon: CircleDollarSignIcon,
    categoryDescription: 'Assess the epic\'s potential to directly or indirectly increase revenue.',
    levelOptions: [
      { value: 'high', label: 'High', description: 'Generates significant new revenue, substantially increases LTV, opens major new sales channels.' },
      { value: 'mid', label: 'Medium', description: 'Improves conversion rates/AOV, reduces churn, enhances up-sell/cross-sell opportunities.' },
      { value: 'low', label: 'Low', description: 'Indirect or long-term revenue potential, primarily non-revenue focused, no clear path to revenue impact.' },
    ],
  },
  {
    id: 'cost',
    label: 'Minimize Cost',
    icon: BanknoteIcon,
    categoryDescription: 'Evaluate the epic\'s potential for reducing operational or capital expenditure.',
    levelOptions: [
      { value: 'high', label: 'High', description: 'Drastically reduces OpEx, avoids substantial CapEx, greatly improves resource efficiency.' },
      { value: 'mid', label: 'Medium', description: 'Reduces some operational costs, optimizes processes for cost-effectiveness, avoids minor future costs.' },
      { value: 'low', label: 'Low', description: 'Cost impact negligible or uncertain, may involve upfront costs with unclear savings, not cost-focused.' },
    ],
  },
];

