import React from 'react';
import TiltCard from '../motion/TiltCard';
import { 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  TrendingUp, 
  Calendar,
  Layers, 
  Bell, 
  ShieldCheck, 
  Activity,
  Sparkles
} from 'lucide-react';

export default function DashboardMockup({ t }) {
  // Chart bar heights
  const chartBars = [
    { label: 'রবি', height: '62%' },
    { label: 'সোম', height: '88%' },
    { label: 'মঙ্গল', height: '94%' },
    { label: 'বুধ', height: '76%' },
    { label: 'বৃহ', height: '85%' },
    { label: 'আজ', height: '92%', active: true }
  ];

  return (
    <div className="relative w-full max-w-[540px] mx-auto select-none">
      {/* Floating Glass Chip 1: Top-Left (Result Published) */}
      <div 
        className="absolute -top-6 -left-4 sm:-left-8 z-20 animate-float pointer-events-none"
        aria-hidden="true"
      >
        <div className="px-4 py-2.5 rounded-[18px] bg-[var(--glass)] backdrop-blur-md border border-[rgba(var(--ink-rgb),0.12)] shadow-xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-primary-text" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-text leading-tight flex items-center gap-1.5">
              <span>{t.mockup_chip_result_title}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            </div>
            <div className="text-[10px] text-muted font-medium">
              {t.mockup_chip_result_sub}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Glass Chip 2: Bottom-Right (Admission Request + Ping dot) */}
      <div 
        className="absolute -bottom-6 -right-3 sm:-right-6 z-20 animate-float-delayed pointer-events-none"
        aria-hidden="true"
      >
        <div className="px-4 py-2.5 rounded-[18px] bg-[var(--glass)] backdrop-blur-md border border-[rgba(var(--ink-rgb),0.12)] shadow-xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo/20 text-indigo flex items-center justify-center shrink-0 relative">
            <GraduationCap className="w-4 h-4 text-indigo" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-indigo animate-ping-dot" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-text leading-tight">
              {t.mockup_chip_admission_title}
            </div>
            <div className="text-[10px] text-indigo font-semibold">
              {t.mockup_chip_admission_sub}
            </div>
          </div>
        </div>
      </div>

      {/* Main 3D Tilt Browser Mockup Frame */}
      <TiltCard
        initialRotateX={6}
        initialRotateY={-14}
        maxTilt={6}
        className="w-full rounded-[24px] bg-surface border border-[rgba(var(--ink-rgb),0.12)] shadow-[0_40px_120px_-30px_var(--glow)] overflow-hidden transition-all duration-300"
      >
        {/* Browser Top Window Bar */}
        <div className="px-4 py-3 bg-[rgba(var(--ink-rgb),0.03)] border-b border-[rgba(var(--ink-rgb),0.07)] flex items-center gap-3">
          {/* Traffic Light Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
          </div>

          {/* URL Address Bar */}
          <div className="flex-1 mx-2">
            <div className="w-full max-w-[280px] mx-auto py-1 px-3 rounded-lg bg-surface border border-[rgba(var(--ink-rgb),0.08)] text-[11px] font-mono text-muted text-center truncate flex items-center justify-center gap-1.5">
              <span className="text-primary-text font-bold">🔒</span>
              <span>{t.mockup_url}</span>
            </div>
          </div>

          <div className="w-6 flex justify-end">
            <span className="w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>

        {/* Dashboard Window Body */}
        <div className="p-4 sm:p-5 flex gap-4 min-h-[310px] bg-surface">
          {/* Mini Sidebar */}
          <div className="w-12 py-2 rounded-xl bg-surface-2 border border-[rgba(var(--ink-rgb),0.06)] flex flex-col items-center gap-3.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs">
              ব
            </div>
            <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary-text flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div className="w-7 h-7 rounded-lg text-muted hover:text-text flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div className="w-7 h-7 rounded-lg text-muted hover:text-text flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="w-7 h-7 rounded-lg text-muted hover:text-text flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div className="w-7 h-7 rounded-lg text-muted hover:text-text flex items-center justify-center mt-auto">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Main Dashboard Canvas */}
          <div className="flex-1 space-y-3.5">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Stat 1: Students */}
              <div className="p-3 rounded-xl bg-surface-2 border border-[rgba(var(--ink-rgb),0.06)] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-muted font-medium">
                  <span>{t.mockup_stat_students_label}</span>
                  <Users className="w-3.5 h-3.5 text-primary-text" />
                </div>
                <div className="text-xl font-heading font-extrabold text-text">
                  {t.mockup_stat_students}
                </div>
                <div className="text-[10px] text-primary-text font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+৯৮.৫% অ্যাক্টিভ</span>
                </div>
              </div>

              {/* Stat 2: Attendance */}
              <div className="p-3 rounded-xl bg-surface-2 border border-[rgba(var(--ink-rgb),0.06)] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-muted font-medium">
                  <span>{t.mockup_stat_attendance_label}</span>
                  <Calendar className="w-3.5 h-3.5 text-warning" />
                </div>
                <div className="text-xl font-heading font-extrabold text-text">
                  {t.mockup_stat_attendance}
                </div>
                <div className="text-[10px] text-muted font-medium">
                  রিয়েল-টাইম উপস্থিতি
                </div>
              </div>
            </div>

            {/* Attendance Chart Mockup */}
            <div className="p-3.5 rounded-xl bg-surface-2 border border-[rgba(var(--ink-rgb),0.06)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-text">সাপ্তাহিক উপস্থিতি ট্র্যাকার</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary-text">
                  লাইভ গ্রাফ
                </span>
              </div>

              {/* 6 Vertical Bars */}
              <div className="h-24 pt-4 flex items-end justify-between gap-2.5 px-2">
                {chartBars.map((bar, i) => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full bg-[rgba(var(--ink-rgb),0.06)] rounded-md h-full flex items-end overflow-hidden p-0.5">
                      <div
                        className={`w-full rounded-[4px] bar-grow ${
                          bar.active
                            ? 'bg-gradient-to-t from-primary to-emerald-400'
                            : 'bg-primary/40'
                        }`}
                        style={{
                          height: bar.height,
                          animationDelay: `${i * 0.12}s`
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-subtle font-medium">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
