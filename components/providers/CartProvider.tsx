'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ProductType, ProductVariantType, CartItemType, CouponType } from '@/types';
import { useToast } from './ToastProvider';

interface CartContextType {
  items: CartItemType[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  appliedCoupon: CouponType | null;
  addToCart: (product: ProductType, quantity?: number, variant?: ProductVariantType | null) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponType | null>(null);
  const { success, error, info } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('knotandbloom_cart') || localStorage.getItem('ramazon_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem('knotandbloom_coupon') || localStorage.getItem('ramazon_coupon');
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('knotandbloom_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('knotandbloom_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('knotandbloom_coupon');
        localStorage.removeItem('ramazon_coupon');
      }
    } catch (e) {
      console.error('Failed to save coupon', e);
    }
  }, [appliedCoupon]);

  const addToCart = (product: ProductType, quantity: number = 1, variant?: ProductVariantType | null) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (it) => it.productId === product.id && (variant ? it.variantId === variant.id : !it.variantId)
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        const newItem: CartItemType = {
          id: `${product.id}-${variant?.id || 'standard'}-${Date.now()}`,
          productId: product.id,
          product: product,
          variantId: variant?.id || null,
          variant: variant || null,
          quantity: quantity,
        };
        return [...prev, newItem];
      }
    });

    success(`Added "${product.name}" to your royal collection`);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
    info('Item removed from cart');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, quantity } : it))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      error('Please enter a coupon code.');
      return false;
    }

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, orderAmount: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        error(data.error || 'Invalid or expired coupon code.');
        return false;
      }

      setAppliedCoupon(data.coupon);
      success(`Royal coupon ${cleanCode} applied successfully!`);
      return true;
    } catch (err) {
      // Fallback local validation if offline
      if (cleanCode === 'ROYAL10') {
        setAppliedCoupon({
          id: 'c-royal10',
          code: 'ROYAL10',
          discountType: 'PERCENTAGE',
          discountValue: 10,
          minOrderAmount: 799,
          usageCount: 1,
          isActive: true,
        });
        success('Royal coupon ROYAL10 applied!');
        return true;
      }
      error('Could not apply coupon at this time.');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    info('Coupon code removed');
  };

  const itemCount = useMemo(() => {
    return items.reduce((sum, it) => sum + it.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const price = it.variant?.price || it.product.price;
      return sum + price * it.quantity;
    }, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (subtotal < (appliedCoupon.minOrderAmount || 0)) return 0;

    if (appliedCoupon.discountType === 'PERCENTAGE') {
      const calculated = (subtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscountAmount && calculated > appliedCoupon.maxDiscountAmount) {
        return appliedCoupon.maxDiscountAmount;
      }
      return calculated;
    } else {
      return Math.min(appliedCoupon.discountValue, subtotal);
    }
  }, [subtotal, appliedCoupon]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    // Free shipping above ₹999
    return subtotal >= 999 ? 0 : 79;
  }, [subtotal]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingFee);
  }, [subtotal, discountAmount, shippingFee]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
