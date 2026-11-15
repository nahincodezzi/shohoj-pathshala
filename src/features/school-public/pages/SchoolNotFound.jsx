import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function SchoolNotFound({ slug }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--danger)]/15 border border-[var(--danger)]/30 text-[var(--danger)] flex items-center justify-center mb-6 shadow-lg">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="max-w-md space-y-3">
        <h1 className="text-3xl font-extrabold font-heading text-[var(--text)]">
          স্কুল পাওয়া যায়নি (404)
        </h1>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          {slug ? `"${slug}" ঠিকানায় কোনো সক্রিয় শিক্ষাপ্রতিষ্ঠান নিবন্ধিত নেই।` : 'অনুরোধকৃত শিক্ষাপ্রতিষ্ঠানটি খুঁজে পাওয়া যায়নি।'}
        </p>
      </div>

      <div className="pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] text-sm font-bold shadow-md hover:brightness-110 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সহজ পাঠশালা হোমপেজে যান</span>
        </Link>
      </div>
    </div>
  );
}
