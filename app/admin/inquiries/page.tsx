'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/providers/ToastProvider';

interface InquiryType {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  productTitle?: string | null;
  productSlug?: string | null;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'COMPLETED';
  notes?: string | null;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { success, error } = useToast();

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus as any } : inq))
        );
        success(`Inquiry status updated to ${newStatus}`);
      } else {
        error('Failed to update status.');
      }
    } catch (e) {
      error('Error updating status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this inquiry?')) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        success('Inquiry removed successfully.');
      }
    } catch (e) {
      error('Failed to remove inquiry.');
    }
  };

  const filtered = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.phone && inq.phone.includes(searchQuery)) ||
      (inq.productTitle && inq.productTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-gold-700">
            Client Relations
          </span>
          <h1 className="font-serif text-3xl font-bold text-maroon-950 mt-1">
            Client Inquiries & Bespoke Requests
          </h1>
          <p className="text-xs text-charcoal-500">
            Real inquiries submitted by clients looking to order or commission handcrafted crochet creations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-ivory-50 border border-sand-dark text-xs font-semibold text-maroon-950 hover:bg-gold-50 transition-colors flex items-center gap-1.5"
          >
            <span>View Public Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-ivory-50 p-4 rounded-2xl border border-sand-dark/40">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, piece..."
            className="w-full bg-ivory-100 border border-sand-dark pl-9 pr-4 py-2 rounded-xl text-xs text-charcoal-900 focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          {['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-maroon-900 text-gold-200 shadow-sm'
                  : 'bg-ivory-100 text-charcoal-700 hover:bg-gold-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="font-serif text-sm text-maroon-950">Loading Client Inquiries...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-ivory-50 rounded-2xl border border-sand-dark/40 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-gold-100 flex items-center justify-center text-gold-700">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-maroon-950">No Inquiries Found</h3>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'ALL'
              ? 'No inquiries match your filter criteria.'
              : 'All incoming client inquiries and custom orders will appear here automatically.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inq) => {
            const whatsappNumber = inq.phone ? inq.phone.replace(/[^0-9]/g, '') : '';
            return (
              <div
                key={inq.id}
                className="p-5 rounded-2xl bg-ivory-50 border border-sand-dark/50 shadow-sm hover:border-gold-400/60 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-dark/40 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-maroon-900 text-gold-300 font-bold flex items-center justify-center text-sm font-serif">
                      {inq.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-maroon-950">{inq.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gold-600" />
                          <a href={`mailto:${inq.email}`} className="hover:text-maroon-900">
                            {inq.email}
                          </a>
                        </span>
                        {inq.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gold-600" />
                            <a href={`tel:${inq.phone}`} className="hover:text-maroon-900">
                              {inq.phone}
                            </a>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gold-600" />
                          <span>{formatDate(inq.createdAt)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* Status Dropdown */}
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
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

                    <button
                      onClick={() => handleDelete(inq.id)}
                      className="p-1.5 text-charcoal-400 hover:text-red-600 transition-colors"
                      title="Remove inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Requested Creation */}
                {inq.productTitle && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold-50/80 border border-gold-300/60 text-xs text-maroon-950 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                    <span>Requested Creation:</span>
                    <strong className="font-semibold">{inq.productTitle}</strong>
                  </div>
                )}

                {/* Message Body */}
                <div className="bg-ivory-100 p-4 rounded-xl border border-sand-dark/40 text-xs text-charcoal-800 leading-relaxed font-light">
                  <p>{inq.message}</p>
                </div>

                {/* Actions: Direct WhatsApp & Email */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {whatsappNumber && (
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `Hello ${inq.name}, thank you for inquiring with Knot & Bloom about ${
                          inq.productTitle || 'our handcrafted creations'
                        }.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-ivory-100 text-xs font-semibold shadow-sm transition-colors"
                    >
                      <span>💬 Chat on WhatsApp</span>
                    </a>
                  )}

                  <a
                    href={`mailto:${inq.email}?subject=${encodeURIComponent(
                      `Knot & Bloom: In response to your inquiry for ${inq.productTitle || 'Bespoke Crochet'}`
                    )}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-ivory-100 hover:bg-gold-50 border border-sand-dark text-maroon-950 text-xs font-semibold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-gold-600" />
                    <span>Send Email Reply</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
