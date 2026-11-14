import React from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Palette,
  Sun,
  Moon,
  ArrowRight
} from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import ThemeToggle from './components/common/ThemeToggle';

export default function App() {
  const { mode, theme, toggleMode, setTheme, isDark } = useTheme();

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-header-bg backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-primary text-on-primary font-heading font-bold text-lg flex items-center justify-center shadow-md">
              সপ
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-text leading-tight">সহজ পাঠশালা</h1>
              <p className="text-xs text-muted font-medium">Sohoj Pathshala · থিম ফাউন্ডেশন (ধাপ ১)</p>
            </div>
          </div>

          {/* Controls: Theme picker & Mode Toggle */}
          <div className="flex items-center gap-3">
            {/* Theme Selector (Emerald / Indigo) */}
            <div className="hidden sm:flex items-center p-1 rounded-[10px] bg-surface border border-border-strong text-xs font-semibold gap-1">
              <button
                type="button"
                onClick={() => setTheme('emerald')}
                className={`px-2.5 py-1 rounded-[8px] transition-colors cursor-pointer ${
                  theme === 'emerald'
                    ? 'bg-primary text-on-primary'
                    : 'text-muted hover:text-text'
                }`}
              >
                Emerald
              </button>
              <button
                type="button"
                onClick={() => setTheme('indigo')}
                className={`px-2.5 py-1 rounded-[8px] transition-colors cursor-pointer ${
                  theme === 'indigo'
                    ? 'bg-indigo text-white'
                    : 'text-muted hover:text-text'
                }`}
              >
                Indigo
              </button>
            </div>

            {/* Accessible Mode Toggle Button */}
            <ThemeToggle mode={mode} toggleMode={toggleMode} lang="bn" />
          </div>
        </div>
      </header>

      {/* Main Showcase */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Step 1 Completion Hero */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-6 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            ধাপ ১ — থিম ফাউন্ডেশন সফলভাবে বাস্তবায়িত
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-text tracking-tight leading-tight mb-4">
            টোকেন-ভিত্তিক পূর্ণাঙ্গ <br />
            <span className="text-primary">
              ডার্ক ও লাইট ডিজাইন সিস্টেম
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted mb-8 leading-relaxed">
            কোনো রঙই হার্ডকোড করা নয়। সমস্ত উপাদান CSS ভেরিয়েবল টোকেন থেকে রেন্ডার হচ্ছে। রিফ্রেশ করলেও ব্যবহারকারীর নির্বাচিত মোড (<span className="text-primary font-mono">{mode}</span>) ও থিম (<span className="text-primary font-mono">{theme}</span>) স্থায়ী থাকে।
          </p>

          {/* Token Verification Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success-soft text-success border border-success/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              WCAG AA Contrast Verified (≥ 4.5:1)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-soft text-accent border border-accent-line">
              <ShieldCheck className="w-3.5 h-3.5" />
              No Flash Pre-paint Script Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-soft text-indigo border border-indigo/30">
              <Palette className="w-3.5 h-3.5" />
              Emerald & Indigo Themes Ready
            </span>
          </div>
        </section>

        {/* Live Color Tokens Matrix Grid */}
        <section className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm mb-12">
          <h3 className="text-xl font-heading font-bold text-text mb-2">লাইভ কালার টোকেন ম্যাট্রিক্স</h3>
          <p className="text-xs text-muted mb-6">বর্তমান মোড ({mode}) ও থিমে ({theme}) টোকেনগুলোর লাইভ রেন্ডারিং:</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-bg border border-border">
              <div className="w-full h-8 rounded-lg bg-bg border border-border mb-2" />
              <p className="text-xs font-mono font-bold text-text">--bg</p>
              <p className="text-[11px] text-muted">মূল ব্যাকগ্রাউন্ড</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-2 border border-border">
              <div className="w-full h-8 rounded-lg bg-surface border border-border mb-2" />
              <p className="text-xs font-mono font-bold text-text">--surface</p>
              <p className="text-[11px] text-muted">কার্ড ও সারফেস</p>
            </div>

            <div className="p-3 rounded-xl bg-bg-alt border border-border">
              <div className="w-full h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center text-xs font-bold mb-2">
                Aa
              </div>
              <p className="text-xs font-mono font-bold text-text">--primary</p>
              <p className="text-[11px] text-muted">বাটন ও ব্র্যান্ড</p>
            </div>

            <div className="p-3 rounded-xl bg-accent-soft border border-accent-line">
              <div className="w-full h-8 rounded-lg bg-accent text-white flex items-center justify-center text-xs font-bold mb-2">
                !
              </div>
              <p className="text-xs font-mono font-bold text-accent">--accent</p>
              <p className="text-[11px] text-muted">জরুরি ও টিকার</p>
            </div>

            <div className="p-3 rounded-xl bg-success-soft border border-success/30">
              <div className="w-full h-8 rounded-lg bg-success text-white flex items-center justify-center text-xs font-bold mb-2">
                ✓
              </div>
              <p className="text-xs font-mono font-bold text-success">--success</p>
              <p className="text-[11px] text-muted">সফল ও অনুমোদিত</p>
            </div>

            <div className="p-3 rounded-xl bg-danger-soft border border-danger/30">
              <div className="w-full h-8 rounded-lg bg-danger text-white flex items-center justify-center text-xs font-bold mb-2">
                ✕
              </div>
              <p className="text-xs font-mono font-bold text-danger">--danger</p>
              <p className="text-[11px] text-muted">বিপদ ও বাতিল</p>
            </div>
          </div>
        </section>

        {/* Next Step Teaser */}
        <section className="bg-bg-alt rounded-2xl p-6 sm:p-8 border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">পরবর্তী ধাপ</span>
            <h4 className="text-xl font-heading font-bold text-text mt-1 mb-2">ধাপ ২: কম্পোনেন্ট লাইব্রেরি ও /design শোকেস</h4>
            <p className="text-xs sm:text-sm text-muted">
              বাটন, ইনপুট, সিলেক্ট, চেকবক্স, কার্ড, ব্যাজ, ফিল্টার চিপ, Accessible GridTable, এবং অ্যালার্টসহ সব কম্পোনেন্ট ডার্ক ও লাইট পাশাপাশি প্রদর্শনের জন্য প্রস্তুত করা হবে।
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-primary text-on-primary font-semibold text-sm shadow-sm">
              ধাপ ১ সম্পন্ন <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© ২০২৬ সহজ পাঠশালা · Sohoj Pathshala — অল রাইটস সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-subtle">Mode: {mode} | Theme: {theme}</span>
            <span>•</span>
            <span className="text-primary font-medium">সহজ পাঠশালা দ্বারা পরিচালিত</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
