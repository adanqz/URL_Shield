'use server';
/**
 * @fileOverview URL analysis agent (Simulated TensorFlow/Keras).
 *
 * - analyzeUrl - A function that analyzes a URL for malicious content using a simulated TF model.
 * - AnalyzeUrlInput - The input type for the analyzeUrl function.
 * - AnalyzeUrlOutput - The return type for the analyzeUrl function.
 */

import { z } from 'zod';
import { checkUrlWithSimulatedTF, URLAnalysisResult } from '@/services/url-scan'; // Use the simulated TF check

// --- Input and Output Schemas ---

const AnalyzeUrlInputSchema = z.object({
  url: z.string().describe('The URL to analyze.'),
});
export type AnalyzeUrlInput = z.infer<typeof AnalyzeUrlInputSchema>;

// Output schema remains the same structurally
const AnalyzeUrlOutputSchema = z.object({
  isMalicious: z.boolean().describe('Whether the URL is classified as malicious by the simulated TF model.'),
  maliciousnessScore: z
    .number()
    .min(0).max(1)
    .describe('A score from 0 (safe) to 1 (malicious) indicating the likelihood that the URL is malicious, based on the simulated TF model.'),
  report: z.string().describe('A report summarizing the simulated TF model analysis findings.'),
  originalUrl: z.string().optional().describe('The original URL provided by the user.')
});
export type AnalyzeUrlOutput = z.infer<typeof AnalyzeUrlOutputSchema>;


// --- Main Analysis Function (Simulated TF/Keras Backend) ---

export async function analyzeUrl(input: AnalyzeUrlInput): Promise<AnalyzeUrlOutput> {
    console.log(`[analyzeUrl] Starting simulated TF analysis for: ${input.url}`);

    try {
        // 1. Perform simulated TF check
        console.log(`[analyzeUrl] Performing simulated TF check for: ${input.url}`);
        const tfResult: URLAnalysisResult = await checkUrlWithSimulatedTF(input.url);
        console.log('[analyzeUrl] Simulated TF Check Result:', tfResult);

        // 2. Format the result according to the output schema
        const analysisResult: AnalyzeUrlOutput = {
            isMalicious: tfResult.isMalicious,
            maliciousnessScore: tfResult.maliciousnessScore,
            // Report comes directly from the simulated service now
            report: `TensorFlow/Keras (Simulated) Analysis:\n${tfResult.report}`, // Add context prefix
            originalUrl: input.url
        };

        // 3. Validate the final result
        const validatedResult = AnalyzeUrlOutputSchema.safeParse(analysisResult);

        if (!validatedResult.success) {
            console.error("[analyzeUrl] Output validation failed:", validatedResult.error.flatten());
            const errorDetails = validatedResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            throw new Error(`Simulated TF analysis output did not match the expected format. Details: ${errorDetails}`);
        }

        console.log('[analyzeUrl] Validated Simulated TF Result:', validatedResult.data);
        return validatedResult.data;

    } catch (error: unknown) {
        console.error(`[analyzeUrl] Error during simulated TF analysis for URL (${input.url}):`, error);

        let errorMessage = 'Failed to analyze URL due to an internal server error during TF simulation.';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        console.error(`[analyzeUrl] Throwing error: ${errorMessage}`);
        throw new Error(errorMessage);
    }
}
