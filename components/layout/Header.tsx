'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Package,
  LogOut,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { useWishlist } from '../providers/WishlistProvider';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount: wishlistCount } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>({ suggestions: [], products: [], categories: [] });
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sticky header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live search handler
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults({ suggestions: [], products: [], categories: [] });
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (e) {
        console.error(e);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchModalOpen(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/shop' },
    { label: 'Collections', href: '/categories' },
    { label: 'Keychains', href: '/shop?category=crochet-keychains' },
    { label: 'Potlis & Bags', href: '/shop?category=crochet-bags' },
    { label: 'Crochet Wear', href: '/shop?category=crochet-wear' },
    { label: 'Artisan Story', href: '/about' },
    { label: 'Bespoke Inquiries', href: '/contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-maroon-950 text-gold-200 border-b border-gold-500/20 text-xs py-2 px-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span className="font-light tracking-wide">
              Handcrafted Crochet Atelier • Direct Commissions & Orders
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] text-ivory-300">
            <a href="tel:+919080236848" className="text-gold-400 font-semibold hover:underline">
              📞 9080236848
            </a>
            <span className="text-gold-500/40">|</span>
            <a href="mailto:suresh140105@gmail.com" className="text-ivory-300 hover:text-gold-300 hover:underline">
              ✉ suresh140105@gmail.com
            </a>
            <span className="text-gold-500/40">|</span>
            <span className="text-ivory-300">100% Handcrafted Crochet</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-ivory-100/95 backdrop-blur-md shadow-royal border-b border-gold-500/20 py-2.5'
            : 'bg-ivory-100 border-b border-sand-dark/40 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-maroon-900 hover:text-gold-600 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo & Royal Crest */}
            <Link href="/" className="flex flex-col items-center group">
              <div className="flex items-center gap-1.5">
                <span className="text-gold-500 text-lg leading-none font-serif select-none">⚜</span>
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.16em] text-maroon-900 group-hover:text-gold-600 transition-colors whitespace-nowrap">
                  KNOT & BLOOM
                </span>
                <span className="text-gold-500 text-lg leading-none font-serif select-none">⚜</span>
              </div>
              <span className="text-[9px] tracking-[0.25em] text-maroon-700/80 uppercase font-sans font-medium -mt-1 hidden sm:block">
                Discover Something Worth Keeping
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium tracking-wide text-charcoal-900">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-all duration-200 hover:text-gold-600 relative py-1 ${
                      isActive ? 'text-maroon-900 font-semibold' : 'text-charcoal-800'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-400 to-maroon-700 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Tools (Search, Wishlist, WhatsApp Order, Account) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* WhatsApp Quick Order Button */}
              <a
                href="https://wa.me/919080236848?text=Hello%20Knot%20%26%20Bloom,%20I%20would%20like%20to%20inquire%20about%20a%20handcrafted%20crochet%20creation."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-500/40 text-xs font-semibold text-maroon-950 bg-gold-50/70 hover:bg-gold-100 transition-all shadow-sm"
              >
                <span>💬 WhatsApp 9080236848</span>
              </a>

              {/* Search Trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2.5 text-charcoal-800 hover:text-maroon-900 hover:bg-gold-50 rounded-full transition-all"
                title="Search handcrafted creations"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Saved Pieces / Wishlist */}
              <Link
                href="/wishlist"
                className="p-2.5 text-charcoal-800 hover:text-maroon-900 hover:bg-gold-50 rounded-full transition-all relative"
                title="Saved Creations"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-maroon-800 text-gold-200 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gold-400">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 border border-gold-500/30 rounded-full hover:border-gold-500 hover:bg-gold-50/50 transition-all text-xs font-medium text-maroon-900"
                >
                  <User className="w-4 h-4 text-gold-600" />
                  <span className="hidden md:inline max-w-[80px] truncate">
                    {user ? user.name.split(' ')[0] : 'Account'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gold-600" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-ivory-50 rounded-xl shadow-royal-lg border border-gold-500/30 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                    {user ? (
                      <>
                        <div className="px-4 py-2.5 border-b border-sand-dark/40 bg-gold-50/40">
                          <p className="font-semibold text-maroon-900">{user.name}</p>
                          <p className="text-charcoal-600 truncate">{user.email}</p>
                        </div>

                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-charcoal-800 hover:bg-gold-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-gold-600" />
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-charcoal-800 hover:bg-gold-50 transition-colors"
                        >
                          <Package className="w-4 h-4 text-gold-600" />
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-charcoal-800 hover:bg-gold-50 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-gold-600" />
                          Wishlist
                        </Link>

                        <div className="border-t border-sand-dark/40 my-1" />
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-red-700 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </>
                    ) : (
                      <div className="p-3 text-center">
                        <p className="font-serif text-sm font-bold text-maroon-950 mb-1">
                          Welcome to Knot & Bloom
                        </p>
                        <p className="text-[11px] text-charcoal-600 mb-3">
                          Sign in to track orders and save treasures
                        </p>
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block w-full py-2 bg-maroon-900 text-ivory-100 font-medium rounded-lg text-xs hover:bg-maroon-800 transition-colors"
                        >
                          Sign In / Register
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-full bg-ivory-50 border-b border-gold-500/30 shadow-royal-lg px-6 py-6 space-y-4 animate-in slide-in-from-top-4">
            <div className="grid grid-cols-2 gap-3 pb-4 border-b border-sand-dark/40 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-charcoal-800 hover:text-gold-600 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 text-xs text-charcoal-600">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-maroon-900"
              >
                Our Story
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-maroon-900"
              >
                Customer Support
              </Link>
              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-maroon-900"
              >
                FAQs
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Royal Live Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in">
          <div className="bg-ivory-50 w-full max-w-2xl rounded-2xl shadow-royal-lg border border-gold-500/40 overflow-hidden">
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-sand-dark/40 px-4 py-3">
              <Search className="w-5 h-5 text-gold-600 shrink-0 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search royal crochet keychains, bags, bouquets, wear..."
                className="w-full bg-transparent border-none text-base text-charcoal-900 focus:outline-none placeholder:text-charcoal-400"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 text-charcoal-400 hover:text-maroon-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            {/* Results or Suggestions */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {searchResults.products && searchResults.products.length > 0 ? (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gold-700 font-semibold mb-3">
                    Matching Treasures
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.products.map((p: any) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        onClick={() => setSearchModalOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gold-50 border border-transparent hover:border-gold-300 transition-all"
                      >
                        <div className="w-12 h-12 rounded-lg bg-maroon-950 overflow-hidden shrink-0">
                          <img
                            src={p.images?.[0]?.url || '/products/placeholder-royal.svg'}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-maroon-900 truncate">{p.name}</p>
                          <p className="text-[11px] text-gold-700 font-medium">Bespoke Handcrafted Piece</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Suggestions Chips */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-gold-700 font-semibold mb-2.5">
                  Popular Crochet Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Crochet Lotus Keychain',
                    'Crochet Palace Potli',
                    'Crochet Rose Bouquet',
                    'Crochet Burgundy Shrug',
                    'Crochet Elephant Plushie',
                    'Botanical Bloom Crochet',
                    'Crochet Mandala Coasters',
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setSearchModalOpen(false);
                        router.push(`/shop?search=${encodeURIComponent(chip)}`);
                      }}
                      className="px-3 py-1.5 text-xs bg-gold-100/60 hover:bg-gold-200 text-maroon-950 rounded-full border border-gold-300/40 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Category Jumps */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-gold-700 font-semibold mb-2.5">
                  Browse by Crochet Category
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { name: 'Crochet Keychains & Charms', slug: 'crochet-keychains' },
                    { name: 'Crochet Bags & Potlis', slug: 'crochet-bags' },
                    { name: 'Crochet Wear & Shrugs', slug: 'crochet-wear' },
                    { name: 'Crochet Flowers & Bouquets', slug: 'crochet-flowers' },
                    { name: 'Crochet Accessories & Jewelry', slug: 'crochet-accessories' },
                    { name: 'Crochet Home & Coasters', slug: 'crochet-home' },
                  ].map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setSearchModalOpen(false)}
                      className="p-2 rounded-lg bg-sand/30 hover:bg-gold-100 text-charcoal-800 hover:text-maroon-950 font-medium transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
