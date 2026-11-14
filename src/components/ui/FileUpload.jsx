import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, FileText, Film, X, Check, AlertCircle } from 'lucide-react';

/**
 * Sohoj Pathshala Reusable File & Media Uploader
 * Supports: image, file (pdf/doc), video (mp4/webm)
 * Built-in Canvas compression for images to preserve storage quota & speed
 */
export default function FileUpload({
  label = 'ফাইল আপলোড করুন',
  helperText,
  accept = 'image/*',
  type = 'image', // 'image', 'file', 'video'
  value, // existing dataUrl or URL string
  onChange, // callback(dataUrl, fileMetadata)
  maxSizeMB = 10,
  circular = false,
  aspectRatio = 'video', // 'video' (16:9), 'square' (1:1), 'banner' (21:9), 'auto'
  className = '',
  disabled = false
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Compress and resize image using HTML5 Canvas
  const processImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Export as compressed JPEG or PNG
          const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const compressedDataUrl = canvas.toDataURL(mime, 0.82);
          resolve({
            dataUrl: compressedDataUrl,
            name: file.name,
            size: Math.round((compressedDataUrl.length * 3) / 4),
            type: mime
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Process raw file (PDF, doc, video)
  const processRawFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => {
        resolve({
          dataUrl: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    setError('');

    // Check size limit
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`ফাইলের আকার ${maxSizeMB} MB-এর বেশি হতে পারবে না।`);
      return;
    }

    try {
      setLoading(true);
      let result;
      if (type === 'image') {
        result = await processImage(file);
      } else {
        result = await processRawFile(file);
      }
      if (onChange) {
        onChange(result.dataUrl, result);
      }
    } catch (err) {
      console.error('File upload error:', err);
      setError('ফাইল প্রসেস করতে সমস্যা হয়েছে। অন্য ফাইল চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      onChange('', null);
    }
    setError('');
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-text flex items-center justify-between">
          <span>{label}</span>
          {helperText && <span className="text-[11px] text-muted font-normal">{helperText}</span>}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files?.[0])}
        className="hidden"
        disabled={disabled || loading}
      />

      {/* Upload Box / Preview Area */}
      {value ? (
        <div className={`relative group overflow-hidden border border-border bg-surface-2 transition-all ${
          circular ? 'w-24 h-24 rounded-full mx-auto' : 'rounded-2xl p-2'
        }`}>
          {type === 'image' && (
            <div className={`relative overflow-hidden ${
              circular 
                ? 'w-full h-full rounded-full' 
                : aspectRatio === 'square' 
                ? 'aspect-square w-32 h-32 rounded-xl mx-auto' 
                : aspectRatio === 'banner'
                ? 'aspect-[21/9] w-full rounded-xl max-h-48'
                : 'aspect-video w-full rounded-xl max-h-56'
            }`}>
              <img
                src={value}
                alt="Uploaded Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {type === 'file' && (
            <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-text truncate">সংযুক্ত ডকুমেন্ট / ফাইল</p>
                  <span className="text-[10px] text-muted font-mono">আপলোড সম্পন্ন</span>
                </div>
              </div>
            </div>
          )}

          {type === 'video' && (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
              {value.startsWith('data:video') ? (
                <video src={value} controls className="w-full h-full object-contain" />
              ) : value.includes('youtube') || value.includes('youtu.be') ? (
                <iframe src={value} title="Video Preview" className="w-full h-full border-0" />
              ) : (
                <div className="text-center text-white p-4">
                  <Film className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <p className="text-xs font-bold">ভিডিও সংযুক্ত করা হয়েছে</p>
                </div>
              )}
            </div>
          )}

          {/* Action Overlay */}
          {!disabled && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-surface/90 hover:bg-surface text-text text-[11px] font-bold border border-border shadow-xs backdrop-blur-xs transition cursor-pointer"
                title="ফাইল পরিবর্তন করুন"
              >
                পরিবর্তন
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-lg bg-danger text-white hover:bg-danger/90 shadow-xs transition cursor-pointer"
                title="মুছে ফেলুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty Dropzone State */
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center select-none ${
            isDragging
              ? 'border-primary bg-primary-soft/50 scale-[1.01]'
              : 'border-border-strong hover:border-primary/60 hover:bg-surface-2/60 bg-surface'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${
            circular ? 'w-24 h-24 rounded-full mx-auto p-2' : ''
          }`}
        >
          {loading ? (
            <div className="py-2 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <span className="text-[11px] text-muted">প্রসেসিং হচ্ছে...</span>
            </div>
          ) : (
            <>
              <div className={`rounded-xl flex items-center justify-center mb-2 ${
                circular 
                  ? 'w-8 h-8 bg-primary-soft text-primary' 
                  : 'w-10 h-10 rounded-2xl bg-surface-2 border border-border text-primary'
              }`}>
                {type === 'video' ? (
                  <Film className="w-5 h-5 text-accent" />
                ) : type === 'file' ? (
                  <FileText className="w-5 h-5 text-primary" />
                ) : (
                  <UploadCloud className="w-5 h-5 text-primary" />
                )}
              </div>

              {!circular && (
                <>
                  <p className="text-xs font-semibold text-text">
                    <span className="text-primary hover:underline">ক্লিক করে ফাইল সিলেক্ট করুন</span> অথবা ড্র্যাগ করে ড্রপ করুন
                  </p>
                  <p className="text-[10px] text-muted mt-0.5 font-mono">
                    {type === 'image' && `JPG, PNG, WebP (সর্বোচ্চ ${maxSizeMB} MB)`}
                    {type === 'file' && `PDF, Word, Image (সর্বোচ্চ ${maxSizeMB} MB)`}
                    {type === 'video' && `MP4, WebM (সর্বোচ্চ ${maxSizeMB} MB)`}
                  </p>
                </>
              )}
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-danger pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
