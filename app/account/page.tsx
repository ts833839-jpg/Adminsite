'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  Heart,
  MapPin,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderType } from '@/types';

export default function AccountPage() {
  const { user, login, register, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Auth form states if not logged in
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [submittingAuth, setSubmittingAuth] = useState(false);

  useEffect(() => {
    if (user) {
      const loadUserOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await fetch('/api/orders');
          if (res.ok) {
            const data = await res.json();
            setOrders(data.orders || []);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingOrders(false);
        }
      }
      loadUserOrders();
    }
  }, [user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAuth(true);
    if (isRegisterMode) {
      await register({
        name: authName,
        email: authEmail,
        password: authPassword,
        phone: authPhone,
      });
    } else {
      await login(authEmail, authPassword);
    }
    setSubmittingAuth(false);
  };

  // If not logged in: Show elegant authentication portal with Demo buttons!
  if (!user) {
    return (
      <div className="min-h-screen bg-ivory-100 py-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
        <div className="bg-ivory-50 rounded-3xl p-8 border border-gold-500/40 shadow-royal-lg space-y-6">
          <div className="text-center space-y-2">
            <span className="text-2xl text-gold-600 font-serif">⚜</span>
            <h1 className="font-serif text-3xl font-bold text-maroon-950">
              {isRegisterMode ? 'Join Knot & Bloom Royalty' : 'Welcome to Knot & Bloom'}
            </h1>
            <p className="text-xs text-charcoal-600 font-light">
              {isRegisterMode
                ? 'Create your account to unlock palace orders and saved treasures'
                : 'Sign in to access your order history and bespoke wishlist'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-ivory-100 border border-sand-dark text-xs px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full bg-ivory-100 border border-sand-dark text-xs px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                required
              />
            </div>

            {isRegisterMode && (
              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  placeholder="+91 90802 36848"
                  className="w-full bg-ivory-100 border border-sand-dark text-xs px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-ivory-100 border border-sand-dark text-xs px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submittingAuth}
              className="w-full py-3.5 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow transition-all"
            >
              {submittingAuth ? 'Verifying...' : isRegisterMode ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="text-center text-xs text-charcoal-600">
            {isRegisterMode ? (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsRegisterMode(false)}
                  className="text-maroon-900 font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New to Knot & Bloom?{' '}
                <button
                  onClick={() => setIsRegisterMode(true)}
                  className="text-maroon-900 font-bold hover:underline"
                >
                  Create an Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="min-h-screen bg-ivory-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Welcome Header */}
      <div className="p-8 rounded-3xl bg-maroon-950 text-ivory-100 border border-gold-500/30 shadow-royal-lg mb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-palace-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold-500 text-maroon-950 flex items-center justify-center font-serif text-2xl font-bold shadow-md border-2 border-gold-300">
              {user.name[0]}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                Knot & Bloom Royalty Member
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100">
                Namaste, {user.name}
              </h1>
              <p className="text-xs text-ivory-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-maroon-900/60 hover:bg-maroon-900 text-ivory-200 border border-gold-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
          {[
            { label: 'Overview', href: '/account', icon: User, active: true },
            { label: 'My Orders', href: '/account/orders', icon: Package, count: orders.length },
            { label: 'Saved Creations', href: '/wishlist', icon: Heart, count: wishlistItems.length },
            { label: 'Saved Addresses', href: '/account/addresses', icon: MapPin },
            { label: 'Profile & Security', href: '/account/profile', icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  item.active
                    ? 'bg-maroon-900 text-gold-200 shadow-sm'
                    : 'bg-ivory-50 text-charcoal-800 hover:bg-gold-50 border border-sand-dark/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-gold-600" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-400 text-maroon-950 font-bold">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </aside>

        {/* Main Content Pane */}
        <div className="lg:col-span-3 space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm">
              <span className="text-xs text-charcoal-500 uppercase tracking-wider block">Total Commissions</span>
              <span className="font-serif text-3xl font-bold text-maroon-950 mt-1 block">
                {orders.length}
              </span>
              <Link href="/account/orders" className="text-xs text-gold-700 font-semibold mt-2 inline-block hover:underline">
                View History →
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm">
              <span className="text-xs text-charcoal-500 uppercase tracking-wider block">Saved Creations</span>
              <span className="font-serif text-3xl font-bold text-maroon-950 mt-1 block">
                {wishlistItems.length}
              </span>
              <Link href="/wishlist" className="text-xs text-gold-700 font-semibold mt-2 inline-block hover:underline">
                View Saved Pieces →
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm">
              <span className="text-xs text-charcoal-500 uppercase tracking-wider block">Atelier Patron</span>
              <span className="font-serif text-xl font-bold text-gold-800 mt-1 block">
                Royal Patron
              </span>
              <span className="text-[11px] text-charcoal-500 mt-2 block">
                Bespoke customization & artisan consultation
              </span>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sand-dark/40">
              <h3 className="font-serif text-xl font-bold text-maroon-950">Recent Orders</h3>
              <Link href="/account/orders" className="text-xs font-semibold text-gold-700 hover:underline">
                View All
              </Link>
            </div>

            {loadingOrders ? (
              <p className="text-xs text-charcoal-500">Loading orders...</p>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 3).map((o) => (
                  <div
                    key={o.id}
                    className="p-4 rounded-xl bg-ivory-100 border border-sand-dark/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-maroon-950 text-sm">
                          {o.orderNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-maroon-900 text-gold-200">
                          {o.status}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-500 mt-1">
                        Placed on {formatDate(o.createdAt)} • {o.items?.length || 1} items
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-serif font-bold text-maroon-900">
                        {formatPrice(o.totalAmount)}
                      </span>
                      <Link
                        href={`/account/orders/${o.id}`}
                        className="px-3.5 py-1.5 rounded-lg btn-gold text-xs font-semibold"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-charcoal-500 py-4">You have not placed any orders yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
