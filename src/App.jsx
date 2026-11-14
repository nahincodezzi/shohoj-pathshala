import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Database,
  ArrowRight,
  Code
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const modules = [
    {
      title: 'শিক্ষার্থী ব্যবস্থাপনা (Student Directory)',
      desc: 'প্রতিটি ক্লাসের জন্য ইউনিক রোল, শিক্ষার্থী আইডি ও বিস্তারিত প্রোফাইল ডাটাবেজ।',
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'অনলাইন ভর্তি (Online Admission)',
      desc: 'ডিজিটাল ভর্তি ফরম, এডমিট স্লিপ ও আবেদন যাচাই-বাছাই প্যানেল।',
      icon: GraduationCap,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      title: 'ফলাফল ও মার্কশিট (Results & Transcripts)',
      desc: 'বোর্ড স্ট্যান্ডার্ড গ্রেডিং পলিসিসহ স্বয়ংক্রিয় জিপিএ ও মার্কশিট জেনারেশন।',
      icon: FileText,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      title: 'হিসাব ও ফি কালেকশন (Accounts & Fees)',
      desc: 'মাসিক বেতন ও পরীক্ষার ফি আদায়, ২-পার্ট ডিজিটাল রসিদ ও হিসাব খাতা।',
      icon: CreditCard,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">সহজ পাঠশালা</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Shohoj Pathshala Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Isolated & Clean
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-6 border border-blue-200">
            <Sparkles className="w-4 h-4 text-blue-500" />
            সম্পূর্ণ ফ্রেশ ও স্বাধীন প্রজেক্ট
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            স্মার্ট স্কুল ম্যানেজমেন্ট প্ল্যাটফর্ম <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              সহজ পাঠশালা (Shohoj Pathshala)
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
            এই প্রজেক্টটি সম্পূর্ণ নতুনভাবে শুরু করা হয়েছে। এতে কোনো পুরনো ডাটাবেজ কানেকশন বা গোপন ক্রেডেনশিয়াল নেই, ফলে অন্যান্য কোনো প্রজেক্ট বা ডাটাবেজে কোনো প্রকার প্রভাব পড়বে না।
          </p>

          {/* Quick Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">জিরো ডাটাবেজ লিংক</h3>
              <p className="text-xs text-slate-500">কোনো রিমোট ক্লাউড বা Supabase কানেকশন নেই। সম্পূর্ণ নিরাপদ।</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">আধুনিক ফ্রন্টএন্ড স্ট্যাক</h3>
              <p className="text-xs text-slate-500">React 19, Vite, Tailwind CSS ও Lucide Icons সেটআপ রেডি।</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">কাস্টম ব্যাকএন্ড রেডি</h3>
              <p className="text-xs text-slate-500">আপনার পছন্দমতো Flask + PostgreSQL বা অন্য ব্যাকএন্ড যুক্ত করার জন্য প্রস্তুত।</p>
            </div>
          </div>
        </section>

        {/* Planned Modules Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="max-w-2xl mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">প্ল্যাটফর্মের মূল মডিউলসমূহ</h3>
            <p className="text-sm text-slate-600">
              আপনি যেভাবে প্রয়োজন সেভাবে একে একে মডিউলগুলোর ফ্রন্টএন্ড ও নিজস্ব ব্যাকএন্ড তৈরি করতে পারবেন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {modules.map((mod, i) => {
              const IconComp = mod.icon;
              return (
                <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${mod.color}`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 mb-1">{mod.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{mod.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© ২০২৬ সহজ পাঠশালা (Shohoj Pathshala) — অল রাইটস সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              No External Database Connected
            </span>
            <span>•</span>
            <span className="font-mono text-slate-600">shohoj-pathshala v0.1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
