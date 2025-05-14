
'use server';

/**
 * @fileOverview Determines the value type (urgency, market impact, strategic, revenue, cost) for a given project or epic based on user input.
 * The user provides an initial assessment (level and notes) for each category. The AI confirms or adjusts this.
 *
 * - determineValueType - A function that handles the value type determination process.
 * - DetermineValueTypeInput - The input type for the determineValueType function.
 * - DetermineValueTypeOutput - The return type for the determineValueType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for a single value type category provided by the user
const UserValueAssessmentSchema = z.object({
  level: z.enum(['high', 'mid', 'low']).describe("User's selected preliminary level for this category."),
  notes: z.string().optional().describe("User's additional notes for this category."),
});

// Input schema for the AI flow
const DetermineValueTypeInputSchema = z.object({
  urgency: UserValueAssessmentSchema.describe('User assessment for Level of Urgency.'),
  marketImpact: UserValueAssessmentSchema.describe('User assessment for Market Impact.'),
  strategic: UserValueAssessmentSchema.describe('User assessment for Strategic value.'),
  revenue: UserValueAssessmentSchema.describe('User assessment for Maximise Revenue.'),
  cost: UserValueAssessmentSchema.describe('User assessment for Minimize Cost.'),
  overallConsiderations: z
    .string()
    .optional()
    .describe('Overall considerations or consequences if the epic is not worked on.'),
});

export type DetermineValueTypeInput = z.infer<typeof DetermineValueTypeInputSchema>;

// Output schema remains the same: AI's final determination for each category
const ValueTypeResultSchema = z.enum(['high', 'mid', 'low']);

const DetermineValueTypeOutputSchema = z.object({
  urgency: ValueTypeResultSchema.describe('The AI-determined urgency value type.'),
  marketImpact: ValueTypeResultSchema.describe('The AI-determined market impact value type.'),
  strategic: ValueTypeResultSchema.describe('The AI-determined strategic value type.'),
  revenue: ValueTypeResultSchema.describe('The AI-determined revenue value type.'),
  cost: ValueTypeResultSchema.describe('The AI-determined cost value type.'),
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
  prompt: `You are an AI assistant helping to finalize the value type assessment for a project or epic.
The user has provided an initial assessment for each category by selecting a level (high, mid, or low) and optional notes.
Your task is to analyze all provided information, including the user's selections, notes, and overall considerations, to determine the most appropriate final value type (high, mid, or low) for each of the five categories.

User's Initial Assessment:
- Level of Urgency: Level: {{{urgency.level}}}, Notes: "{{{urgency.notes}}}"
- Market Impact: Level: {{{marketImpact.level}}}, Notes: "{{{marketImpact.notes}}}"
- Strategic: Level: {{{strategic.level}}}, Notes: "{{{strategic.notes}}}"
- Maximise Revenue: Level: {{{revenue.level}}}, Notes: "{{{revenue.notes}}}"
- Minimize Cost: Level: {{{cost.level}}}, Notes: "{{{cost.notes}}}"

Overall Considerations (what would happen if we don’t work on the epic right now?): "{{{overallConsiderations}}}"

Based on all this information, output your final determination for each category as 'high', 'mid', or 'low'.
Explain your reasoning if your determination differs from the user's initial assessment or if the notes significantly influence your decision.
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
    // The AI will determine the final output based on the structured input.
    // The prompt guides the AI to consider the user's input but make its own final judgment.
    const {output} = await prompt(input);
    return output!;
  }
);
