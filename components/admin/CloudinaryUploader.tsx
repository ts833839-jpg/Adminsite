'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video, Trash2, Plus, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';

interface CloudinaryUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
}

export function CloudinaryUploader({ images, onChange, maxFiles = 10 }: CloudinaryUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [manualUrl, setManualUrl] = useState('');
  const { success, error, info } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxFiles) {
      error(`You can only upload up to ${maxFiles} creation photos/videos.`);
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}...`);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          newUrls.push(data.url);
        } else {
          error(data.error || `Failed to upload ${file.name}`);
        }
      } catch (err: any) {
        error(`Upload error: ${err.message || 'Network error'}`);
      }
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
      success(`Successfully uploaded ${newUrls.length} file(s) to Cloudinary!`);
    }

    setUploading(false);
    setUploadProgress('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMakePrimary = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([target, ...rest]);
    info('Primary showcase photo updated.');
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    onChange([...images, manualUrl.trim()]);
    setManualUrl('');
    success('Image URL added.');
  };

  return (
    <div className="space-y-4">
      {/* Hidden native input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept="image/*,video/mp4,video/quicktime,video/webm"
        className="hidden"
      />

      {/* Main Drag & Drop / Upload Trigger Box */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
          uploading
            ? 'bg-gold-50/50 border-gold-400 cursor-not-allowed'
            : 'bg-ivory-100 hover:bg-gold-50/70 border-sand-dark hover:border-gold-400 shadow-sm'
        }`}
      >
        <div className="w-14 h-14 rounded-full bg-maroon-900/10 border border-gold-500/30 flex items-center justify-center text-maroon-900">
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-gold-600" />
          ) : (
            <UploadCloud className="w-7 h-7 text-gold-600" />
          )}
        </div>

        {uploading ? (
          <div className="space-y-1">
            <p className="font-serif text-sm font-bold text-maroon-950">
              Uploading & Optimizing on Cloudinary...
            </p>
            <p className="text-xs text-charcoal-600 font-mono">{uploadProgress}</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="font-serif text-base font-bold text-maroon-950">
              Click to Upload Creation Photos or Videos
            </p>
            <p className="text-xs text-charcoal-600">
              High-resolution PNG, JPG, WEBP, or MP4 videos are auto-optimized on Cloudinary with edge CDN delivery
            </p>
            <span className="inline-block mt-2 px-3 py-1 bg-gold-100 text-maroon-950 rounded-full text-[10px] font-semibold border border-gold-400/50">
              Auto-optimizes to WebP via Cloudinary API
            </span>
          </div>
        )}
      </div>

      {/* Media Previews Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-600 font-medium px-1">
            <span>Uploaded Media ({images.length} item{images.length > 1 ? 's' : ''})</span>
            <span className="text-[11px] text-gold-700">First item is the primary showcase image</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((url, idx) => {
              const isVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('/video/upload/');
              return (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gold-500/30 bg-maroon-950/10 group shadow-sm"
                >
                  {isVideo ? (
                    <video src={url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  )}

                  {/* Badge */}
                  <span
                    className={`absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold ${
                      idx === 0
                        ? 'bg-maroon-900 text-gold-200 border border-gold-400/40 shadow-sm'
                        : 'bg-charcoal-950/80 text-ivory-200'
                    }`}
                  >
                    {idx === 0 ? 'Primary' : `#${idx + 1}`}
                  </span>

                  {/* Make Primary button if not already */}
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleMakePrimary(idx)}
                      className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-ivory-50/90 hover:bg-ivory-50 text-maroon-950 text-[9px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Set as primary thumbnail"
                    >
                      Make Primary
                    </button>
                  )}

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-800 text-white hover:bg-red-900 transition-colors shadow-md"
                    title="Remove media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual URL Fallback Accordion / Input */}
      <div className="pt-2">
        <label className="text-[11px] font-semibold text-charcoal-700 block mb-1">
          Or paste direct Image / Cloudinary URL:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="flex-1 bg-ivory-100 border border-sand-dark px-3 py-2 rounded-xl text-xs font-mono text-charcoal-900 focus:outline-none focus:border-gold-500"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-4 py-2 rounded-xl bg-charcoal-900 hover:bg-maroon-900 text-gold-200 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
