import React, { useEffect } from 'react';
import { ShieldAlert, Phone, Mail } from 'lucide-react';
import InitialsAvatar from '../fallbacks/InitialsAvatar';

export default function SchoolClosed({ school, support }) {
  useEffect(() => {
    // Add noindex meta tag for closed schools (Section 1.8)
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    return () => {
      if (meta) meta.content = 'index, follow';
    };
  }, []);

  const schoolName = school?.name_bn || school?.name || 'শিক্ষাপ্রতিষ্ঠান';

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl space-y-6">
        {/* School Logo or Initials */}
        <div className="flex justify-center">
          {school?.logo ? (
            <img src={school.logo} alt={schoolName} className="w-20 h-20 rounded-2xl object-cover border border-[var(--border)]" />
          ) : (
            <InitialsAvatar name={schoolName} size="xl" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-heading text-[var(--text)]">
            {schoolName}
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-xs font-semibold text-[var(--danger)]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>পোর্টালটি সাময়িকভাবে স্থগিত</span>
          </div>
        </div>

        <p className="text-sm text-[var(--muted)] leading-relaxed">
          এই ওয়েবসাইটটির সেবা বর্তমানে সাময়িকভাবে স্থগিত রয়েছে। বিস্তারিত তথ্যের জন্য প্ল্যাটফর্ম সাপোর্ট টিমের সাথে যোগাযোগ করুন।
        </p>

        {/* Support contacts */}
        <div className="p-4 rounded-2xl bg-[var(--bg-alt)] border border-[var(--border)] space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[var(--muted)] block">সহায়তা হটলাইন</span>
              <a href={`tel:${support?.phone || '01812345678'}`} className="text-xs font-bold font-mono text-[var(--text)] hover:underline">
                {support?.phone || '০১৮১২-৩৪৫৬৭৮'}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--indigo)]/15 text-[var(--indigo)] flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[var(--muted)] block">ইমেইল</span>
              <a href={`mailto:${support?.email || 'support@sohojpathshala.app'}`} className="text-xs font-bold font-mono text-[var(--text)] hover:underline">
                {support?.email || 'support@sohojpathshala.app'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
