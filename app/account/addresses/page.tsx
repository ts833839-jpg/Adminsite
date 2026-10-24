'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Plus, Trash2, Edit2, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';

export default function AddressesPage() {
  const { user } = useAuth();
  const { success, info } = useToast();

  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      fullName: user?.name || 'Priya Sharma',
      phone: user?.phone || '+91 98111 22334',
      street: '12 Artisan Avenue, Garden View',
      landmark: 'Near Central Boulevard',
      city: 'Central City',
      state: 'Metro',
      postalCode: '600001',
      country: 'India',
      isDefault: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phone: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.street || !newAddr.city || !newAddr.postalCode) {
      return;
    }
    const created = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, created]);
    setShowAddModal(false);
    success('Address saved to your royal profile!');
    setNewAddr({ fullName: '', phone: '', street: '', landmark: '', city: '', state: '', postalCode: '', country: 'India' });
  };

  const handleRemove = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    info('Address removed.');
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
    success('Default delivery address updated.');
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <nav className="flex items-center gap-2 text-xs text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-maroon-900 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-gold-500" />
        <Link href="/account" className="hover:text-maroon-900 transition-colors">Account</Link>
        <ChevronRight className="w-3 h-3 text-gold-500" />
        <span className="text-maroon-900 font-semibold">Saved Addresses</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-maroon-950">Saved Delivery Addresses</h1>
          <p className="text-xs text-charcoal-500 mt-1">Manage delivery locations for quick palace parcel dispatches.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl btn-gold text-xs font-semibold shadow-sm flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-6 rounded-2xl bg-ivory-50 border transition-all relative ${
              addr.isDefault ? 'border-gold-500 shadow-royal' : 'border-sand-dark/50 shadow-sm'
            }`}
          >
            {addr.isDefault && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-maroon-900 text-gold-200 mb-3">
                Default Address
              </span>
            )}

            <h3 className="font-serif text-lg font-bold text-maroon-950">{addr.fullName}</h3>
            <p className="text-xs text-charcoal-600 mt-1">{addr.street}</p>
            {addr.landmark && <p className="text-xs text-charcoal-500">{addr.landmark}</p>}
            <p className="text-xs text-charcoal-600">{addr.city}, {addr.state} - {addr.postalCode}</p>
            <p className="text-xs text-charcoal-600 font-medium mt-1">{addr.phone}</p>

            <div className="pt-4 border-t border-sand-dark/40 mt-4 flex items-center justify-between text-xs">
              {!addr.isDefault ? (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-gold-700 font-semibold hover:underline"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Primary
                </span>
              )}

              <button
                onClick={() => handleRemove(addr.id)}
                className="text-charcoal-400 hover:text-red-700 transition-colors"
                title="Delete address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ivory-50 rounded-2xl max-w-lg w-full p-6 border border-gold-500/40 shadow-royal-lg space-y-4">
            <h3 className="font-serif text-xl font-bold text-maroon-950">Add Delivery Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-charcoal-800 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  className="w-full bg-ivory-100 border border-sand-dark px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal-800 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full bg-ivory-100 border border-sand-dark px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal-800 block mb-1">PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={newAddr.postalCode}
                    onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    className="w-full bg-ivory-100 border border-sand-dark px-3 py-2 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-charcoal-800 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full bg-ivory-100 border border-sand-dark px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal-800 block mb-1">City</label>
                  <input
                    type="text"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full bg-ivory-100 border border-sand-dark px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal-800 block mb-1">State</label>
                  <input
                    type="text"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full bg-ivory-100 border border-sand-dark px-3 py-2 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-charcoal-600 hover:text-maroon-900"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl btn-gold font-semibold shadow-sm">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
