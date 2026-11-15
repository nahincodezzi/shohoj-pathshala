import React from 'react';
import { Camera, Maximize2, Sparkles } from 'lucide-react';
import { Reveal } from '../../../shared/motion';

export default function GalleryBento({
  gallery = [],
  sections = {},
  onOpenLightbox,
  lang = 'bn'
}) {
  if (sections.gallery === false || gallery.length === 0) return null;

  const isBn = lang === 'bn';

  // Fallback demo gallery items if none entered
  const items = gallery;

  // Grid layout class based on item index (Bento 2x2, 2x1, 1x1)
  const getBentoSpan = (index, total) => {
    if (total === 1) return 'col-span-2 sm:col-span-4 row-span-2 h-[440px]';
    if (total === 2) return 'col-span-2 sm:col-span-2 row-span-2 h-[440px]';
    if (index === 0) return 'col-span-2 sm:col-span-2 row-span-2 h-[440px]';
    if (index === 1) return 'col-span-2 sm:col-span-2 row-span-1 h-[210px]';
    return 'col-span-1 sm:col-span-1 row-span-1 h-[210px]';
  };

  return (
    <section id="gallery" className="py-24 px-6 max-w-[1240px] mx-auto space-y-12">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)] text-xs font-bold text-[var(--accent-text)]">
              <Camera className="w-3.5 h-3.5" />
              <span>{isBn ? 'ফটো অ্যালবাম' : 'PHOTO GALLERY'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text)] tracking-tight">
              {isBn ? 'ক্যাম্পাস ও সহশিক্ষা কার্যক্রমের চিত্র' : 'Moments & Campus Life'}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[var(--muted)] max-w-md font-body">
            {isBn ? 'আমাদের শিক্ষার্থীদের খেলাধুলা, সাংস্কৃতিক আয়োজন ও বিজ্ঞান মেলার স্মরণীয় মুহূর্তসমূহ।' : 'Memorable snapshots of sports, cultural galas, and school events.'}
          </p>
        </div>
      </Reveal>

      {/* Bento Grid */}
      <Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[210px]">
          {items.slice(0, 4).map((item, idx) => {
            const spanClass = getBentoSpan(idx, items.length);
            const caption = isBn ? (item.title_bn || item.title || item.caption) : (item.title_en || item.title || item.caption);

            return (
              <div
                key={item.id || idx}
                onClick={() => onOpenLightbox && onOpenLightbox(item)}
                className={`group relative rounded-3xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] shadow-md cursor-pointer select-none card-lift ${spanClass}`}
              >
                {/* Image with .img-zoom */}
                <img
                  src={item.image_url || item.url}
                  alt={caption || 'School gallery image'}
                  loading="lazy"
                  className="w-full h-full object-cover img-zoom"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                {/* Expand Icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Caption appearing on hover */}
                {caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-bold font-heading text-white line-clamp-2 drop-shadow-md">
                      {caption}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
