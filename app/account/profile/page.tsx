'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, ShieldCheck, KeyRound, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';

export default function ProfilePage() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || 'Priya Sharma');
  const [phone, setPhone] = useState(user?.phone || '+91 98111 22334');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      success('Royal profile information updated successfully!');
    }, 600);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      error('New password must be at least 6 characters.');
      return;
    }
    success('Password updated securely.');
    setCurrentPass('');
    setNewPass('');
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <nav className="flex items-center gap-2 text-xs text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-maroon-900 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-gold-500" />
        <Link href="/account" className="hover:text-maroon-900 transition-colors">Account</Link>
        <ChevronRight className="w-3 h-3 text-gold-500" />
        <span className="text-maroon-900 font-semibold">Profile & Security</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-maroon-950">Profile & Security</h1>
        <p className="text-xs text-charcoal-500 mt-1">Manage your account credentials and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Info */}
        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-sand-dark/40 pb-3">
            <User className="w-4 h-4 text-gold-600" />
            <h3 className="font-serif text-lg font-bold text-maroon-950">Personal Details</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || 'priya@knotandbloom.com'}
                disabled
                className="w-full bg-ivory-200 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-charcoal-400 mt-1 block">Primary login email cannot be changed</span>
            </div>

            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl btn-gold font-semibold shadow-sm"
            >
              {saving ? 'Updating...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-sand-dark/40 pb-3">
            <KeyRound className="w-4 h-4 text-gold-600" />
            <h3 className="font-serif text-lg font-bold text-maroon-950">Security & Password</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">Current Password</label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">New Secure Password</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                required
              />
            </div>

            <div className="p-3 rounded-lg bg-gold-50 border border-gold-300 text-[11px] text-maroon-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Passwords are encrypted using bcrypt salted hashing algorithms.</span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl btn-royal font-semibold shadow-sm"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
