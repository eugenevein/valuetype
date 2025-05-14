import type { LucideIcon } from 'lucide-react';
import { TimerIcon, TrendingUpIcon, TargetIcon, CircleDollarSignIcon, BanknoteIcon } from 'lucide-react';
import type { DetermineValueTypeInput } from '@/ai/flows/determine-value-type';

export type ValueLevel = 'high' | 'mid' | 'low';
export type ValueCategoryKey = keyof Omit<DetermineValueTypeInput, 'overallConsiderations'>;


export interface ChecklistItemDefinition {
  id: string;
  label: string;
}

export interface ValueTypeConfig {
  id: ValueCategoryKey;
  label: string;
  icon: LucideIcon;
  levels: {
    [key in ValueLevel]: {
      defaultChecklistItems: ChecklistItemDefinition[];
      description: string; // Short description for the tab/section
    };
  };
}

export const VALUE_TYPES_CONFIG: ValueTypeConfig[] = [
  {
    id: 'urgency',
    label: 'Level of Urgency',
    icon: TimerIcon,
    levels: {
      high: {
        description: 'Critical, time-sensitive tasks.',
        defaultChecklistItems: [
          { id: 'u_h_1', label: 'Has a fixed, imminent deadline' },
          { id: 'u_h_2', label: 'Blocks other critical work streams' },
          { id: 'u_h_3', label: 'Addresses an immediate, major problem' },
        ],
      },
      mid: {
        description: 'Important tasks with some flexibility.',
        defaultChecklistItems: [
          { id: 'u_m_1', label: 'Needs to be done in the near future' },
          { id: 'u_m_2', label: 'Causes noticeable friction if delayed' },
          { id: 'u_m_3', label: 'Stakeholders are expecting it soon' },
        ],
      },
      low: {
        description: 'Tasks that can be scheduled flexibly.',
        defaultChecklistItems: [
          { id: 'u_l_1', label: 'No hard deadline, can be deferred' },
          { id: 'u_l_2', label: 'Impact of delay is minimal' },
          { id: 'u_l_3', label: 'Nice-to-have or long-term improvement' },
        ],
      },
    },
  },
  {
    id: 'marketImpact',
    label: 'Market Impact',
    icon: TrendingUpIcon,
    levels: {
      high: {
        description: 'Significant positive effect on market position.',
        defaultChecklistItems: [
          { id: 'mi_h_1', label: 'Addresses a large, underserved market need' },
          { id: 'mi_h_2', label: 'Potential to significantly disrupt competitors' },
          { id: 'mi_h_3', label: 'Greatly enhances brand visibility or reputation' },
        ],
      },
      mid: {
        description: 'Moderate improvement to market standing.',
        defaultChecklistItems: [
          { id: 'mi_m_1', label: 'Targets a specific, valuable niche' },
          { id: 'mi_m_2', label: 'Offers competitive advantage in some areas' },
          { id: 'mi_m_3', label: 'Improves customer perception moderately' },
        ],
      },
      low: {
        description: 'Minimal or indirect market influence.',
        defaultChecklistItems: [
          { id: 'mi_l_1', label: 'Maintains current market position' },
          { id: 'mi_l_2', label: 'Limited differentiation from competitors' },
          { id: 'mi_l_3', label: 'Internal improvement with little external visibility' },
        ],
      },
    },
  },
  {
    id: 'strategic',
    label: 'Strategic',
    icon: TargetIcon,
    levels: {
      high: {
        description: 'Crucial for achieving core strategic goals.',
        defaultChecklistItems: [
          { id: 's_h_1', label: 'Directly supports key company OKRs/goals' },
          { id: 's_h_2', label: 'Unlocks significant future strategic opportunities' },
          { id: 's_h_3', label: 'Mitigates a major strategic risk' },
        ],
      },
      mid: {
        description: 'Contributes to strategic objectives.',
        defaultChecklistItems: [
          { id: 's_m_1', label: 'Aligns with departmental or secondary goals' },
          { id: 's_m_2', label: 'Provides incremental progress on strategic fronts' },
          { id: 's_m_3', label: 'Reduces minor strategic risks' },
        ],
      },
      low: {
        description: 'Loosely connected or not aligned with current strategy.',
        defaultChecklistItems: [
          { id: 's_l_1', label: 'Opportunistic or tactical, not strategic' },
          { id: 's_l_2', label: 'No clear link to current company strategy' },
          { id: 's_l_3', label: 'Could be pursued by any department independently' },
        ],
      },
    },
  },
  {
    id: 'revenue',
    label: 'Maximise Revenue',
    icon: CircleDollarSignIcon,
    levels: {
      high: {
        description: 'Substantial, direct positive impact on revenue.',
        defaultChecklistItems: [
          { id: 'r_h_1', label: 'Directly generates significant new revenue streams' },
          { id: 'r_h_2', label: 'Substantially increases Customer Lifetime Value (LTV)' },
          { id: 'r_h_3', label: 'Opens major new sales channels or markets' },
        ],
      },
      mid: {
        description: 'Moderate, measurable revenue increase.',
        defaultChecklistItems: [
          { id: 'r_m_1', label: 'Improves conversion rates or average order value' },
          { id: 'r_m_2', label: 'Reduces churn, indirectly protecting revenue' },
          { id: 'r_m_3', label: 'Enhances up-sell/cross-sell opportunities' },
        ],
      },
      low: {
        description: 'Minimal or indirect impact on revenue generation.',
        defaultChecklistItems: [
          { id: 'r_l_1', label: 'Indirect or very long-term revenue potential' },
          { id: 'r_l_2', label: 'Primarily focused on non-revenue metrics' },
          { id: 'r_l_3', label: 'No clear path to revenue impact' },
        ],
      },
    },
  },
  {
    id: 'cost',
    label: 'Minimize Cost',
    icon: BanknoteIcon,
    levels: {
      high: {
        description: 'Significant reduction in operational or capital costs.',
        defaultChecklistItems: [
          { id: 'c_h_1', label: 'Drastically reduces operational expenditures (OpEx)' },
          { id: 'c_h_2', label: 'Avoids substantial future capital expenditures (CapEx)' },
          { id: 'c_h_3', label: 'Greatly improves resource efficiency/productivity' },
        ],
      },
      mid: {
        description: 'Moderate, tangible cost savings.',
        defaultChecklistItems: [
          { id: 'c_m_1', label: 'Reduces some operational costs measurably' },
          { id: 'c_m_2', label: 'Optimizes processes for better cost-effectiveness' },
          { id: 'c_m_3', label: 'Avoids minor or recurring future costs' },
        ],
      },
      low: {
        description: 'Minimal or no direct impact on cost reduction.',
        defaultChecklistItems: [
          { id: 'c_l_1', label: 'Cost impact is negligible or uncertain' },
          { id: 'c_l_2', label: 'May involve upfront costs with unclear long-term savings' },
          { id: 'c_l_3', label: 'Focus is not on cost optimization' },
        ],
      },
    },
  },
];

