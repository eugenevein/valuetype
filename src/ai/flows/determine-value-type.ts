'use server';

/**
 * @fileOverview Determines the value type (urgency, market impact, strategic, revenue, cost) for a given project or epic based on user input.
 *
 * - determineValueType - A function that handles the value type determination process.
 * - DetermineValueTypeInput - The input type for the determineValueType function.
 * - DetermineValueTypeOutput - The return type for the determineValueType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValueTypeCategorySchema = z.enum([
  'urgency',
  'marketImpact',
  'strategic',
  'revenue',
  'cost',
]);

const ChecklistItemSchema = z.object({
  label: z.string(),
  checked: z.boolean(),
});

const ValueTypeDetailsSchema = z.object({
  high: z.object({
    checklist: z.array(ChecklistItemSchema),
    text: z.string(),
  }),
  mid: z.object({
    checklist: z.array(ChecklistItemSchema),
    text: z.string(),
  }),
  low: z.object({
    checklist: z.array(ChecklistItemSchema),
    text: z.string(),
  }),
});

const DetermineValueTypeInputSchema = z.object({
  urgency: ValueTypeDetailsSchema.describe('Details for urgency value type.'),
  marketImpact: ValueTypeDetailsSchema.describe(
    'Details for market impact value type.'
  ),
  strategic: ValueTypeDetailsSchema.describe('Details for strategic value type.'),
  revenue: ValueTypeDetailsSchema.describe('Details for revenue value type.'),
  cost: ValueTypeDetailsSchema.describe('Details for cost value type.'),
  overallConsiderations: z
    .string()
    .describe('Overall considerations if the epic is not worked on.'),
});

export type DetermineValueTypeInput = z.infer<typeof DetermineValueTypeInputSchema>;

const ValueTypeResultSchema = z.enum(['high', 'mid', 'low']);

const DetermineValueTypeOutputSchema = z.object({
  urgency: ValueTypeResultSchema.describe('The determined urgency value type.'),
  marketImpact: ValueTypeResultSchema.describe(
    'The determined market impact value type.'
  ),
  strategic: ValueTypeResultSchema.describe('The determined strategic value type.'),
  revenue: ValueTypeResultSchema.describe('The determined revenue value type.'),
  cost: ValueTypeResultSchema.describe('The determined cost value type.'),
});

export type DetermineValueTypeOutput = z.infer<typeof DetermineValueTypeOutputSchema>;

export async function determineValueType(
  input: DetermineValueTypeInput
): Promise<DetermineValueTypeOutput> {
  return determineValueTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'determineValueTypePrompt',
  input: {schema: DetermineValueTypeInputSchema},
  output: {schema: DetermineValueTypeOutputSchema},
  prompt: `You are an AI assistant helping determine the value type for a potential project or epic.

  Analyze the following information provided by the user and determine the appropriate value type (high, mid, or low) for each category (urgency, market impact, strategic, revenue, and cost).

  Consider the checklists and free text fields for each value type category.

  Also, consider the overall consequences if the epic is not worked on.

  Value Type Details:

  Urgency: High: {{{urgency.high.text}}} Checklist: {{#each urgency.high.checklist}}- {{label}}: {{checked}}{{/each}} Mid: {{{urgency.mid.text}}} Checklist: {{#each urgency.mid.checklist}}- {{label}}: {{checked}}{{/each}} Low: {{{urgency.low.text}}} Checklist: {{#each urgency.low.checklist}}- {{label}}: {{checked}}{{/each}}
  Market Impact: High: {{{marketImpact.high.text}}} Checklist: {{#each marketImpact.high.checklist}}- {{label}}: {{checked}}{{/each}} Mid: {{{marketImpact.mid.text}}} Checklist: {{#each marketImpact.mid.checklist}}- {{label}}: {{checked}}{{/each}} Low: {{{marketImpact.low.text}}} Checklist: {{#each marketImpact.low.checklist}}- {{label}}: {{checked}}{{/each}}
  Strategic: High: {{{strategic.high.text}}} Checklist: {{#each strategic.high.checklist}}- {{label}}: {{checked}}{{/each}} Mid: {{{strategic.mid.text}}} Checklist: {{#each strategic.mid.checklist}}- {{label}}: {{checked}}{{/each}} Low: {{{strategic.low.text}}} Checklist: {{#each strategic.low.checklist}}- {{label}}: {{checked}}{{/each}}
  Revenue: High: {{{revenue.high.text}}} Checklist: {{#each revenue.high.checklist}}- {{label}}: {{checked}}{{/each}} Mid: {{{revenue.mid.text}}} Checklist: {{#each revenue.mid.checklist}}- {{label}}: {{checked}}{{/each}} Low: {{{revenue.low.text}}} Checklist: {{#each revenue.low.checklist}}- {{label}}: {{checked}}{{/each}}
  Cost: High: {{{cost.high.text}}} Checklist: {{#each cost.high.checklist}}- {{label}}: {{checked}}{{/each}} Mid: {{{cost.mid.text}}} Checklist: {{#each cost.mid.checklist}}- {{label}}: {{checked}}{{/each}} Low: {{{cost.low.text}}} Checklist: {{#each cost.low.checklist}}- {{label}}: {{checked}}{{/each}}

  Overall Considerations: {{{overallConsiderations}}}

  Based on the information above, determine the value type for each category.

  Output the value types in JSON format.
  `,
});

const determineValueTypeFlow = ai.defineFlow(
  {
    name: 'determineValueTypeFlow',
    inputSchema: DetermineValueTypeInputSchema,
    outputSchema: DetermineValueTypeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
