'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Award, ArrowRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';

export function ArtisanStorySection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="py-24 bg-maroon-950 text-ivory-100 relative overflow-hidden border-y border-gold-500/25">
      {/* Background Palace Pattern */}
      <div className="absolute inset-0 bg-palace-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Visual Editorial Composition with Video */}
          <div className="relative">
            {/* Main Palace Framed Video */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-gold-500/50 shadow-royal-lg aspect-[4/3] bg-maroon-900 group">
              <video
                ref={videoRef}
                src="/videos/artisan-crochet-masterpiece.mp4"
                poster="/products/gallery/emerald-and-magenta-crochet-flower-mat.png"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Video Overlay Control Buttons */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-maroon-950/85 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-gold-300 border border-gold-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Atelier In Motion
                </span>
              </div>

              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  className="w-9 h-9 rounded-full bg-maroon-950/80 hover:bg-maroon-900 text-gold-300 border border-gold-500/40 flex items-center justify-center backdrop-blur-md transition-all shadow-md hover:scale-105"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  className="w-9 h-9 rounded-full bg-maroon-950/80 hover:bg-maroon-900 text-gold-300 border border-gold-500/40 flex items-center justify-center backdrop-blur-md transition-all shadow-md hover:scale-105"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Floating Badge on Video */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-charcoal-950/85 backdrop-blur-md border border-gold-500/30 flex items-center justify-between pointer-events-none">
                <div>
                  <p className="text-xs font-serif font-bold text-gold-200">Master Artisan Atelier</p>
                  <p className="text-[11px] text-ivory-300">Every knot and stitch hooked with devoted patience</p>
                </div>
                <span className="text-xl text-gold-400 font-serif">⚜</span>
              </div>
            </div>

            {/* Accent Floating Card */}
            <div className="hidden sm:block absolute -top-6 -right-6 p-4 rounded-2xl bg-ivory-50 text-maroon-950 shadow-royal-lg border border-gold-500/40 max-w-xs animate-float z-20">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-rose-deep fill-rose-deep" />
                <span className="text-xs font-bold uppercase tracking-wider text-maroon-900">
                  Pure Craftsmanship
                </span>
              </div>
              <p className="text-xs text-charcoal-700 leading-snug">
                Every knot and petal is crocheted patiently by hand. No factory machinery, zero synthetic shortcuts.
              </p>
            </div>
          </div>

          {/* Right: Storytelling Copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-gold-300">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>The Knot & Bloom Legacy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ivory-50 leading-[1.15]">
              More Than Shopping. <br />
              <span className="gold-shimmer italic font-normal">A Collection of Things Worth Keeping.</span>
            </h2>

            <p className="text-sm sm:text-base text-ivory-300 leading-relaxed font-light">
              In an era of disposable mass-production, Knot & Bloom honors the timeless art of the crochet hook. We partner directly with master crochet artisans, transforming soft combed cotton and fine yarns into lasting heirloom treasures.
            </p>

            {/* Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-charcoal-900/60 border border-gold-500/15">
                <h4 className="font-serif text-base font-bold text-gold-200 mb-1">
                  Organic & Kind to Skin
                </h4>
                <p className="text-xs text-ivory-400">
                  Combed 100% natural cotton yarn, baby-safe and chemical-free.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-charcoal-900/60 border border-gold-500/15">
                <h4 className="font-serif text-base font-bold text-gold-200 mb-1">
                  Royal Palace Packaging
                </h4>
                <p className="text-xs text-ivory-400">
                  Arrives wrapped in festive gold-embossed tissue and scented cloth pouch.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
