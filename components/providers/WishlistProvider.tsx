'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductType } from '@/types';
import { useToast } from './ToastProvider';

interface WishlistContextType {
  items: ProductType[];
  itemCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: ProductType) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ProductType[]>([]);
  const { success, info } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('knotandbloom_wishlist') || localStorage.getItem('ramazon_wishlist');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load wishlist from storage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('knotandbloom_wishlist', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [items]);

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: ProductType) => {
    if (isInWishlist(product.id)) {
      setItems((prev) => prev.filter((item) => item.id !== product.id));
      info(`Removed "${product.name}" from your wishlist`);
    } else {
      setItems((prev) => [...prev, product]);
      success(`Saved "${product.name}" to your wishlist`);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
    info('Removed item from your wishlist');
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
