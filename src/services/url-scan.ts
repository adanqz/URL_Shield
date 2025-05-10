/**
 * Represents the result of a simulated TensorFlow/Keras URL analysis.
 */
export interface URLAnalysisResult {
  /**
   * A boolean indicating whether the simulated model classified the URL as malicious.
   */
  isMalicious: boolean;
  /**
   * A score from 0 to 1 indicating the perceived risk based on the simulated model.
   */
  maliciousnessScore: number;
  /**
   * A report summarizing the findings from the simulated model.
   */
  report: string;
}

// List of simulated features the "model" might consider (in Spanish)
const SIMULATED_FEATURES = [
    'Longitud de URL',
    'Antigüedad del Dominio (Simulado)',
    'Presencia de HTTPS',
    'Número de Subdominios',
    'Análisis de Palabras Clave (ej., "login", "update")',
    'Uso de Dirección IP',
    'TLDs de Riesgo Conocidos (.zip, .mov)',
    'Presencia en Lista Negra/Blanca (Búsqueda simulada en BD)',
    'Longitud/Estructura de la Ruta',
    'Uso de Acortadores de URL (Simulado)',
];


/**
 * Asynchronously checks a URL using a *simulated* TensorFlow/Keras model
 * to determine potential maliciousness. This mimics the process without
 * actually running a Python backend.
 * (Checks a URL using a simulated TF model - Spanish)
 * Comprueba asíncronamente una URL usando un modelo TensorFlow/Keras *simulado*
 * para determinar la posible malicia. Esto imita el proceso sin
 * ejecutar realmente un backend de Python.
 *
 * @param url The URL to check. (La URL a comprobar.)
 * @returns A promise that resolves to a URLAnalysisResult object. (Una promesa que resuelve a un objeto URLAnalysisResult.)
 */
export async function checkUrlWithSimulatedTF(url: string): Promise<URLAnalysisResult> {
  console.log(`Comprobación simulada de TensorFlow/Keras para URL: ${url}`);

  // Simulate TF model processing delay (Simular retraso del procesamiento del modelo TF)
  await new Promise(resolve => setTimeout(resolve, 50)); // Slightly longer delay simulation

  const findings: string[] = [];
  let score = 0.05; // Start with a base safety score (Empezar con una puntuación base de seguridad)
  let malicious = false;

   // Simulate Feature Extraction & Model Prediction based on rules (as a proxy)
   // (Simular Extracción de Características y Predicción del Modelo basado en reglas (como proxy))
   console.log(`[TF Simulado] Extrayendo características para ${url}: ${SIMULATED_FEATURES.slice(0, 3).join(', ')}...`);

  // --- Reuse existing rule logic as a proxy for model inference ---
  // --- (Reutilizar lógica de reglas existente como proxy para la inferencia del modelo) ---

  // Feature: Keyword Analysis (Característica: Análisis de Palabras Clave)
  const suspiciousKeywords = ['malicious', 'phishing', 'badsite', 'login-update', 'verify-account', 'actualizar-cuenta', 'verificar-login']; // Add Spanish keywords
  if (suspiciousKeywords.some(keyword => url.toLowerCase().includes(keyword))) {
    // Translate finding
    findings.push('- Alta probabilidad de phishing basada en palabras clave.');
    score = Math.max(score, 0.85);
    malicious = true;
  }

  try {
      const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`); // Handle URLs without scheme

      // Feature: Path Length/Structure & URL Length (Característica: Longitud/Estructura de la Ruta y Longitud de URL)
       if (parsedUrl.pathname.length > 100 || url.length > 150) {
           // Translate finding
           findings.push('- La longitud de la URL o la estructura de la ruta coincide con patrones de riesgo.');
           score = Math.max(score, 0.30);
       }

        // Feature: IP Address Usage (Característica: Uso de Dirección IP)
      const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
       if (ipRegex.test(parsedUrl.hostname)) {
           // Translate finding
           findings.push('- Uso de dirección IP en lugar de dominio detectado (alto riesgo).');
           score = Math.max(score, 0.75);
           malicious = true;
       }

       // Feature: Number of Subdomains (Característica: Número de Subdominios)
       const domainParts = parsedUrl.hostname.split('.');
       if (domainParts.length > 4) {
            // Translate finding
            findings.push('- Excesivos subdominios detectados, indicador potencial de compromiso.');
            score = Math.max(score, 0.40);
       }

       // Feature: Known Risky TLDs (Característica: TLDs de Riesgo Conocidos)
       const riskyTLDs = ['.zip', '.mov', '.xyz', '.tk', '.info'];
       if (riskyTLDs.some(tld => parsedUrl.hostname.endsWith(tld))) {
           // Translate finding
           findings.push(`- Dominio de Nivel Superior de Riesgo (${riskyTLDs.find(tld => parsedUrl.hostname.endsWith(tld))}) identificado.`);
            score = Math.max(score, 0.55);
       }

       // Feature: Presence of HTTPS (Simulated - less score if not present)
       // (Característica: Presencia de HTTPS (Simulado - menor puntuación si no está presente))
       if (parsedUrl.protocol !== 'https:') {
           // Translate finding
           findings.push('- La URL no usa HTTPS.');
           score = Math.max(score, 0.15); // Slight increase if no HTTPS
       }


  } catch (e) {
     // Translate finding
     findings.push('- Fallo al analizar la estructura de la URL (riesgo potencial).');
     score = Math.max(score, 0.50);
  }


  // Feature: Blocklist/Safelist Check (Simulated DB Lookup)
  // (Característica: Comprobación en Lista Negra/Blanca (Búsqueda simulada en BD))
  const blocklist = ['evil-site.com', 'phishers-paradise.net', 'sitio-malo.es']; // Add Spanish example
  const safelist = ['google.com', 'github.com', 'example.com', 'tensorflow.org', 'keras.io', 'google.es']; // Add Spanish example

   try {
        const hostname = new URL(url.startsWith('http') ? url : `http://${url}`).hostname.replace(/^www\./, ''); // Normalize www.
         if (blocklist.some(blocked => hostname.endsWith(blocked))) {
            // Translate finding
            findings.push('- Dominio encontrado en la lista negra de Inteligencia de Amenazas.');
            score = 1.0;
            malicious = true;
         } else if (safelist.some(safe => hostname.endsWith(safe))) {
              // Translate finding
              findings.push('- Dominio confirmado seguro mediante Lista Blanca.');
              score = 0.0;
              malicious = false;
         }
    } catch (e) {
        // Ignore errors here
    }


  // Compile report based on simulated model output (Compilar informe basado en salida simulada del modelo)
  let report: string;
  if (findings.length > 0) {
    // Make report sound more like model output (Hacer que el informe suene más como salida del modelo)
    // Translate report header and confidence score label
    report = `Resultados del Análisis del Modelo TF Simulado:\n${findings.join('\n')}\nPuntuación de Confianza: ${(score * 100).toFixed(0)}% Malicioso`;
  } else {
    // Translate safe classification report
    report = 'Análisis del Modelo TF Simulado: URL clasificada como probablemente segura basado en las características evaluadas. Puntuación de Confianza: 5% Malicioso';
  }

  // Final decision (simulated classification threshold) (Decisión final (umbral de clasificación simulado))
  const finalMalicious = malicious || score > 0.7;


  console.log(`Comprobación simulada TF para ${url}: Malicioso=${finalMalicious}, Puntuación=${score.toFixed(2)}`);
  return {
    isMalicious: finalMalicious,
    maliciousnessScore: parseFloat(score.toFixed(2)),
    report: report, // Report content is now translated
  };
}
