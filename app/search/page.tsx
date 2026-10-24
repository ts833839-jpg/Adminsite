'use client';

import { Suspense } from 'react';
import ShopPage from '../shop/page';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory-100 flex items-center justify-center py-24">
          <div className="text-center space-y-3">
            <span className="text-3xl text-gold-600 font-serif animate-spin inline-block">⚜</span>
            <p className="font-serif text-lg text-maroon-950 font-bold">Searching Royal Treasures...</p>
          </div>
        </div>
      }
    >
      <ShopPage />
    </Suspense>
  );
}

