'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Grid, Heart, MessageSquare } from 'lucide-react';
import { useWishlist } from '../providers/WishlistProvider';

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount: wishlistCount } = useWishlist();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Portfolio', href: '/shop', icon: Compass },
    { label: 'Collections', href: '/categories', icon: Grid },
    { label: 'Saved', href: '/wishlist', icon: Heart, badge: wishlistCount },
    { label: 'Inquire', href: '/contact', icon: MessageSquare },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-ivory-50/95 backdrop-blur-md border-t border-gold-500/30 shadow-royal px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg relative transition-colors ${
              isActive ? 'text-maroon-900 font-semibold' : 'text-charcoal-600 hover:text-gold-600'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-maroon-900' : 'stroke-[1.8px]'}`} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-maroon-800 text-gold-200 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gold-400">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
