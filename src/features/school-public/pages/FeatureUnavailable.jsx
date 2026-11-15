import React from 'react';
import { Link } from 'react-router-dom';
import { Info, ArrowLeft } from 'lucide-react';

export default function FeatureUnavailable({ slug, title = 'ফিচারটি বর্তমানে উপলব্ধ নয়', message }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] flex items-center justify-center mb-6 shadow-lg">
        <Info className="w-8 h-8" />
      </div>

      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-bold font-heading text-[var(--text)]">
          {title}
        </h1>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          {message || 'এই ফিচারটি বিদ্যালয়ে বর্তমানে সক্রিয় নেই। বিস্তারিত তথ্যের জন্য বিদ্যালয় কর্তৃপক্ষের সাথে যোগাযোগ করুন।'}
        </p>
      </div>

      <div className="pt-8">
        <Link
          to={`/${slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] text-sm font-bold shadow-md hover:brightness-110 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>বিদ্যালয়ের হোমপেজে ফিরে যান</span>
        </Link>
      </div>
    </div>
  );
}
