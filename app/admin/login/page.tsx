'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both administrator ID/email and security password.');
      return;
    }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      // Role verification guard: verify the user has ADMIN role
      try {
        const res = await fetch('/api/auth/me');
        const meData = await res.json();
        if (meData.user?.role !== 'ADMIN') {
          error('Access Denied: This console is strictly restricted to Knot & Bloom store administrators.');
          await logout();
          return;
        }
      } catch (err) {
        // Fallback
      }
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute inset-0 bg-palace-pattern opacity-25 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-maroon-900/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-charcoal-900/95 border border-gold-500/40 rounded-3xl p-8 sm:p-10 shadow-royal-lg backdrop-blur-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-maroon-900 border border-gold-400 flex items-center justify-center text-gold-400 mb-2 shadow-royal">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-400 block">
            Palace Administration
          </span>
          <h1 className="font-serif text-3xl font-bold text-ivory-100">
            Secure Admin Portal
          </h1>
          <p className="text-xs text-ivory-400 font-light">
            Authorized access only. All catalog, inventory, and order operations reflect directly to the live customer storefront.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-ivory-300 font-semibold block mb-1">Administrator ID or Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin or admin@knotandbloom.com"
              className="w-full bg-charcoal-950 border border-gold-500/30 px-3.5 py-2.5 rounded-xl text-ivory-100 placeholder:text-charcoal-600 focus:outline-none focus:border-gold-400 transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-ivory-300 font-semibold block mb-1">Master Security Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full bg-charcoal-950 border border-gold-500/30 px-3.5 py-2.5 rounded-xl text-ivory-100 placeholder:text-charcoal-600 focus:outline-none focus:border-gold-400 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow flex items-center justify-center gap-2 transition-all mt-2"
          >
            {loading ? 'Authenticating Security Key...' : 'Authenticate & Enter Console'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-[11px] text-charcoal-500 pt-2 border-t border-charcoal-800">
          Private clearance credentials required. Only authorized personnel can manage this marketplace.
        </p>
      </div>
    </div>
  );
}
