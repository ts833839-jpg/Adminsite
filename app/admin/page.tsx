'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  FolderTree,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/providers/ToastProvider';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const loadOverview = async () => {
    try {
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setData((prev: any) => ({
          ...prev,
          recentInquiries: prev.recentInquiries.map((inq: any) =>
            inq.id === id ? { ...inq, status: newStatus } : inq
          ),
        }));
        success(`Status updated to ${newStatus}`);
      }
    } catch (e) {
      error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="font-serif text-sm text-maroon-950">Loading Atelier Metrics...</p>
      </div>
    );
  }

  const {
    totalProducts = 0,
    totalCategories = 0,
    totalInquiries = 0,
    newInquiries = 0,
    recentInquiries = [],
    categories = [],
    recentCreations = [],
  } = data || {};

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-gold-700">
            Atelier Management Console
          </span>
          <h1 className="font-serif text-3xl font-bold text-maroon-950 mt-1">
            Knot & Bloom Atelier Overview
          </h1>
          <p className="text-xs text-charcoal-500">
            Real-time portfolio management and client bespoke inquiries. Authentic data only.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl btn-gold text-xs font-semibold shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Add New Creation</span>
          </Link>
          <Link
            href="/admin/inquiries"
            className="px-4 py-2.5 rounded-xl bg-ivory-50 border border-sand-dark text-xs font-semibold text-maroon-950 shadow-sm hover:bg-gold-50 flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-gold-600" />
            <span>Client Inquiries ({totalInquiries})</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-charcoal-900 text-ivory-100 text-xs font-semibold hover:bg-charcoal-950 flex items-center gap-1.5"
          >
            <span>View Public Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Real Atelier KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Creations */}
        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Portfolio Creations
            </span>
            <Package className="w-4 h-4 text-gold-600" />
          </div>
          <span className="font-serif text-3xl font-bold text-maroon-950 mt-2 block">
            {totalProducts}
          </span>
          <p className="text-[11px] text-charcoal-500 mt-1">100% Handcrafted Crochet Pieces</p>
        </div>

        {/* Active Collections */}
        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Active Collections
            </span>
            <FolderTree className="w-4 h-4 text-gold-600" />
          </div>
          <span className="font-serif text-3xl font-bold text-maroon-950 mt-2 block">
            {totalCategories}
          </span>
          <p className="text-[11px] text-charcoal-500 mt-1">Curated crochet departments</p>
        </div>

        {/* Total Inquiries */}
        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Client Inquiries
            </span>
            <MessageSquare className="w-4 h-4 text-gold-600" />
          </div>
          <span className="font-serif text-3xl font-bold text-maroon-950 mt-2 block">
            {totalInquiries}
          </span>
          <p className="text-[11px] text-charcoal-500 mt-1">Direct bespoke commission requests</p>
        </div>

        {/* New / Action Required */}
        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              New Inquiries
            </span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-serif text-3xl font-bold text-amber-700 mt-2 block">
            {newInquiries}
          </span>
          <p className="text-[11px] text-charcoal-500 mt-1">Awaiting artisan response</p>
        </div>
      </div>

      {/* Main Grid: Recent Inquiries + Collections Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Client Inquiries (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-maroon-950">
              Recent Client Inquiries
            </h2>
            <Link
              href="/admin/inquiries"
              className="text-xs font-semibold text-gold-700 hover:text-maroon-900 flex items-center gap-1"
            >
              <span>View All Inquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="p-8 text-center bg-ivory-50 rounded-2xl border border-sand-dark/40 space-y-2">
              <MessageSquare className="w-8 h-8 text-gold-600 mx-auto" />
              <p className="font-serif text-sm font-bold text-maroon-950">No Inquiries Yet</p>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                When visitors browse your crochet creations and request an order or bespoke piece, their contact details and requests will appear here directly.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentInquiries.slice(0, 5).map((inq: any) => {
                const whatsappNumber = inq.phone ? inq.phone.replace(/[^0-9]/g, '') : '';
                return (
                  <div
                    key={inq.id}
                    className="p-4 rounded-xl bg-ivory-50 border border-sand-dark/50 shadow-sm space-y-3 hover:border-gold-400/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-maroon-950">{inq.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-charcoal-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gold-600" />
                            {inq.email}
                          </span>
                          {inq.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-gold-600" />
                              {inq.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gold-600" />
                            {formatDate(inq.createdAt)}
                          </span>
                        </div>
                      </div>

                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                          inq.status === 'NEW'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : inq.status === 'CONTACTED'
                            ? 'bg-blue-50 text-blue-900 border-blue-300'
                            : inq.status === 'IN_PROGRESS'
                            ? 'bg-purple-50 text-purple-900 border-purple-300'
                            : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </div>

                    {inq.productTitle && (
                      <p className="text-xs text-maroon-900 bg-gold-50/80 px-2.5 py-1 rounded-md font-medium inline-block">
                        Piece: <strong>{inq.productTitle}</strong>
                      </p>
                    )}

                    <p className="text-xs text-charcoal-700 bg-ivory-100 p-2.5 rounded-lg border border-sand-dark/30 font-light">
                      {inq.message}
                    </p>

                    {whatsappNumber && (
                      <div>
                        <a
                          href={`https://wa.me/${whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          💬 Chat with client on WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Collections & Recent Creations */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-maroon-950">
                Crochet Collections
              </h3>
              <Link
                href="/admin/categories"
                className="text-xs font-semibold text-gold-700 hover:text-maroon-900"
              >
                Manage
              </Link>
            </div>

            <div className="space-y-2.5">
              {categories.map((cat: any) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-sand-dark/30 last:border-none"
                >
                  <span className="font-medium text-charcoal-800">{cat.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-gold-100 text-maroon-950 font-bold text-[10px]">
                    {cat._count?.products || 0} creations
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-maroon-950 text-ivory-100 space-y-3">
            <h3 className="font-serif text-lg font-bold text-gold-300">
              Bespoke Portfolio System
            </h3>
            <p className="text-xs text-ivory-300 font-light leading-relaxed">
              Every creation you add in the admin catalog is immediately visible on your live portfolio. Clients can inquire directly via web form or WhatsApp to commission each piece.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/products/new"
                className="block text-center py-2.5 rounded-xl btn-gold text-xs font-bold"
              >
                + Add Creation to Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
