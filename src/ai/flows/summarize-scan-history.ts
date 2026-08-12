'use server';

/**
 * @fileOverview Summarizes a user's scan history to provide an overview of their security posture.
 *
 * - summarizeScanHistory - A function that summarizes the scan history.
 * - SummarizeScanHistoryInput - The input type for the summarizeScanHistory function.
 * - SummarizeScanHistoryOutput - The return type for the summarizeScanHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeScanHistoryInputSchema = z.object({
  scanHistory: z
    .string()
    .describe(
      'A string containing the user scan history. Each entry should include the type of scan, the date, and any relevant results.'
    ),
});
export type SummarizeScanHistoryInput = z.infer<typeof SummarizeScanHistoryInputSchema>;

const SummarizeScanHistoryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the user scan history, highlighting key security risks and overall security posture.'
    ),
});
export type SummarizeScanHistoryOutput = z.infer<typeof SummarizeScanHistoryOutputSchema>;

export async function summarizeScanHistory(
  input: SummarizeScanHistoryInput
): Promise<SummarizeScanHistoryOutput> {
  return summarizeScanHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeScanHistoryPrompt',
  input: {schema: SummarizeScanHistoryInputSchema},
  output: {schema: SummarizeScanHistoryOutputSchema},
  prompt: `You are a cybersecurity expert. Summarize the following scan history to provide an overview of the user's security posture, including potential risks and recommendations for improvement.\n\nScan History:\n{{{scanHistory}}}`,
});

const summarizeScanHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeScanHistoryFlow',
    inputSchema: SummarizeScanHistoryInputSchema,
    outputSchema: SummarizeScanHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
