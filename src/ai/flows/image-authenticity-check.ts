'use server';
/**
 * @fileOverview This file implements the Genkit flow for checking the authenticity of an image.
 *
 * It allows users to upload an image and receive a confidence percentage indicating whether the image is AI-generated or real.
 *
 * - imageAuthenticityCheck - A function that handles the image authenticity check process.
 * - ImageAuthenticityCheckInput - The input type for the imageAuthenticityCheck function.
 * - ImageAuthenticityCheckOutput - The return type for the imageAuthenticityCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageAuthenticityCheckInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      'A photo to be checked, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});

export type ImageAuthenticityCheckInput = z.infer<typeof ImageAuthenticityCheckInputSchema>;

const ImageAuthenticityCheckOutputSchema = z.object({
  isAiGenerated: z.boolean().describe('Whether the image is AI-generated or not.'),
  confidencePercentage: z.number().describe('The confidence percentage of the analysis.'),
  explanation: z.string().describe('The explanation of the analysis.'),
});

export type ImageAuthenticityCheckOutput = z.infer<typeof ImageAuthenticityCheckOutputSchema>;

export async function imageAuthenticityCheck(
  input: ImageAuthenticityCheckInput
): Promise<ImageAuthenticityCheckOutput> {
  return imageAuthenticityCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageAuthenticityCheckPrompt',
  input: {schema: ImageAuthenticityCheckInputSchema},
  output: {schema: ImageAuthenticityCheckOutputSchema},
  prompt: `You are an expert in identifying AI-generated images.

You will be provided with an image, and your task is to determine if it is AI-generated or real.

Analyze the image and provide:
- isAiGenerated: true if the image is AI-generated, false if it is real.
- confidencePercentage: A percentage (0-100) indicating your confidence in the determination.
- explanation: A brief explanation of your analysis, including the characteristics that lead to your conclusion.

Image: {{media url=imageDataUri}}`,
});

const imageAuthenticityCheckFlow = ai.defineFlow(
  {
    name: 'imageAuthenticityCheckFlow',
    inputSchema: ImageAuthenticityCheckInputSchema,
    outputSchema: ImageAuthenticityCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
