import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { CartProvider } from '@/components/providers/CartProvider';
import { WishlistProvider } from '@/components/providers/WishlistProvider';
import { StoreLayoutShell } from '@/components/layout/StoreLayoutShell';

export const metadata: Metadata = {
  title: 'KNOT & BLOOM — Handcrafted Crochet Luxury | Discover Something Worth Keeping',
  description:
    'Knot & Bloom is India’s premier handcrafted crochet boutique. Explore artisan crochet keychains, royal potli bags, luxury shrugs, everlasting yarn flower bouquets, and keepsake gifts made with pure organic yarn.',
  keywords: [
    'Knot and Bloom',
    'Knot & Bloom',
    'crochet boutique',
    'handcrafted crochet India',
    'crochet keychain',
    'crochet bag',
    'crochet potli',
    'crochet shrug',
    'crochet flowers bouquet',
    'bespoke artisan crochet',
    'luxury crochet gifts',
  ],
  openGraph: {
    title: 'KNOT & BLOOM — Discover Something Worth Keeping',
    description: 'India’s premier handcrafted luxury crochet boutique.',
    url: 'https://knotandbloom.in',
    siteName: 'KNOT & BLOOM',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-ivory-100 text-charcoal-900 selection:bg-gold-500 selection:text-maroon-950">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <StoreLayoutShell>{children}</StoreLayoutShell>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
