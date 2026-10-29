// ============================================================================
// app/layout.tsx
// ============================================================================
import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, Space_Mono } from 'next/font/google';
import './globals.css';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { FloatingYarnThreads } from '@/components/ui/FloatingYarnThreads';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kaku Craft • Artisanal Crochet & Fiber Studio',
  description:
    'Hand-crocheted sculptural cardigans, heirloom amigurumi dolls, and bespoke fiber artifacts made in Addis Ababa.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} ${spaceMono.variable} scroll-smooth`}
    >
      <body className="bg-[#FDFBF7] text-[#2C302E] font-sans antialiased selection:bg-[#D4A373] selection:text-white min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Global Custom Cursor */}
        <CustomCursor />

        <div className="min-h-screen bg-[#FDFBF7] text-[#2C302E] font-sans antialiased selection:bg-[#D4A373] selection:text-white relative">
          {/* Global 3D Organic Spun Yarn Filament Simulation */}
          <FloatingYarnThreads />

          {/* Global Navigation */}
          <Navigation cartCount={2} />

          {/* Main Content Layered above the thread */}
          <div className="relative z-10">
            {children}
          </div>

          {/* Global Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}