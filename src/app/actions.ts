'use server';

import { analyzeUrl, AnalyzeUrlInput, AnalyzeUrlOutput } from '@/ai/flows/analyze-url'; // Using Langchain direct implementation
import { z } from 'zod';

const UrlSchema = z.object({
  // Relaxed URL validation to allow inputs without scheme, will add scheme later
  url: z.string().min(1, { message: 'La URL no puede estar vacía.'}), // Translate validation message
});

interface ActionResult {
  success: boolean;
  data?: AnalyzeUrlOutput & { url?: string }; // Include original URL if needed by UI
  error?: string;
  validationErrors?: { url?: string[] };
  timestamp?: number; // Add timestamp to force state update
}

export async function checkUrlSafety(prevState: any, formData: FormData): Promise<ActionResult> {
  console.log('[Action] checkUrlSafety invoked.');
  const urlInput = formData.get('url') as string;
  console.log('[Action] Received URL input:', urlInput);


  const validationResult = UrlSchema.safeParse({ url: urlInput });

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;
    console.warn('[Action] Input validation failed:', errors);
    return {
      success: false,
      validationErrors: errors,
      error: errors.url?.[0] || 'Formato de entrada inválido.', // Translate default validation error
      timestamp: Date.now(), // Add timestamp to error state
    };
  }

  const validatedUrl = validationResult.data.url;
  let formattedUrl = validatedUrl;

  // Ensure the URL starts with http:// or https:// for consistency and validity
  try {
      console.log(`[Action] Attempting to normalize URL: ${validatedUrl}`);
      // Attempt to create a URL object to normalize and validate further
      if (!validatedUrl.startsWith('http://') && !validatedUrl.startsWith('https://')) {
          // Default to https if no scheme is provided
          formattedUrl = `https://${validatedUrl}`;
          console.log(`[Action] Added https:// scheme: ${formattedUrl}`);
      }
      // Validate the potentially modified URL
      const urlObject = new URL(formattedUrl);
      formattedUrl = urlObject.toString(); // Use the validated and potentially normalized URL
       console.log(`[Action] Normalized URL: ${formattedUrl}`);
  } catch (e) {
       console.warn(`[Action] Invalid URL structure after normalization attempt: ${formattedUrl}`, e);
       // Translate URL structure error message
       return {
        success: false,
        validationErrors: { url: ['Estructura de URL inválida. Por favor, introduce un dominio válido o una URL completa (ej., ejemplo.com o https://ejemplo.com).'] },
        error: 'Estructura de URL inválida.',
        timestamp: Date.now(), // Add timestamp to error state
      };
  }


  try {
    console.log(`[Action] Calling analyzeUrl for: ${formattedUrl}`);
    const input: AnalyzeUrlInput = { url: formattedUrl };
    const result = await analyzeUrl(input); // Assuming analyzeUrl is async
    console.log(`[Action] Received result for ${formattedUrl}:`, result);
    // Pass the original formatted URL back if needed, or use result.originalUrl
    return { success: true, data: { ...result, url: formattedUrl }, timestamp: Date.now() };
  } catch (error) {
    console.error(`[Action] Error during analyzeUrl call for (${formattedUrl}):`, error);

    // Ensure we extract the message safely, providing a default (translated)
    let errorMessage = 'Ocurrió un error inesperado durante el análisis de la URL.';
    if (error instanceof Error) {
        errorMessage = error.message; // Use the specific error message from analyzeUrl
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        try {
            const errorString = JSON.stringify(error);
            // Translate unknown error message
            errorMessage = errorString.length < 200 ? `Ocurrió un error desconocido: ${errorString}` : 'Ocurrió un error desconocido (detalles en los logs del servidor).';
        } catch (stringifyError) {
            console.error("[Action] Could not stringify error object:", stringifyError);
            // Fallback to the default message if stringify fails
        }
    }

    console.log(`[Action] Returning error state: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage, // Pass the refined error message to the client
      timestamp: Date.now(), // Add timestamp to error state
    };
  }
}
