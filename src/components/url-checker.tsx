'use client';

import { useState, useEffect, useRef, useActionState, startTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SafetyReport } from '@/components/safety-report';
import { checkUrlSafety } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import type { AnalyzeUrlOutput } from '@/ai/flows/analyze-url'; // Keep type, structure is the same
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Removed Alert imports as errors are handled by toast

interface ActionResultState {
  success: boolean;
  data?: AnalyzeUrlOutput & { url?: string }; // Expect URL possibly in data
  error?: string;
  validationErrors?: { url?: string[] };
  timestamp?: number; // Add timestamp to force state update
}

const initialState: ActionResultState = {
  success: false,
  timestamp: 0,
};


export function UrlChecker() {
  const [state, formAction, isPending] = useActionState(checkUrlSafety, initialState);
  const [showReport, setShowReport] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(''); // Store the URL being analyzed for display
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Moved useRef outside useEffect
  const lastErrorTimestamp = useRef<number | undefined>(initialState.timestamp);


  // Effect to handle state changes from the action
  useEffect(() => {
    console.log("Client: State updated:", state);
    if (state.success && state.data) {
       const submittedUrl = state.data.url || state.data.originalUrl;
       console.log(`Client: Success state for URL: ${submittedUrl}. Currently analyzing: ${currentUrl}`);
       // Normalize URLs for comparison (basic: remove trailing slash)
       const normalize = (u: string | undefined) => u?.replace(/\/$/, '');
       if (submittedUrl && normalize(submittedUrl) === normalize(currentUrl)) {
          console.log("Client: Success state matches current analysis, showing report.");
          setShowReport(true);
          setTimeout(() => {
             reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
       } else {
         console.log("Client: Stale success state detected or URL mismatch, not showing report.");
         // setShowReport(false); // Avoid hiding potentially valid older reports if needed
       }
    } else if (!state.success && (state.error || state.validationErrors) && state.timestamp && state.timestamp !== lastErrorTimestamp.current) {
      // Handle errors
      const errorMessage = state.error || state.validationErrors?.url?.[0] || 'Ocurrió un error inesperado.'; // Translate default error
      console.log("Client: Error state received, showing toast:", errorMessage);

        toast({
         variant: "destructive",
         title: state.validationErrors ? "Entrada Inválida" : "Error de Análisis", // Translate title
         description: errorMessage,
        });

       lastErrorTimestamp.current = state.timestamp;
       setShowReport(false); // Hide report on new error
    } else if (!state.success && !state.error && !state.validationErrors && state.timestamp && state.timestamp !== lastErrorTimestamp.current) {
         // Handle cases where success is false but no specific error is provided
         console.warn("Client: Received non-success state without specific error message.");
          toast({
             variant: "destructive",
             title: "Error", // Translate title
             description: "Ocurrió un error desconocido durante el análisis.", // Translate description
            });
         lastErrorTimestamp.current = state.timestamp;
         setShowReport(false);
    }

  }, [state, toast, currentUrl]);

  // Effect to manage UI changes based on pending state
  useEffect(() => {
    if (isPending) {
      console.log("Client: Action pending, hiding report and capturing URL.");
      setShowReport(false);
      if (inputRef.current?.value) {
         // Capture the *submitted* value for comparison later
         const submittedValue = inputRef.current.value;
         setCurrentUrl(submittedValue); // Update state for display during loading
         console.log(`Client: Captured URL for pending analysis: ${submittedValue}`);
      } else {
          setCurrentUrl('');
          console.log("Client: Input is empty, clearing currentUrl.");
      }
    }
  }, [isPending]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const urlValue = formData.get('url') as string;

    if (!urlValue?.trim()) {
      toast({
        variant: "destructive",
        title: "Error de Entrada", // Translate title
        description: "La URL no puede estar vacía.", // Translate description
      });
      return;
    }

    console.log(`Client: Submitting form for URL: ${urlValue}`);
    // No need to set currentUrl here, it's handled in the isPending effect
    startTransition(() => {
      console.log(`Client: Starting transition for action with URL: ${urlValue}`);
      formAction(formData);
    });
  };


  return (
    <div className="w-full max-w-2xl space-y-6">
      <Card className="shadow-lg dark:shadow-xl border border-border/50">
        <CardHeader>
            {/* Updated Title in Spanish */}
            <CardTitle className="text-2xl text-center font-semibold text-primary dark:text-primary-foreground">Comprobar Riesgo de URL</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                ref={inputRef}
                type="text"
                name="url"
                placeholder="ejemplo.com o https://ejemplo.com" // Translate placeholder
                aria-label="URL a comprobar" // Translate aria-label
                required
                className="flex-grow text-base border-input focus:border-ring focus:ring-1 focus:ring-ring"
                disabled={isPending}
                aria-invalid={!!state.validationErrors?.url}
              />
               <Button type="submit" disabled={isPending} className="w-full sm:w-auto bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90">
                 {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                 Comprobar URL {/* Translate button text */}
               </Button>
            </div>
          </form>
        </CardContent>
      </Card>

         {isPending && (
            <div className="mt-6 flex justify-center items-center flex-col text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              {/* Updated loading text in Spanish */}
              <p className="mt-2 text-sm break-all px-2">Analizando URL: {currentUrl || '...'} </p>
            </div>
          )}

        <div ref={reportRef}>
             <div className={`transition-opacity duration-500 ease-in-out ${showReport && !isPending && state.success ? 'opacity-100' : 'opacity-0'}`}>
                {state.success && state.data && (showReport && !isPending) && (
                   <div className="mt-6">
                     {/* Pass the URL from the successful state data */}
                     <SafetyReport result={state.data} url={state.data.url || state.data.originalUrl} />
                   </div>
                 )}
                 {!(showReport && !isPending && state.success) && <div className="h-0 overflow-hidden pointer-events-none"></div>}
            </div>
        </div>
    </div>
  );
}
