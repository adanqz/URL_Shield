'use client';

import type { AnalyzeUrlOutput } from '@/ai/flows/analyze-url'; // Type definition remains useful
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, ExternalLink, Link, Cpu, Activity, AlertTriangle, ListChecks, XCircle, List } from 'lucide-react'; // Added Cpu, Activity, AlertTriangle, List
import { Separator } from './ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"


interface SafetyReportProps {
  result: AnalyzeUrlOutput & { url?: string };
  url?: string; // Allow URL to be passed explicitly (fallback)
}

// Translate risk parameters descriptions
const riskParameters = [
    { name: 'Longitud de URL', description: 'URLs anormalmente largas pueden ocultar intenciones maliciosas.' },
    { name: 'Antigüedad del Dominio', description: 'Dominios muy nuevos a veces se usan para estafas de corta duración.' },
    { name: 'Uso de HTTPS', description: 'La falta de HTTPS (conexión segura) es un riesgo, especialmente para sitios sensibles.' },
    { name: 'Subdominios', description: 'Subdominios excesivos o sospechosos pueden ocultar el sitio verdadero.' },
    { name: 'Palabras Clave', description: 'Intentos de phishing a menudo usan palabras clave como "login", "verify", "update".' },
    { name: 'URL con Dirección IP', description: 'Usar una dirección IP en lugar de un nombre de dominio puede ser sospechoso.' },
    { name: 'TLDs de Riesgo', description: 'Ciertos dominios de nivel superior (ej., .zip, .xyz) a veces se asocian con mayor riesgo.' },
    { name: 'Estado en Listas Negras', description: 'Comprueba si el dominio está listado en bases de datos de amenazas conocidas.' },
    { name: 'Estructura de la Ruta', description: 'Rutas de URL inusualmente largas o complejas pueden indicar riesgo.' },
    { name: 'Acortadores de URL', description: 'Aunque convenientes, ocultan la URL de destino final.' },
    { name: 'Typosquatting', description: 'URLs que imitan sitios populares con ligeros errores de ortografía.' },
];


