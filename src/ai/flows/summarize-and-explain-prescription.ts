'use server';
/**
 * @fileOverview Summarizes and explains a patient's prescription using AI.
 *
 * - summarizeAndExplainPrescription - A function that takes prescription text as input and returns a summarized explanation.
 * - SummarizeAndExplainPrescriptionInput - The input type for the summarizeAndExplainPrescription function.
 * - SummarizeAndExplainPrescriptionOutput - The return type for the summarizeAndExplainPrescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAndExplainPrescriptionInputSchema = z.object({
  prescriptionText: z
    .string()
    .describe('The full text of the prescription to be summarized and explained.'),
});
export type SummarizeAndExplainPrescriptionInput = z.infer<
  typeof SummarizeAndExplainPrescriptionInputSchema
>;

const SummarizeAndExplainPrescriptionOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the prescription.'),
  explanation: z
    .string()
    .describe('A detailed explanation of the prescription, including medication instructions and potential side effects.'),
});
export type SummarizeAndExplainPrescriptionOutput = z.infer<
  typeof SummarizeAndExplainPrescriptionOutputSchema
>;

export async function summarizeAndExplainPrescription(
  input: SummarizeAndExplainPrescriptionInput
): Promise<SummarizeAndExplainPrescriptionOutput> {
  return summarizeAndExplainPrescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAndExplainPrescriptionPrompt',
  input: {schema: SummarizeAndExplainPrescriptionInputSchema},
  output: {schema: SummarizeAndExplainPrescriptionOutputSchema},
  prompt: `You are a helpful AI assistant that specializes in summarizing and explaining medical prescriptions for patients.

  Please provide a concise summary and a detailed explanation of the following prescription text, including medication instructions and potential side effects.

  Prescription Text: {{{prescriptionText}}}

  Summary:
  Explanation: `,
});

const summarizeAndExplainPrescriptionFlow = ai.defineFlow(
  {
    name: 'summarizeAndExplainPrescriptionFlow',
    inputSchema: SummarizeAndExplainPrescriptionInputSchema,
    outputSchema: SummarizeAndExplainPrescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
