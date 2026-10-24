'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Send, ShieldCheck, Heart, Truck, RefreshCw, Award } from 'lucide-react';
import { useToast } from '../providers/ToastProvider';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { success, error } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      error('Please enter a valid royal email address.');
      return;
    }
    setSubscribed(true);
    success('Thank you for subscribing to the Knot & Bloom Gazette!');
    setEmail('');
  };

  return (
    <footer className="bg-charcoal-950 text-ivory-100 border-t border-gold-500/20 pt-16 pb-12">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-gold-500/15">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-4 rounded-xl bg-charcoal-900/60 border border-gold-500/10">
            <div className="w-12 h-12 rounded-full bg-maroon-900/80 flex items-center justify-center text-gold-400 mb-3 border border-gold-500/30">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-semibold text-gold-200">100% Hand-Crocheted</h4>
            <p className="text-xs text-ivory-400 mt-1">Artisan-crafted with pure organic cotton yarn & love</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl bg-charcoal-900/60 border border-gold-500/10">
            <div className="w-12 h-12 rounded-full bg-maroon-900/80 flex items-center justify-center text-gold-400 mb-3 border border-gold-500/30">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-semibold text-gold-200">Express Delivery</h4>
            <p className="text-xs text-ivory-400 mt-1">Carefully packaged and couriered directly with tracking</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl bg-charcoal-900/60 border border-gold-500/10">
            <div className="w-12 h-12 rounded-full bg-maroon-900/80 flex items-center justify-center text-gold-400 mb-3 border border-gold-500/30">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-semibold text-gold-200">Bespoke Commission</h4>
            <p className="text-xs text-ivory-400 mt-1">Custom color palettes and personalization available</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl bg-charcoal-900/60 border border-gold-500/10">
            <div className="w-12 h-12 rounded-full bg-maroon-900/80 flex items-center justify-center text-gold-400 mb-3 border border-gold-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-semibold text-gold-200">Direct Atelier Contact</h4>
            <p className="text-xs text-ivory-400 mt-1">📞 9080236848 | ✉ suresh140105@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Story Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-gold-400 text-xl font-serif">⚜</span>
              <span className="font-serif text-2xl font-bold tracking-[0.16em] text-ivory-100">
                KNOT & BLOOM
              </span>
              <span className="text-gold-400 text-xl font-serif">⚜</span>
            </div>
            <p className="text-sm font-serif italic text-gold-300">
              “Discover Something Worth Keeping.”
            </p>
            <p className="text-xs text-ivory-400 leading-relaxed pr-6">
              Knot & Bloom is a bespoke handcrafted crochet atelier. Every creation is patiently hooked with devoted passion, weaving pure craftsmanship into timeless keepsakes.
            </p>

            {/* Newsletter */}
            <div className="pt-3">
              <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                Stay in the loop
              </p>
              <p className="text-xs text-ivory-400 mb-3">
                Discover new creations, bespoke drops and studio stories.
              </p>
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-charcoal-900 border border-gold-500/30 text-xs px-4 py-2.5 rounded-l-lg text-ivory-100 focus:outline-none focus:border-gold-400 flex-1 placeholder:text-charcoal-500"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-950 px-4 py-2.5 rounded-r-lg font-semibold text-xs hover:from-gold-400 hover:to-gold-500 transition-all flex items-center gap-1.5"
                >
                  <span>Join</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Column 1: Shop Collections */}
          <div>
            <h4 className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-4">
              Portfolio Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-300">
              <li>
                <Link href="/shop?category=crochet-keychains" className="hover:text-gold-300 transition-colors">
                  Crochet Keychains & Charms
                </Link>
              </li>
              <li>
                <Link href="/shop?category=crochet-bags" className="hover:text-gold-300 transition-colors">
                  Crochet Potlis & Bags
                </Link>
              </li>
              <li>
                <Link href="/shop?category=crochet-wear" className="hover:text-gold-300 transition-colors">
                  Crochet Shrugs & Wear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=crochet-flowers" className="hover:text-gold-300 transition-colors">
                  Crochet Flowers & Bouquets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=crochet-home" className="hover:text-gold-300 transition-colors">
                  Crochet Mandalas & Home
                </Link>
              </li>
              <li>
                <a href="tel:+919080236848" className="text-gold-400 font-semibold hover:text-gold-300 transition-colors">
                  📞 Call: 9080236848
                </a>
              </li>
              <li>
                <a href="mailto:suresh140105@gmail.com" className="text-gold-400 font-semibold hover:text-gold-300 transition-colors">
                  ✉ suresh140105@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: About Knot & Bloom */}
          <div>
            <h4 className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-4">
              About Knot & Bloom
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-300">
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors">
                  Our Artisan Story
                </Link>
              </li>
              <li>
                <Link href="/about#craftsmanship" className="hover:text-gold-300 transition-colors">
                  Heritage & Stitches
                </Link>
              </li>
              <li>
                <Link href="/about#workshop" className="hover:text-gold-300 transition-colors">
                  Artisan Studio
                </Link>
              </li>
              <li>
                <Link href="/about#sustainability" className="hover:text-gold-300 transition-colors">
                  100% Pure Yarn Promise
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-300 transition-colors">
                  Contact Our Guild
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div>
            <h4 className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-300">
              <li>
                <Link href="/account/orders" className="hover:text-gold-300 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-gold-300 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold-300 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gold-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold-300 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-300 transition-colors">
                  Help & Concierge
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Payment Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gold-500/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory-400">
        <p>© {new Date().getFullYear()} KNOT & BLOOM. All rights reserved. Curated treasures. Made for your moments.</p>
        
        {/* Atelier Contact Details */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gold-300">
          <span>Bespoke Handcrafted Orders</span>
          <span className="text-gold-500/40">•</span>
          <a href="tel:+919080236848" className="hover:underline text-gold-400 font-semibold">
            📞 9080236848
          </a>
          <span className="text-gold-500/40">•</span>
          <a href="mailto:suresh140105@gmail.com" className="hover:underline text-gold-400 font-semibold">
            ✉ suresh140105@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
