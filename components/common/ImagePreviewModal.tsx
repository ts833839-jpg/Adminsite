'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Maximize2,
} from 'lucide-react';

export interface PreviewImage {
  url: string;
  alt?: string;
  title?: string;
}

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: (string | PreviewImage)[];
  initialIndex?: number;
  productTitle?: string;
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  productTitle = 'Handcrafted Atelier Piece',
}: ImagePreviewModalProps) {
  // Normalize images to array of PreviewImage
  const normalizedImages: PreviewImage[] = (images || []).map((img) =>
    typeof img === 'string' ? { url: img, alt: productTitle } : img
  );

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIndex]);

  // Handle keyboard shortcuts (Escape, Left, Right)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, normalizedImages.length]);

  if (!isOpen || normalizedImages.length === 0) return null;

  const currentImage = normalizedImages[currentIndex] || normalizedImages[0];
  const isVideo =
    currentImage.url.endsWith('.mp4') ||
    currentImage.url.endsWith('.webm') ||
    currentImage.url.includes('/video/upload/');

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : normalizedImages.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev < normalizedImages.length - 1 ? prev + 1 : 0));
  };

  const toggleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isVideo) return;
    if (zoomLevel === 1) {
      // Zoom in to 2.2x centered on click position (Amazon/Flipkart style)
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;
        setPanPosition({ x: -offsetX * 1.2, y: -offsetY * 1.2 });
      }
      setZoomLevel(2.2);
    } else {
      // Reset zoom
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel <= 1 || isVideo || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate percentage across container (0 to 1)
    const pctX = mouseX / rect.width - 0.5;
    const pctY = mouseY / rect.height - 0.5;

    // Pan image smoothly inverted to mouse position
    const maxPanX = (rect.width * (zoomLevel - 1)) / 2;
    const maxPanY = (rect.height * (zoomLevel - 1)) / 2;

    setPanPosition({
      x: -pctX * maxPanX * 2,
      y: -pctY * maxPanY * 2,
    });
  };

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.5, 3.5));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const resetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Top Bar: Title, Counter & Zoom Controls */}
      <div
        className="w-full flex items-center justify-between px-4 sm:px-8 py-3.5 bg-black/60 border-b border-gold-500/20 text-ivory-100 z-50 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 truncate max-w-[55%]">
          <span className="text-gold-400 font-serif text-lg">⚜</span>
          <div className="truncate">
            <h3 className="font-serif text-sm sm:text-base font-bold text-ivory-50 truncate">
              {currentImage.title || productTitle}
            </h3>
            <p className="text-[11px] text-gold-300 font-light flex items-center gap-1.5">
              <span>Handcrafted Detail Full View</span>
              <span className="text-sand-dark">•</span>
              <span>
                {currentIndex + 1} of {normalizedImages.length}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {!isVideo && (
            <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-xl p-1 border border-white/10 mr-2">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoomLevel <= 1}
                className="p-1.5 rounded-lg hover:bg-white/15 text-ivory-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-1.5 text-gold-300 min-w-[42px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoomLevel >= 3.5}
                className="p-1.5 rounded-lg hover:bg-white/15 text-ivory-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {zoomLevel > 1 && (
                <button
                  type="button"
                  onClick={resetZoom}
                  className="p-1.5 rounded-lg hover:bg-white/15 text-gold-400 transition-colors ml-0.5"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-200 hover:text-gold-100 border border-gold-500/40 flex items-center gap-1.5 text-xs font-semibold transition-all shadow-md"
            title="Close Full Preview (Esc)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Main Image Stage (100% Full Uncropped View) */}
      <div
        ref={containerRef}
        onClick={toggleZoom}
        onMouseMove={handleMouseMove}
        className={`relative flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden ${
          isVideo ? '' : zoomLevel > 1 ? 'cursor-grab' : 'cursor-zoom-in'
        }`}
      >
        {/* Navigation Arrows */}
        {normalizedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-maroon-900/90 text-ivory-50 border border-gold-500/40 hover:border-gold-400 flex items-center justify-center shadow-royal-lg backdrop-blur-md transition-all hover:scale-105"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6 text-gold-300" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 sm:right-6 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-maroon-900/90 text-ivory-50 border border-gold-500/40 hover:border-gold-400 flex items-center justify-center shadow-royal-lg backdrop-blur-md transition-all hover:scale-105"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6 text-gold-300" />
            </button>
          </>
        )}

        {/* Image / Video Display Container with Zero Cropping */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-150 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${
              panPosition.y / zoomLevel
            }px)`,
          }}
          onClick={(e) => {
            // Keep click inside stage
          }}
        >
          {isVideo ? (
            <video
              src={currentImage.url}
              controls
              autoPlay
              loop
              playsInline
              className="max-h-[75vh] sm:max-h-[80vh] max-w-[92vw] w-auto h-auto object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={currentImage.url}
              alt={currentImage.alt || productTitle}
              className="max-h-[75vh] sm:max-h-[80vh] max-w-[92vw] w-auto h-auto object-contain rounded-2xl shadow-2xl transition-all"
              loading="eager"
            />
          )}
        </div>

        {/* Amazon/Flipkart Helper Hint (Shows when zoomLevel is 1) */}
        {!isVideo && zoomLevel === 1 && (
          <div className="absolute bottom-4 z-20 pointer-events-none px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-gold-500/30 text-[11px] text-gold-200 flex items-center gap-1.5 shadow-lg">
            <ZoomIn className="w-3.5 h-3.5 text-gold-400" />
            <span>Click or tap image to zoom in full detail (No crop)</span>
          </div>
        )}
      </div>

      {/* Bottom Filmstrip Thumbnails (Amazon/Flipkart Style) */}
      {normalizedImages.length > 1 && (
        <div
          className="w-full px-4 py-3 bg-black/75 border-t border-gold-500/20 flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto z-50 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {normalizedImages.map((img, idx) => {
            const isSelected = idx === currentIndex;
            const isThumbVideo =
              img.url.endsWith('.mp4') ||
              img.url.endsWith('.webm') ||
              img.url.includes('/video/upload/');

            return (
              <button
                key={img.url + idx}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setZoomLevel(1);
                  setPanPosition({ x: 0, y: 0 });
                }}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  isSelected
                    ? 'border-gold-400 ring-2 ring-gold-400/50 scale-105 shadow-gold-glow'
                    : 'border-white/20 opacity-60 hover:opacity-100 hover:border-gold-300/60'
                }`}
              >
                {isThumbVideo ? (
                  <video src={img.url} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-gold-400/15 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
