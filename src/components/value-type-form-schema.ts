import { z } from 'zod';

const ChecklistItemSchema = z.object({
  label: z.string(),
  checked: z.boolean(),
});

const LevelDetailSchema = z.object({
  checklist: z.array(ChecklistItemSchema),
  text: z.string().max(500, "Text must be 500 characters or less.").optional(),
});

const ValueTypeDetailsSchema = z.object({
  high: LevelDetailSchema,
  mid: LevelDetailSchema,
  low: LevelDetailSchema,
});

export const valueTypeFormSchema = z.object({
  urgency: ValueTypeDetailsSchema,
  marketImpact: ValueTypeDetailsSchema,
  strategic: ValueTypeDetailsSchema,
  revenue: ValueTypeDetailsSchema,
  cost: ValueTypeDetailsSchema,
  overallConsiderations: z.string().max(1000, "Overall considerations must be 1000 characters or less.").optional(),
});

export type ValueTypeFormData = z.infer<typeof valueTypeFormSchema>;
