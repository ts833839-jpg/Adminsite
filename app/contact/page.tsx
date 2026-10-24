'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';

export default function ContactPage() {
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Inquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      error('Please complete all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          productTitle: formData.subject,
          message: formData.message,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        success('Thank you! Your inquiry has reached the Knot & Bloom Atelier.');
      } else {
        error('Failed to submit message. Please try via WhatsApp.');
      }
    } catch (e) {
      error('Network error. Please try reaching us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-700">
          Royal Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-maroon-950">
          We are Here to Assist You
        </h1>
        <p className="text-sm text-charcoal-600 font-light leading-relaxed">
          Whether you seek custom crochet commissions, bulk wedding gifting, or order inquiries, our palace concierge responds within 12 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Information Column */}
        <div className="p-8 rounded-3xl bg-maroon-950 text-ivory-100 border border-gold-500/30 shadow-royal-lg space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-palace-pattern opacity-20 pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-ivory-50">
              Artisan Atelier & Studio
            </h3>
            <p className="text-xs text-ivory-300 leading-relaxed font-light">
              Connect directly with our master crochet artisans for bespoke commissions and custom creations.
            </p>

            <div className="space-y-4 text-xs pt-4 border-t border-gold-500/20">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gold-200 block">Atelier & Studio</span>
                  <p className="text-ivory-300 mt-0.5">
                    Knot & Bloom Handcrafted Crochet Studio
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gold-200 block">Direct Contact / WhatsApp</span>
                  <p className="text-ivory-300 mt-0.5 font-semibold">+91 9080236848</p>
                  <a
                    href="https://wa.me/919080236848?text=Hello%20Knot%20%26%20Bloom,%20I%20would%20like%20to%20inquire%20about%20a%20handcrafted%20crochet%20creation."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-ivory-100 rounded-lg text-[11px] font-semibold transition-colors"
                  >
                    <span>💬 Chat on WhatsApp (+91 9080236848)</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gold-200 block">Direct Email</span>
                  <a href="mailto:suresh140105@gmail.com" className="text-gold-300 hover:underline mt-0.5 block">
                    suresh140105@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gold-200 block">Concierge Hours</span>
                  <p className="text-ivory-300 mt-0.5">Monday to Saturday: 9:30 AM – 7:30 PM IST</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gold-500/20">
              <Link
                href="/faq"
                className="text-xs text-gold-300 hover:text-gold-200 underline underline-offset-4"
              >
                Explore Frequently Asked Questions →
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-ivory-50 border border-sand-dark/50 shadow-sm">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-maroon-950">
                Message Received with Grace
              </h3>
              <p className="text-xs text-charcoal-600 max-w-md mx-auto">
                Our concierge executive has received your inquiry and will respond to {formData.email} promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 rounded-xl btn-gold text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <h3 className="font-serif text-xl font-bold text-maroon-950">
                Send a Message to Our Concierge
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-charcoal-800 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Maharani Gayatri"
                    className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal-800 block mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@domain.com"
                    className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-charcoal-800 block mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 90802 36848"
                    className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal-800 block mb-1">
                    Topic of Inquiry
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500 font-medium"
                  >
                    <option>Order & Tracking Assistance</option>
                    <option>Custom Crochet Commission</option>
                    <option>Bulk Wedding Gifting & Trousseau</option>
                    <option>Returns & Exchange Query</option>
                    <option>Artisan Partnership / Guild</option>
                    <option>Other Royal Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal-800 block mb-1">
                  Your Message or Special Request *
                </label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us how we can assist you..."
                  className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow flex items-center gap-2"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
