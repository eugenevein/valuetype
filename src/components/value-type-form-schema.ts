
import { z } from 'zod';

// Schema for a single value type's input (e.g., for 'urgency')
const ValueTypeInputSchema = z.object({
  level: z.enum(['high', 'mid', 'low'], {
    required_error: "Please select a level (High, Mid, or Low).",
  }),
  notes: z.string().min(1, "This field is required.").max(500, "Notes must be 500 characters or less."),
});

// Schema for financial value types that can be N/A
const FinancialValueTypeInputSchema = z.object({
  level: z.enum(['high', 'mid', 'low', 'na'], {
    required_error: "Please select a level (High, Mid, Low, or N/A).",
  }),
  notes: z.string().min(1, "This field is required.").max(500, "Notes must be 500 characters or less."),
});


export const valueTypeFormSchema = z.object({
  epicName: z.string().min(1, "Epic name is required.").max(100, "Epic name must be 100 characters or less."),
  tShirtSize: z.enum(['xs', 's', 'm', 'l', 'xl'], {
    required_error: "Please select a T-shirt size.",
  }),
  confidence: z.enum(['high', 'mid', 'low'], {
    required_error: "Please select a confidence level.",
  }),
  urgency: ValueTypeInputSchema,
  marketImpact: ValueTypeInputSchema,
  strategic: ValueTypeInputSchema,
  revenue: FinancialValueTypeInputSchema,
  cost: FinancialValueTypeInputSchema,
  overallConsiderations: z.string().min(1, "This field is required.").max(1000, "Overall considerations must be 1000 characters or less."),
});

export type ValueTypeFormData = z.infer<typeof valueTypeFormSchema>;
