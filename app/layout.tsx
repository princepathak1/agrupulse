import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ThemeLanguageProvider } from '@/components/layout/ThemeLanguageContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AgruPulse MCP | Autonomous Post-Harvest Logistics & Mandi Arbitration Agent',
  description:
    'An MCP-native autonomous multi-agent platform evaluating produce degradation via visual edge AI, dynamic cold-chain telemetry, and automated price arbitration across Indian Mandis.',
  keywords: [
    'AgruPulse',
    'MCP',
    'Model Context Protocol',
    'Post-Harvest Logistics',
    'Mandi Price Arbitration',
    'Agmarknet',
    'e-NAM',
    'YOLOv8',
    'FastMCP',
    'Indian Agriculture',
  ],
  authors: [{ name: 'AgruPulse Team' }],
  openGraph: {
    title: 'AgruPulse MCP - Autonomous Post-Harvest Logistics & Mandi Arbitration',
    description:
      'Connecting edge visual produce decay directly to Mandi prices via MCP agents for autonomous routing decisions.',
    url: 'https://agrupulse-mcp.org',
    siteName: 'AgruPulse MCP',
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          id="theme-init"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('agrupulse-theme');
                const dark = saved === 'dark';
                if (dark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans transition-colors duration-200">
        <ThemeLanguageProvider>{children}</ThemeLanguageProvider>
      </body>
    </html>
  );
}
