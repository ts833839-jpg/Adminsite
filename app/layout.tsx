import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { CartProvider } from '@/components/providers/CartProvider';
import { WishlistProvider } from '@/components/providers/WishlistProvider';
import { StoreLayoutShell } from '@/components/layout/StoreLayoutShell';

export const metadata: Metadata = {
  title: 'KNOT & BLOOM — Admin Studio & Atelier Command Center',
  description:
    'Dedicated administrative management studio for Knot & Bloom: manage bespoke creations, Cloudinary media, categories, and patron inquiries.',
  robots: {
    index: false,
    follow: false,
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
