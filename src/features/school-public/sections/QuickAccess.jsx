import React, { useState } from 'react';
import { Search, GraduationCap, Clock, Phone, Mail, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Reveal } from '../../../shared/motion';
import { toEnglishDigits } from '../../../shared/format/formatters';

export default function QuickAccess({
  school,
  settings,
  features = {},
  admissionSettings = {},
  onSearchMarksheet,
  onOpenAdmissionForm,
  onOpenTracking,
  onQuickResultSearch,
  onApplyClick,
  onTrackClick,
  lang = 'bn'
}) {
  const isBn = lang === 'bn';
  const handleSearchAction = onSearchMarksheet || onQuickResultSearch;
  const handleApplyAction = onOpenAdmissionForm || onApplyClick;
  const handleTrackAction = onOpenTracking || onTrackClick;

  // 1. Result State
  const [examType, setExamType] = useState('Annual');
  const [studentClass, setStudentClass] = useState('10');
  const [rollNumber, setRollNumber] = useState('1');
  const [rollError, setRollError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleResultSubmit = (e) => {
    e.preventDefault();
    if (!rollNumber.trim()) {
      setRollError(isBn ? 'রোল নম্বর লিখুন' : 'Enter roll number');
      return;
    }
    setRollError('');
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      if (handleSearchAction) {
        handleSearchAction({
          classVal: studentClass,
          rollVal: toEnglishDigits(rollNumber.trim()),
          examVal: examType,
          yearVal: '2026'
        });
      }
    }, 400);
  };

  const handleRollChange = (e) => {
    setRollNumber(e.target.value);
    if (rollError) setRollError('');
  };

  const admissionYear = admissionSettings?.year || '২০২৬';
  const admissionDeadline = admissionSettings?.end_date || (isBn ? '১৫ জানুয়ারি ২০২৬' : '15 Jan 2026');

  // Helpline
  const phone = settings?.phone || school?.phone || '০১৮১২-৩৪৫৬৭৮';
  const email = settings?.email || school?.email || 'info@school.edu.bd';
  const classHours = settings?.class_hours || (isBn ? 'সকাল ৯:০০ - দুপুর ২:০০' : '9:00 AM - 2:00 PM');
  const officeHours = settings?.office_hours || (isBn ? 'সকাল ৯:০০ - বিকাল ৪:০০' : '9:00 AM - 4:00 PM');

  // Gating visibility
  const showResult = Boolean(features.resultSearch);
  const showAdmission = Boolean(features.admissionForm || features.admissionTrack);
  const showHelpline = true;

  if (!showResult && !showAdmission && !showHelpline) return null;

  return (
    <section id="results" className="py-20 px-6 max-w-[1240px] mx-auto">
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Fast Result Search (takes 5 cols if other 2 exist) */}
          {showResult && (
            <div className={`${showAdmission ? 'lg:col-span-4' : 'lg:col-span-6'} p-7 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl flex flex-col justify-between card-lift`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-[var(--primary)] flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--subtle)]">
                    {isBn ? 'অনলাইন ফলাফল' : 'Online Results'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-heading text-[var(--text)]">
                    {isBn ? 'দ্রুত রেজাল্ট অনুসন্ধান' : 'Quick Result Search'}
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5 font-body">
                    {isBn ? 'শ্রেণি, রোল ও পরীক্ষার নাম নির্বাচন করে ফলাফল দেখুন' : 'Select class, exam and roll number'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleResultSubmit} className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-[var(--subtle)] block mb-1">
                        {isBn ? 'পরীক্ষা' : 'Exam'}
                      </label>
                      <select
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)] text-xs text-[var(--text)] font-medium focus:border-[var(--primary)] focus:outline-none"
                      >
                        <option value="Annual">{isBn ? 'বার্ষিক পরীক্ষা' : 'Annual Exam'}</option>
                        <option value="HalfYearly">{isBn ? 'অর্ধবার্ষিক পরীক্ষা' : 'Half Yearly'}</option>
                        <option value="ModelTest">{isBn ? 'মডেল টেস্ট' : 'Model Test'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[var(--subtle)] block mb-1">
                        {isBn ? 'শ্রেণি' : 'Class'}
                      </label>
                      <select
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)] text-xs text-[var(--text)] font-medium focus:border-[var(--primary)] focus:outline-none"
                      >
                        <option value="6">{isBn ? '৬ষ্ঠ শ্রেণি' : 'Class 6'}</option>
                        <option value="7">{isBn ? '৭ম শ্রেণি' : 'Class 7'}</option>
                        <option value="8">{isBn ? '৮ম শ্রেণি' : 'Class 8'}</option>
                        <option value="9">{isBn ? '৯ম শ্রেণি' : 'Class 9'}</option>
                        <option value="10">{isBn ? '১০ম শ্রেণি' : 'Class 10'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[var(--subtle)] block mb-1">
                      {isBn ? 'রোল নম্বর' : 'Roll Number'}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={rollNumber}
                      onChange={handleRollChange}
                      placeholder={isBn ? 'যেমন: ১' : 'e.g. 1'}
                      className={`w-full h-10 px-3 rounded-xl bg-[var(--bg-alt)] border text-xs text-[var(--text)] font-medium focus:outline-none ${
                        rollError ? 'border-[var(--danger)] focus:border-[var(--danger)]' : 'border-[var(--border)] focus:border-[var(--primary)]'
                      }`}
                    />
                    {rollError && (
                      <span className="text-[11px] text-[var(--danger)] mt-1 block" aria-live="polite">
                        {rollError}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSearching}
                    className="btn-primary-action w-full h-11 rounded-xl font-bold text-xs shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{isSearching ? (isBn ? 'খোঁজা হচ্ছে...' : 'Searching...') : (isBn ? 'ফলাফল ও মার্কশিট দেখুন' : 'View Marksheet')}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Card 2: Admission Card (Solid --primary background) */}
          {showAdmission && (
            <div
              id="admission"
              className={`${showResult ? 'lg:col-span-4' : 'lg:col-span-6'} p-7 rounded-3xl bg-[var(--primary)] text-[var(--on-primary)] shadow-2xl flex flex-col justify-between relative overflow-hidden card-lift`}
            >
              {/* Background ambient bubble */}
              <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />

              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-current" />
                  </div>

                  {features.admissionForm && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent)] text-[var(--on-accent)] text-[11px] font-extrabold shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[var(--on-accent)] animate-ping-dot" />
                      <span>{isBn ? `ভর্তি চলছে · ${admissionYear}` : `Admissions Open · ${admissionYear}`}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold font-heading leading-tight">
                    {isBn ? 'অনলাইন ভর্তি কার্যক্রম' : 'Online Admissions'}
                  </h3>
                  <p className="text-xs opacity-90 mt-1 font-body">
                    {features.admissionForm
                      ? (isBn ? `শেষ সময়: ${admissionDeadline}` : `Deadline: ${admissionDeadline}`)
                      : (isBn ? 'এ বছরের ভর্তি ফরম বিতরণ সাময়িকভাবে বন্ধ রয়েছে' : 'Admission form submissions are currently closed')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative pt-6 space-y-2.5">
                {features.admissionForm && (
                  <button
                    type="button"
                    onClick={handleApplyAction}
                    className="w-full h-11 rounded-xl bg-[var(--surface)] text-[var(--text)] font-extrabold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isBn ? 'আবেদন ফরম পূরণ করুন' : 'Fill Application Form'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--primary)]" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleTrackAction}
                  className="w-full h-10 rounded-xl bg-black/20 hover:bg-black/30 border border-white/25 text-current font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isBn ? 'আবেদন ট্র্যাক ও প্রবেশপত্র' : 'Track Application & Admit'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Card 3: Schedule & Helpline */}
          <div className={`${(showResult && showAdmission) ? 'lg:col-span-4' : 'lg:col-span-6'} p-7 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl flex flex-col justify-between card-lift`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent-text)] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--subtle)]">
                  {isBn ? 'অফিসিয়াল সময়' : 'Office Hours'}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold font-heading text-[var(--text)]">
                  {isBn ? 'সময়সূচি ও হেল্পলাইন' : 'Schedule & Helpline'}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5 font-body">
                  {isBn ? 'বিদ্যালয়ের কার্যক্রম ও জরুরি যোগাযোগ' : 'Academic hours & direct phone'}
                </p>
              </div>

              {/* Rows */}
              <div className="space-y-2.5 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-between">
                  <span className="text-[var(--muted)]">{isBn ? 'শ্রেণি পাঠদান:' : 'Class Hours:'}</span>
                  <strong className="text-[var(--text)] font-semibold">{classHours}</strong>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-between">
                  <span className="text-[var(--muted)]">{isBn ? 'অফিসিয়াল সময়:' : 'Office Hours:'}</span>
                  <strong className="text-[var(--text)] font-semibold">{officeHours}</strong>
                </div>
              </div>
            </div>

            {/* Helpline Actions */}
            <div className="pt-6 grid grid-cols-2 gap-2">
              <a
                href={`tel:${phone}`}
                className="h-10 rounded-xl bg-[var(--bg-alt)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>{isBn ? 'সরাসরি কল' : 'Call'}</span>
              </a>

              <a
                href="#contact"
                className="h-10 rounded-xl bg-[var(--bg-alt)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{isBn ? 'বার্তা পাঠান' : 'Message'}</span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
