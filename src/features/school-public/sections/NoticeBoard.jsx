import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Paperclip, ArrowRight, Calendar, Pin } from 'lucide-react';
import { Reveal } from '../../../shared/motion';
import { formatDate, formatNumber } from '../../../shared/format/formatters';

export default function NoticeBoard({
  notices = [],
  sections = {},
  onOpenNotice,
  lang = 'bn'
}) {
  if (sections.notices === false) return null;

  const isBn = lang === 'bn';
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter published notices
  const publishedNotices = useMemo(() => {
    return notices.filter(n => n.published !== false);
  }, [notices]);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set();
    publishedNotices.forEach(n => {
      if (n.category) set.add(n.category);
    });
    return Array.from(set);
  }, [publishedNotices]);

  // Filtered and sorted notices (pinned first, then date descending)
  const displayNotices = useMemo(() => {
    let list = publishedNotices;
    if (selectedCategory !== 'all') {
      list = list.filter(n => n.category === selectedCategory);
    }
    return [...list].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.date || b.created_at) - new Date(a.date || a.created_at);
    });
  }, [publishedNotices, selectedCategory]);

  const isNewNotice = (dateStr) => {
    if (!dateStr) return false;
    const diff = (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  };

  const getCategoryBadgeColor = (catIndex, isUrgent) => {
    if (isUrgent) return 'bg-[var(--accent)] text-[var(--on-accent)]';
    const styles = [
      'bg-[var(--info)]/15 text-[var(--info)] border border-[var(--info)]/30',
      'bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30',
      'bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)]'
    ];
    return styles[catIndex % styles.length] || styles[2];
  };

  return (
    <section id="notices" className="py-24 px-6 bg-[var(--bg-alt)] border-y border-[var(--border)] transition-colors duration-300">
      <div className="max-w-[1240px] mx-auto space-y-10">
        {/* Header with Title and Segmented Category Filters */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[var(--border)]">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-xs font-bold text-[var(--primary-text)] font-mono">
                <Bell className="w-3.5 h-3.5" />
                <span>{isBn ? 'ডিজিটাল নোটিশ বোর্ড' : 'NOTICE BOARD'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text)] tracking-tight">
                {isBn ? 'সাম্প্রতিক বিজ্ঞপ্তি ও নোটিশ' : 'Latest Announcements'}
              </h2>
            </div>

            {/* Segmented Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                aria-pressed={selectedCategory === 'all'}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'btn-primary-action shadow-sm'
                    : 'bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--border)]'
                }`}
              >
                {isBn ? 'সকল নোটিশ' : 'All'}
              </button>

              {categories.slice(0, 4).map((cat, i) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'btn-primary-action shadow-sm'
                      : 'bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--border)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Notice Rows */}
        {displayNotices.length > 0 ? (
          <div className="space-y-3.5">
            <AnimatePresence>
              {displayNotices.slice(0, 6).map((notice, idx) => {
                const dateVal = notice.date || notice.created_at || '2026-01-01';
                const day = formatDate(dateVal, isBn, { dayOnly: true });
                const monthYear = formatDate(dateVal, isBn, { monthYearOnly: true, shortMonth: true });
                const isNew = isNewNotice(dateVal);
                const title = isBn ? (notice.title_bn || notice.title) : (notice.title_en || notice.title);

                return (
                  <motion.div
                    key={notice.id || idx}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => onOpenNotice && onOpenNotice(notice)}
                    className="group p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)]/60 transition-all card-lift shadow-xs flex items-center justify-between gap-4 cursor-pointer"
                  >
                    {/* Left: Date Block */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="w-14 sm:w-16 py-2 px-1 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)] text-center group-hover:border-[var(--primary)]/40 transition-colors">
                        <span className="text-xl sm:text-2xl font-black font-heading text-[var(--text)] block leading-tight tabular-nums">
                          {day}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-[var(--subtle)] block truncate uppercase font-mono">
                          {monthYear}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Category, Title & Badges */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {notice.category && (
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${getCategoryBadgeColor(idx, notice.is_urgent)}`}>
                            {notice.category}
                          </span>
                        )}

                        {notice.is_pinned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent-text)] text-[10px] font-bold">
                            <Pin className="w-3 h-3" />
                            <span>{isBn ? 'পিন করা' : 'Pinned'}</span>
                          </span>
                        )}

                        {isNew && (
                          <span className="px-2 py-0.5 rounded-md bg-[var(--danger)] text-white text-[10px] font-extrabold uppercase tracking-wider animate-pulse">
                            {isBn ? 'নতুন' : 'NEW'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold font-heading text-[var(--text)] group-hover:text-[var(--primary-text)] transition-colors line-clamp-2 leading-snug">
                        {title}
                      </h3>
                    </div>

                    {/* Right: Attachment indicator & Read Arrow */}
                    <div className="flex items-center gap-3 shrink-0">
                      {notice.file_url && (
                        <div className="p-2 rounded-lg bg-[var(--bg-alt)] text-[var(--subtle)]" title={isBn ? 'সংযুক্ত ফাইল রয়েছে' : 'Attachment'}>
                          <Paperclip className="w-4 h-4" />
                        </div>
                      )}

                      <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[var(--primary-text)] group-hover:translate-x-1 transition-transform">
                        <span>{isBn ? 'পড়ুন' : 'Read'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-[var(--surface)] border border-[var(--border)] max-w-md mx-auto space-y-2">
            <Bell className="w-10 h-10 text-[var(--subtle)] mx-auto opacity-40" />
            <h4 className="text-base font-bold text-[var(--text)]">
              {isBn ? 'এই বিভাগে কোনো নোটিশ নেই' : 'No Notices Found'}
            </h4>
            <p className="text-xs text-[var(--muted)]">
              {isBn ? 'অন্য কোনো বিভাগ নির্বাচন করে পুনরায় চেষ্টা করুন।' : 'Try switching categories to view other announcements.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
