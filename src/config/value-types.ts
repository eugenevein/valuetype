
import React from 'react'; // Added React import for JSX
import type { LucideIcon } from 'lucide-react';
import { TimerIcon, TrendingUpIcon, TargetIcon, CircleDollarSignIcon, BanknoteIcon } from 'lucide-react';
import type { DetermineValueTypeInput } from '@/ai/flows/determine-value-type';
import type { ReactNode } from 'react';

export type ValueLevel = 'high' | 'mid' | 'low';
export type ValueCategoryKey = Exclude<keyof DetermineValueTypeInput, 'overallConsiderations'>;

export interface LevelOption {
  value: ValueLevel;
  label: string;
  description: string;
}

export interface ValueTypeConfig {
  id: ValueCategoryKey;
  label: string;
  icon: LucideIcon;
  categoryDescription: ReactNode;
  levelOptions: LevelOption[];
}

export const VALUE_TYPES_CONFIG: ValueTypeConfig[] = [
  {
    id: 'urgency',
    label: 'Level of Urgency',
    icon: TimerIcon,
    categoryDescription: '',
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
    categoryDescription: '',
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
      { value: 'high', label: 'High', description: 'Strategic decision (C-level request). For example, this could involve improving scalability (e.g., new markets, more KM expansion).' },
      { value: 'mid', label: 'Mid', description: 'External dependencies (Cross-Domain level)' },
      { value: 'low', label: 'Low', description: 'Internal dependencies (Domain level)' },
    ],
  },
  {
    id: 'revenue',
    label: 'Maximise Revenue',
    icon: CircleDollarSignIcon,
    categoryDescription: (
      <>
        <p className="text-sm">(Represented by business case)</p>
        <div className="mt-2 text-xs space-y-1">
          <p className="font-medium">Maintain and Increase of revenue compared to status quo (e.g.)</p>
          <ul className="list-disc list-outside pl-5 space-y-0.5">
            <li>Market entries (platform business, etc.)</li>
            <li>Increase due to better conversion rate</li>
            <li>Higher customer retention</li>
            <li>Advanced pricing possibilities (new/ improved features..)</li>
          </ul>
          <p className="font-medium pt-1">Avoid loss of current revenues in the future (e.g.)</p>
          <ul className="list-disc list-outside pl-5 space-y-0.5">
            <li>Compete against features of competitors</li>
            <li>Prevent cancellation of contracts with partners (e.g. integration/TSPs, cost consideration)</li>
            <li>Legislation issues (regional markets)</li>
          </ul>
        </div>
      </>
    ),
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
    categoryDescription: '',
    levelOptions: [
      { value: 'high', label: 'High', description: 'Drastically reduces OpEx, avoids substantial CapEx, greatly improves resource efficiency.' },
      { value: 'mid', label: 'Mid', description: 'Reduces some operational costs, optimizes processes for cost-effectiveness, avoids minor future costs.' },
      { value: 'low', label: 'Low', description: 'Cost impact negligible or uncertain, may involve upfront costs with unclear savings, not cost-focused.' },
    ],
  },
];
