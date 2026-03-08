import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display' });

export const metadata: Metadata = {
  title: 'Thapong Visual Art Centre - The Heart of Botswana\'s Art',
  description: 'The Africa Arts Hub is a digital marketplace for artists from Thapong Visual Art Centre to showcase their work and connect with international collectors.',
  keywords: ['Botswana Art', 'African Art', 'Art Marketplace', 'Contemporary Art', 'Thapong'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfairDisplay.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
