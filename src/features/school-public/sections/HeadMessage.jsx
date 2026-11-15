import React, { useState } from 'react';
import { Quote, ArrowRight, Users, BookOpen } from 'lucide-react';
import { Reveal } from '../../../shared/motion';
import InitialsAvatar from '../fallbacks/InitialsAvatar';

export default function HeadMessage({
  school,
  settings,
  headmaster,
  teachers = [],
  sections = {},
  onOpenFaculty,
  lang = 'bn'
}) {
  if (sections.message === false) return null;

  const isBn = lang === 'bn';
  const rawMessage = settings?.head_message || settings?.principal_message || school?.headmaster_message || (isBn ? 'সহজ পাঠশালা প্ল্যাটফর্মে আমাদের বিদ্যালয়ের ডিজিটাল পোর্টালে আপনাদের স্বাগতম। সুশিক্ষা, নৈতিকতা ও আধুনিক প্রযুক্তির সমন্বয়ে আমাদের শিক্ষার্থীরা আগামী দিনের সমৃদ্ধ বাংলাদেশ গড়ার নেতৃত্ব দেবে।' : 'Welcome to our institution portal.');
  const headName = headmaster?.name_bn || headmaster?.name || settings?.head_name || school?.headmaster_name || (isBn ? 'প্রধান শিক্ষক' : 'Headmaster');
  const headRole = headmaster?.designation_bn || headmaster?.designation || (isBn ? 'প্রধান শিক্ষক' : 'Headmaster');
  const headPhoto = headmaster?.photo || settings?.head_photo || school?.headmaster_photo;

  if (!headName && !rawMessage) return null;

  const [expanded, setExpanded] = useState(false);
  const isLong = rawMessage.length > 450;
  const displayMessage = (isLong && !expanded) ? `${rawMessage.slice(0, 450)}...` : rawMessage;

  return (
    <section id="about" className="py-24 px-6 max-w-[1240px] mx-auto">
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: 330px Round Photo with .ring-spin & Floating Glass Badge */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              {/* Outer Conic Ring Spin */}
              <div 
                className="absolute inset-0 rounded-full ring-spin p-[3px]"
                style={{
                  background: 'conic-gradient(var(--accent), var(--primary), transparent 60%, var(--accent))'
                }}
              />

              {/* Inner Circle Frame */}
              <div className="absolute inset-1.5 rounded-full overflow-hidden border-4 border-[var(--bg)] bg-[var(--surface)] shadow-2xl">
                {headPhoto ? (
                  <img
                    src={headPhoto}
                    alt={headName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <InitialsAvatar name={headName} size="huge" />
                )}
              </div>

              {/* Floating Glass Name Card (Bottom-Right) */}
              <div className="absolute -bottom-4 -right-2 sm:-right-4 px-4 py-3 rounded-2xl bg-[var(--glass)] backdrop-blur-md border border-[var(--border)] shadow-xl animate-float max-w-[210px] select-none">
                <h4 className="text-sm font-bold font-heading text-[var(--text)] truncate">
                  {headName}
                </h4>
                <p className="text-[11px] font-semibold text-[var(--accent-text)] truncate mt-0.5">
                  {headRole}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Message & Quote */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)] text-xs font-bold text-[var(--accent-text)]">
                <Quote className="w-3.5 h-3.5" />
                <span>{isBn ? 'প্রধান শিক্ষকের বাণী' : 'Message from the Headmaster'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[var(--text)] tracking-tight leading-tight">
                {isBn ? 'জ্ঞান, শৃঙ্খলা ও' : 'Knowledge, Discipline &'}{' '}
                <span className="text-gold-shimmer">{isBn ? 'নৈতিকতার আলোকবর্তিকা' : 'Moral Beacon'}</span>
              </h2>
            </div>

            {/* Quote Body with large “ watermark */}
            <div className="relative pt-2">
              <Quote className="absolute -top-4 -left-4 w-12 h-12 text-[var(--primary)] opacity-10 pointer-events-none" />
              <p className="relative z-10 text-[var(--muted)] text-base sm:text-[17px] leading-[1.85] font-body">
                {displayMessage || (isBn ? 'সুপ্রিয় অভিভাবক ও শুভানুধ্যায়ী, আমাদের বিদ্যালয় শুধুমাত্র পাঠ্যবইয়ের জ্ঞানে সীমাবদ্ধ নয়; প্রতিটি শিক্ষার্থীকে আদর্শ, দক্ষ ও দেশপ্রেমিক সুনাগরিক হিসেবে গড়ে তোলাই আমাদের অঙ্গীকার।' : 'Welcome to our institution. Our commitment is to foster intellectual excellence, moral strength, and patriotic citizens.')}
              </p>

              {isLong && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 text-xs font-bold text-[var(--accent-text)] hover:underline cursor-pointer"
                >
                  {expanded ? (isBn ? 'সংক্ষেপ করুন' : 'Show Less') : (isBn ? 'আরও পড়ুন...' : 'Read More...')}
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#departments"
                className="btn-primary-action inline-flex items-center gap-2 h-11 px-5 rounded-xl text-xs font-bold hover:brightness-110 shadow-sm"
              >
                <span>{isBn ? 'আমাদের ইতিহাস ও লক্ষ্য' : 'History & Vision'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {teachers.length > 0 && (
                <button
                  type="button"
                  onClick={onOpenFaculty}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[var(--bg-alt)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)] text-xs font-bold transition-all cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span>{isBn ? 'শিক্ষক পরিষদের তালিকা' : 'Faculty Directory'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
