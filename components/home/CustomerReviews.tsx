'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MessageCircle,
  Phone,
  Mail,
  Palette,
  Camera,
  PackageCheck,
  ShieldCheck,
  Heart,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export function CustomerReviews() {
  const steps = [
    {
      number: '01',
      icon: Palette,
      title: 'Explore & Choose Your Design',
      description:
        'Browse our curated portfolio of heirloom baby dresses, everlasting flower bouquets, festive potlis, and keychains.',
      highlight: 'Pick an existing design or dream up your own custom colorway.',
    },
    {
      number: '02',
      icon: MessageCircle,
      title: 'Consult Directly with the Artisan',
      description:
        'Connect directly with our master maker on WhatsApp or call (9080236848). No automated bots or middlemen.',
      highlight: 'Tailor colors, custom dimensions, newborn sizes, or wedding gift themes.',
    },
    {
      number: '03',
      icon: Camera,
      title: 'Photo & Video Work Previews',
      description:
        'Every knot is hooked patiently with organic hypoallergenic cotton. Before final dispatch, we share high-res photo and video previews of your piece.',
      highlight: 'See your actual creation finished and verified before it leaves the workshop.',
    },
    {
      number: '04',
      icon: PackageCheck,
      title: 'Palace Keepsake Packaging & Delivery',
      description:
        'Carefully wrapped in gold-embossed tissue and protective heirloom boxes, ready to gift or treasure forever.',
      highlight: 'Dispatched with tracking across India directly to your doorstep.',
    },
  ];

  const guarantees = [
    {
      title: '100% Hand-Hooked Artistry',
      desc: 'Zero factory machinery or synthetic shortcuts. Every loop, petal, and picot is crafted by hand.',
      icon: Heart,
    },
    {
      title: 'Skin-Friendly Organic Yarns',
      desc: 'Hypoallergenic combed cotton and baby-safe mercerized threads that are soft and gentle on sensitive skin.',
      icon: ShieldCheck,
    },
    {
      title: 'Direct Personal Contact',
      desc: 'Direct line to our atelier (9080236848 / suresh140105@gmail.com) for updates, care advice, or custom inquiries.',
      icon: Phone,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] font-semibold text-gold-700 bg-gold-100/70 px-3.5 py-1 rounded-full border border-gold-400/30">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Transparent Artisan Experience</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-950">
          How Every Creation Comes to Life
        </h2>
        <p className="text-sm sm:text-base text-charcoal-600 font-light leading-relaxed">
          We believe in complete authenticity. Here is exactly how your bespoke crochet piece is commissioned, handcrafted, verified, and delivered.
        </p>
      </div>

      {/* 4-Step Transparent Journey Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="relative p-6 sm:p-7 rounded-2xl bg-ivory-50 border border-sand-dark/50 shadow-sm hover:shadow-royal-lg hover:border-gold-400/60 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Step badge & icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-serif text-2xl font-bold text-gold-600/40 group-hover:text-gold-600 transition-colors">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-gold-100/60 border border-gold-400/30 flex items-center justify-center text-maroon-900 group-hover:bg-maroon-900 group-hover:text-gold-200 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg font-bold text-maroon-950 mb-2 leading-snug">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-charcoal-600 leading-relaxed font-light mb-4">
                  {step.description}
                </p>
              </div>

              {/* Highlight bullet */}
              <div className="pt-3 border-t border-sand-dark/40 flex items-start gap-2 text-[11px] text-maroon-900 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{step.highlight}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Authenticity Guarantees Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {guarantees.map((g, idx) => {
          const Icon = g.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-sand/20 border border-gold-500/20 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-maroon-900 text-gold-300 flex items-center justify-center shrink-0 border border-gold-400/30 shadow-sm">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-maroon-950">{g.title}</h4>
                <p className="text-xs text-charcoal-600 leading-relaxed font-light">{g.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Royal Direct Commission CTA Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-maroon-950 via-charcoal-900 to-maroon-950 text-ivory-100 p-8 sm:p-12 border border-gold-500/40 shadow-royal-lg">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Direct Atelier Consultation</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-50">
              Have a Custom Vision in Mind?
            </h3>
            <p className="text-xs sm:text-sm text-ivory-300 leading-relaxed font-light">
              Whether you need baby shower gifts, bridal potlis in matching wedding colors, or a personalized everlasting flower bouquet, discuss your idea directly with our artisan.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://wa.me/919080236848?text=Hello%20Knot%20%26%20Bloom%20Atelier,%20I%20would%20like%20to%20discuss%20a%20custom%20handcrafted%20crochet%20commission."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-ivory-100 font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href="tel:+919080236848"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-ivory-50 hover:bg-gold-50 text-maroon-950 font-bold text-xs flex items-center justify-center gap-2 border border-gold-400/50 shadow-md transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4 text-gold-700" />
              <span>Call: 9080236848</span>
            </a>

            <Link
              href="/shop"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-maroon-900/60 hover:bg-maroon-900 text-gold-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-gold-500/30 transition-colors"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
