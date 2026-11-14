import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, ArrowRight, ShieldAlert } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-8 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mx-auto mb-6 border border-primary/25">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
          404 · Page Not Found
        </span>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text mt-2 mb-3">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed mb-8">
          আপনি যে ঠিকানাটি খুঁজছেন সেটি পরিবর্তিত হয়েছে বা ভুল ইউআরএল দেওয়া হয়েছে। নিচের অপশনগুলো থেকে সহজে চলে যেতে পারেন:
        </p>

        <div className="space-y-3 mb-8 text-left">
          <Link 
            to="/" 
            className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 text-primary" />
              <div>
                <span className="text-xs font-bold text-text block">সহজ পাঠশালা হোমপেজ</span>
                <span className="text-[10px] text-muted">মূল প্ল্যাটফর্ম ও সকল স্কুলের তালিকা</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <Link 
            to="/bdhs" 
            className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-500 font-bold text-xs flex items-center justify-center">
                ব
              </span>
              <div>
                <span className="text-xs font-bold text-text block">বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়</span>
                <span className="text-[10px] text-muted">/bdhs পাবলিক পোর্টাল</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <Link 
            to="/owner" 
            className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-indigo" />
              <div>
                <span className="text-xs font-bold text-text block">Platform Owner কন্ট্রোল</span>
                <span className="text-[10px] text-muted">সুপার অ্যাডমিন ও ওনার ড্যাশবোর্ড</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        <Link to="/">
          <Button variant="primary" size="md" className="w-full">
            হোমপেজে ফিরে যান
          </Button>
        </Link>
      </div>
    </div>
  );
}

