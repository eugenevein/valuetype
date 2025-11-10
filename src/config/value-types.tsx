
import React from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { TimerIcon, TrendingUpIcon, TargetIcon, CircleDollarSignIcon, BanknoteIcon } from 'lucide-react';
import type { ValueTypeFormData } from '@/components/value-type-form-schema';

export type ValueLevel = 'high' | 'mid' | 'low' | 'na';
export type ValueCategoryKey = Exclude<keyof ValueTypeFormData, 'overallConsiderations' | 'epicName' | 'tShirtSize' | 'confidence'>;

export interface LevelOption {
  value: ValueLevel;
  label: string;
  description: string;
}

export interface ValueTypeConfig {
  id: ValueCategoryKey;
  label: string;
  icon: LucideIcon;
  categoryDescription?: ReactNode; // Made optional as not all categories have it
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
          <ul className="list-disc list-outside pl-6 space-y-0.5">
            <li>Market entries (platform business, etc.)</li>
            <li>Increase due to better conversion rate</li>
            <li>Higher customer retention</li>
            <li>Advanced pricing possibilities (new/ improved features..)</li>
          </ul>
          <p className="font-medium pt-1">Avoid loss of current revenues in the future (e.g.)</p>
          <ul className="list-disc list-outside pl-6 space-y-0.5">
            <li>Compete against features of competitors</li>
            <li>Prevent cancellation of contracts with partners (e.g. integration/TSPs, cost consideration)</li>
            <li>Legislation issues (regional markets)</li>
          </ul>
        </div>
      </>
    ),
    levelOptions: [
      { value: 'high', label: 'High', description: 'BC value > €1mio p.a.' },
      { value: 'mid', label: 'Mid', description: '€500k < BC value < €1mio p.a.' },
      { value: 'low', label: 'Low', description: 'BC value < €500k p.a.' },
      { value: 'na', label: 'N/A', description: 'Not applicable for this epic.' },
    ],
  },
  {
    id: 'cost',
    label: 'Minimise Cost',
    icon: BanknoteIcon,
    categoryDescription: (
      <>
        <div className="mt-2 text-xs space-y-1">
          <p className="font-medium">Cost Savings - Lower cost compared to status quo (e.g.)</p>
          <ul className="list-disc list-outside pl-6 space-y-0.5">
            <li>Savings due to automated processes with e.g. less FTEs</li>
            <li>Reduced tool/data costs, lower penalties etc</li>
          </ul>
          <p className="font-medium pt-1">Cost prevention - Prevention of additional future costs (e.g.)</p>
          <ul className="list-disc list-outside pl-6 space-y-0.5">
            <li>Critical debt affecting functionalities (E.g. Technical debt)</li>
            <li>Penalties, Additional Hires (e.g. for new markets)</li>
            <li>no additional external tools/process which are legally required</li>
            <li>Failure of an existing service due to e.g. decoupling → costs if process has to run e.g. manually</li>
            <li>Deprecation of existing service e.g. back deprecation</li>
          </ul>
        </div>
      </>
    ),
    levelOptions: [
      { value: 'high', label: 'High', description: 'Technical (Affecting functionalities)' },
      { value: 'mid', label: 'Mid', description: 'Improve Automation (Reduce existing costs)' },
      { value: 'low', label: 'Low', description: 'Technical (Prevent future costs)' },
      { value: 'na', label: 'N/A', description: 'Not applicable for this epic.' },
    ],
  },
];
