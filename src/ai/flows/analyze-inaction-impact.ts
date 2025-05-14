// 'use server';

/**
 * @fileOverview Analyzes the potential consequences of inaction on an epic and adjusts value types.
 *
 * - analyzeInactionImpact - A function that handles the analysis of inaction impact.
 * - AnalyzeInactionImpactInput - The input type for the analyzeInactionImpact function.
 * - AnalyzeInactionImpactOutput - The return type for the analyzeInactionImpact function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeInactionImpactInputSchema = z.object({
  inactionImpactDescription: z
    .string()
    .describe('Description of what would happen if we don’t work on the epic right now.'),
});
export type AnalyzeInactionImpactInput = z.infer<typeof AnalyzeInactionImpactInputSchema>;

const AnalyzeInactionImpactOutputSchema = z.object({
  valueTypeAdjustments: z
    .string()
    .describe(
      'An analysis of how the inaction impact affects different value types (urgency, market impact, strategic alignment, revenue, cost) and any adjustments that should be made to their priority.  Explain your reasoning.'
    ),
});
export type AnalyzeInactionImpactOutput = z.infer<typeof AnalyzeInactionImpactOutputSchema>;

export async function analyzeInactionImpact(
  input: AnalyzeInactionImpactInput
): Promise<AnalyzeInactionImpactOutput> {
  return analyzeInactionImpactFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeInactionImpactPrompt',
  input: {schema: AnalyzeInactionImpactInputSchema},
  output: {schema: AnalyzeInactionImpactOutputSchema},
  prompt: `You are an AI assistant that analyzes the impact of not working on an epic and how it affects different value types.

  Based on the following description of what would happen if we don’t work on the epic right now, analyze the potential consequences and determine or adjust the value types (urgency, market impact, strategic, revenue, cost). Explain your reasoning for each adjustment.

  Inaction Impact Description: {{{inactionImpactDescription}}}
  `,
});

const analyzeInactionImpactFlow = ai.defineFlow(
  {
    name: 'analyzeInactionImpactFlow',
    inputSchema: AnalyzeInactionImpactInputSchema,
    outputSchema: AnalyzeInactionImpactOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