export function SafetyReport({ result, url: explicitUrl }: SafetyReportProps) {
  const { isMalicious, maliciousnessScore, report, originalUrl } = result;
  const displayUrl = explicitUrl || originalUrl || result.url || 'N/A';
  const scorePercentage = Math.round(maliciousnessScore * 100);

  const getScoreColorClass = (score: number) => {
    if (score < 30) return 'text-green-600 dark:text-green-400'; // Seguro
    if (score < 70) return 'text-yellow-600 dark:text-yellow-400'; // Potencialmente riesgoso
    return 'text-destructive'; // Alto Riesgo / Malicioso
  };

   const getProgressGradient = () => {
       // Adjust gradient based on score for better visual feedback
        if (scorePercentage < 30) return 'bg-green-500';
        if (scorePercentage < 70) return 'bg-gradient-to-r from-green-500 to-yellow-500';
       return 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500';
   }

   const getBadgeVariant = (isMalicious: boolean, score: number): 'default' | 'destructive' | 'secondary' => {
     if (isMalicious) return 'destructive';
     if (score > 0.7) return 'destructive'; // Also destructive for high scores
     if (score > 0.3) return 'secondary'; // Use secondary for potentially risky
     // Use a success-like style for likely safe
     return score < 0.1 ? 'default' : 'secondary'; // default for very safe, secondary otherwise
   };

    // Translate badge text
    const getBadgeText = (isMalicious: boolean, score: number) => {
        if (isMalicious) return 'Alto Riesgo'; // Changed from Malicious
        if (score > 0.7) return 'Alto Riesgo';
        if (score > 0.3) return 'Potencialmente Riesgoso';
        return 'Probablemente Seguro';
    };

   const getIcon = (isMalicious: boolean, score: number) => {
       if (isMalicious || score > 0.7) {
           return <ShieldAlert className="h-8 w-8 text-destructive flex-shrink-0" />;
       } else if (score > 0.3) {
            return <AlertTriangle className="h-8 w-8 text-yellow-500 flex-shrink-0" />; // Changed icon for potentially risky
       } else {
           return <ShieldCheck className="h-8 w-8 text-green-500 flex-shrink-0" />;
       }
   }

   // Parse the report string into a list of findings (keep logic, translate output if needed later)
    const parseReportFindings = (reportString: string | undefined): string[] => {
        if (!reportString || !reportString.includes('\n')) {
            return []; // Expecting the header line now
        }
        const lines = reportString.split('\n');
        // Skip the first line (header) and filter
        // Remove the confidence score line if present
        // Translate the "likely safe" message filter
        return lines.slice(1) // Start from the second line
                    .map(line => line.trim().replace(/^- /, ''))
                    .filter(line => Boolean(line) && !line.startsWith('Confidence Score:') && !line.toLowerCase().includes('probablemente seguro basado en las características evaluadas') && !line.toLowerCase().includes('likely safe based on evaluated features')); // Filter out specific safe message in Spanish and English
    };


    const findings = parseReportFindings(report);
    const noRisksFound = findings.length === 0;
    const modelName = "TensorFlow/Keras Simulado"; // Translate model name

  return (
    <Card className="w-full shadow-md dark:shadow-lg animate-fade-in border">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
           {getIcon(isMalicious, maliciousnessScore)}
           <div className="flex flex-col min-w-0">
             <CardTitle className="text-xl font-semibold break-all line-clamp-2">
               {displayUrl !== 'N/A' ? displayUrl : 'Análisis de URL'} {/* Translate fallback title */}
             </CardTitle>
             <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1 cursor-default">
                            <Cpu className="h-3 w-3" /> Modelo: {modelName} {/* Use translated model name */}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start">
                         {/* Translate tooltip */}
                        <p>Análisis realizado usando un modelo {modelName}.</p>
                    </TooltipContent>
                </Tooltip>
             </TooltipProvider>
           </div>
        </div>
        <Badge variant={getBadgeVariant(isMalicious, maliciousnessScore)} className="text-sm shrink-0 mt-2 sm:mt-0">
           {getBadgeText(isMalicious, maliciousnessScore)} {/* Use translated badge text */}
        </Badge>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="space-y-6 pt-4">
        {/* Risk Score Section */}
        <div>
          {/* Translate section title */}
          <p className="text-sm font-medium text-muted-foreground mb-2">Puntuación de Evaluación de Riesgo</p>
          <div className="flex items-center gap-3">
            <Progress
              value={scorePercentage}
              className={`w-full h-3 [&>div]:${getProgressGradient()}`}
              aria-label={`Puntuación de riesgo: ${scorePercentage}%`} // Translate aria-label
            />
             <span className={`font-semibold text-lg ${getScoreColorClass(scorePercentage)}`}>
                 {scorePercentage}%
             </span>
          </div>
           {/* Translate description */}
           <p className="text-xs text-muted-foreground mt-1">
               (0% = Probablemente Seguro, 100% = Alto Riesgo) - Basado en la predicción del {modelName}
            </p>
        </div>

        {/* Model Analysis Details Section */}
        <div>
           {/* Translate section title */}
          <p className="text-sm font-medium text-muted-foreground mb-2">Detalles del Análisis del Modelo</p>
          <Card className="bg-secondary/50 dark:bg-secondary/30 p-4 border border-border/50 shadow-inner">
             {noRisksFound ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ListChecks className="h-4 w-4 text-green-500" />
                    {/* Translate 'no risks found' message */}
                    <span>{modelName}: No se identificaron factores de riesgo específicos para esta URL según el análisis.</span>
                </div>
             ) : (
                <ul className="space-y-2 text-sm text-foreground">
                  {findings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-2">
                      {/* Use AlertTriangle for findings unless explicitly malicious */}
                      {isMalicious ?
                         <Activity className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" /> :
                         <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      }
                      {/* Display findings as they are (potentially in English from the service) */}
                      <span>{finding.startsWith('-') ? finding.substring(1).trim() : finding}</span>
                    </li>
                  ))}
                </ul>
             )}
             {/* Provide a fallback if the report structure is unexpected */}
             {/* Translate fallback message */}
             {report && findings.length === 0 && !report.toLowerCase().includes("probablemente seguro") && !report.toLowerCase().includes("likely safe") && (
                 <p className="text-sm text-muted-foreground italic mt-2">Nota: No se pudieron analizar los hallazgos detallados del informe del modelo, pero la URL no se clasificó como definitivamente segura.</p>
             )}
          </Card>
        </div>

        {/* Common Risk Factors Section */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="risk-factors">
            <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:no-underline">
                <div className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                     {/* Translate accordion trigger */}
                    Factores de Riesgo Comunes Considerados en URLs
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
               <Card className="bg-background p-4 border border-border/50">
                <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-5">
                    {riskParameters.map((param) => (
                    <li key={param.name}>
                         {/* Use translated parameter names and descriptions */}
                        <span className="font-medium text-foreground/80">{param.name}:</span> {param.description}
                    </li>
                    ))}
                </ul>
                {/* Translate note */}
                <p className="text-xs italic mt-3 text-muted-foreground/80">Nota: Esta es una lista general; el modelo analiza características específicas derivadas de estos conceptos.</p>
               </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </CardContent>
       <Separator className="mt-4" />
       <CardFooter className="text-xs text-muted-foreground justify-between items-center pt-4 flex-wrap gap-2">
           {/* Translate footer message */}
          <span>Análisis de {modelName}. Verifica antes de visitar.</span>
          {displayUrl !== 'N/A' ? (
             <a
               href={displayUrl.startsWith('http') ? displayUrl : `https://${displayUrl}`} // Ensure URL starts with http(s)
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center text-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed font-medium"
               aria-disabled={displayUrl === 'N/A'}
              onClick={(e) => {
                  // Use score >= 50 for warning threshold
                  if (maliciousnessScore >= 0.5) {
                       // Translate confirmation message
                       if (!confirm(`Advertencia: Esta URL (${displayUrl}) tiene una puntuación de riesgo de ${scorePercentage}% según el análisis de ${modelName}.\n\nRiesgos potenciales identificados:\n${findings.join('\n') || 'Detalles no disponibles.'}\n\n¿Deseas continuar?`)) {
                           e.preventDefault();
                      }
                  }
              }}
             >
                Visitar URL (Precaución) <ExternalLink className="ml-1 h-3 w-3" /> {/* Translate link text */}
             </a>
           ) : (
             <span className="inline-flex items-center text-muted-foreground">
                No hay URL para visitar <Link className="ml-1 h-3 w-3" /> {/* Translate fallback text */}
             </span>
           )}
       </CardFooter>
    </Card>
  );
}
