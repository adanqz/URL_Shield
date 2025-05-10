import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/contexts/theme-provider';
import { ThemeSwitcher } from '@/components/theme-switcher';

export const metadata: Metadata = {
  title: 'No+UsurpaciónDeIdentidad',
  description: 'Comprueba URLs en busca de riesgos potenciales usando un modelo TensorFlow simulado',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${GeistSans.variable} antialiased`}>
        <ThemeProvider defaultTheme="light" storageKey="app-ui-theme">
          <div className="relative flex min-h-screen flex-col">
            <div className="absolute top-4 right-4 z-50">
              <ThemeSwitcher />
            </div>
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
