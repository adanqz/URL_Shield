import { UrlChecker } from '@/components/url-checker';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-gradient-to-br from-background to-secondary">
      <div className="z-10 w-full max-w-2xl items-center justify-between text-sm lg:flex flex-col">
        <h1 className="text-4xl font-bold mb-2 text-center text-foreground">
          No+UsurpaciónDeIdentidad
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center">
          Introduce una URL para comprobar su riesgo potencial usando un modelo TensorFlow simulado.
        </p>
        <UrlChecker />
         <footer className="mt-12 text-center text-muted-foreground text-xs">
           Análisis basado en un modelo simulado de TensorFlow/Keras. Puede no ser 100% preciso. Siempre ten precaución.
         </footer>
      </div>
    </main>
  );
}
