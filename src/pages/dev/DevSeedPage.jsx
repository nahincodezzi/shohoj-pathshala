import React, { useState, useEffect } from 'react';
import { SeedGenerator } from '../../../seed/generator.js';
import { SeedVerifier } from '../../../seed/verify.js';
import { SCHOOL_SPECS } from '../../../seed/schools.js';
import { EDGE_CASES } from '../../../seed/edgeCases.js';
import { TenantRepository, initTenantStorage } from '../../services/tenantStorage.js';
import { Database, RefreshCw, CheckCircle, AlertTriangle, Shield, Key, FileText, ArrowRight, Trash2 } from 'lucide-react';

export default function DevSeedPage() {
  const [scale, setScale] = useState('lite');
  const [seedVal, setSeedVal] = useState('20261116');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [storageStats, setStorageStats] = useState({ kb: 0, mb: 0, percent: 0 });
  const [verifyResults, setVerifyResults] = useState(null);
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'credentials' | 'edgecases' | 'verifier'

  const STORAGE_PREFIX = 'sp_tenant_';
  const TABLES = [
    'schools', 'settings', 'sliders', 'uniforms', 'facilities',
    'committee', 'teachers', 'students', 'admissions', 'results',
    'receipts', 'notices', 'routines', 'gallery', 'videos',
    'contact_messages', 'users', 'audit_logs'
  ];

  const log = (msg) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const calculateStorage = () => {
    let totalLength = 0;
    TABLES.forEach(tbl => {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${tbl}`) || '';
      totalLength += raw.length * 2; // UTF-16 bytes
    });
    const kb = Math.round(totalLength / 1024);
    const mb = (kb / 1024).toFixed(2);
    const percent = Math.min(100, Math.round((kb / 4096) * 100)); // against 4MB limit
    setStorageStats({ kb, mb, percent });
  };

  useEffect(() => {
    initTenantStorage();
    calculateStorage();
    log('Dev Seed Console ready. Environment: Development.');
  }, []);

  const loadAllCurrentTables = () => {
    const data = {};
    TABLES.forEach(tbl => {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${tbl}`);
      data[tbl] = raw ? JSON.parse(raw) : [];
    });
    return data;
  };

  const saveAllTables = (data) => {
    TABLES.forEach(tbl => {
      if (data[tbl]) {
        localStorage.setItem(`${STORAGE_PREFIX}${tbl}`, JSON.stringify(data[tbl]));
      }
    });
    calculateStorage();
  };

  const handleRunSeed = () => {
    setIsRunning(true);
    log(`Starting Seed Generation (Scale: ${scale}, Seed: ${seedVal})...`);
    setTimeout(() => {
      try {
        const existing = loadAllCurrentTables();
        const generator = new SeedGenerator({
          scale,
          seed: parseInt(seedVal, 10) || 20261116
        });
        const populated = generator.generateAll(existing);
        saveAllTables(populated);

        log(`✅ Seeding Complete!`);
        log(`- Schools: ${generator.stats.schools}`);
        log(`- Students: ${generator.stats.students}`);
        log(`- Teachers: ${generator.stats.teachers}`);
        log(`- Receipts: ${generator.stats.receipts}`);
        log(`- Results: ${generator.stats.results}`);
        log(`- Payload Size: ${generator.stats.total_kb} KB (${generator.stats.total_mb} MB)`);

        // Run verifier automatically
        const verifier = new SeedVerifier(populated);
        const res = verifier.runAll();
        setVerifyResults(res);
        log(`Verification: ${res.passed}/${res.total} checks passed.`);
      } catch (err) {
        log(`❌ Error during seed: ${err.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  const handleReset = () => {
    if (!window.confirm('আপনি কি নিশ্চিত যে সমস্ত ডেমো ডেটা মুছে আসল অবস্থায় ফিরে যাবেন? (BDHS-এর আসল ডেটা অক্ষত থাকবে)')) return;
    setIsRunning(true);
    log('Resetting demo data...');
    setTimeout(() => {
      try {
        const current = loadAllCurrentTables();
        Object.keys(current).forEach(tbl => {
          current[tbl] = current[tbl].filter(row => !row.is_demo);
        });
        saveAllTables(current);
        log('✅ Demo records purged successfully! Real BDHS data preserved.');
        setVerifyResults(null);
      } catch (err) {
        log(`❌ Error during reset: ${err.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  const handleRunVerify = () => {
    setIsRunning(true);
    log('Running Verification Suite...');
    setTimeout(() => {
      try {
        const current = loadAllCurrentTables();
        const verifier = new SeedVerifier(current);
        const res = verifier.runAll();
        setVerifyResults(res);
        log(`Verification Finished: ${res.passed} passed, ${res.failed} failed.`);
      } catch (err) {
        log(`❌ Error during verification: ${err.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 pb-20">
      {/* Dev Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30 text-xs font-mono font-bold tracking-wider">
              DEV ONLY
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Database className="w-6 h-6 text-emerald-400" />
              সহজ পাঠশালা — ডেমো ও এজ-কেস সিডার (Seed Hub)
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            মাস্টার প্রম্পট মেনে ৯টি স্কুলের বাস্তবসম্মত বাংলাদেশি ডেটা ও এজ-কেস (E01–E40) ম্যানেজমেন্ট টুল।
          </p>
        </div>

        {/* LocalStorage Gauge */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-4 min-w-[260px]">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>LocalStorage ব্যবহার</span>
              <span className={`font-mono font-bold ${storageStats.percent > 85 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {storageStats.kb} KB / 4096 KB ({storageStats.percent}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${storageStats.percent > 85 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${storageStats.percent}%` }}
              />
            </div>
          </div>
          <button
            onClick={calculateStorage}
            title="রিফ্রেশ করুন"
            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Controls & Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              ⚙️ সিডার কনফিগারেশন
            </h2>

            {/* Scale Profile */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 mb-2">স্কেল প্রোফাইল (Scale Profile)</label>
              <div className="grid grid-cols-3 gap-2">
                {['lite', 'normal', 'heavy'].map(sc => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setScale(sc)}
                    className={`py-2 text-xs font-bold uppercase rounded-lg border transition ${
                      scale === sc
                        ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {sc}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                {scale === 'lite' && 'লোকালস্টোরেজ অপ্টিমাইজড (~১৫০ শিক্ষার্থী পূর্ণ স্কুলে, < ৪ MB)।'}
                {scale === 'normal' && 'সার্ভার/DB প্রস্তুত প্রোফাইল (~৬৫০ শিক্ষার্থী)।'}
                {scale === 'heavy' && 'স্ট্রেস ও ক্যাপাসিটি টেস্ট (~২,৫০০ শিক্ষার্থী)।'}
              </p>
            </div>

            {/* Seed Value */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Deterministic Seed (RNG)</label>
              <input
                type="number"
                value={seedVal}
                onChange={e => setSeedVal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400">একই seed দিলে সর্বদা একই নাম ও তথ্য তৈরি হবে।</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleRunSeed}
                disabled={isRunning}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition"
              >
                <Database className="w-4 h-4" />
                {isRunning ? 'কাজ চলছে...' : 'ডেমো ডেটা তৈরি করুন (Seed)'}
              </button>

              <button
                onClick={handleRunVerify}
                disabled={isRunning}
                className="w-full py-2.5 px-4 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-bold rounded-xl flex items-center justify-center gap-2 transition text-sm"
              >
                <Shield className="w-4 h-4" />
                সিস্টেম ভেরিফিকেশন চালান (Verify)
              </button>

              <button
                onClick={handleReset}
                disabled={isRunning}
                className="w-full py-2 px-4 bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40 rounded-xl flex items-center justify-center gap-2 transition text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                রিসেট (শুধুমাত্র ডেমো রেকর্ড মুছুন)
              </button>
            </div>
          </div>

          {/* Quick Stats of 9 Schools */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              কভার করা ৯টি স্কুল
            </h3>
            <div className="space-y-2 text-xs">
              {SCHOOL_SPECS.map(s => (
                <div key={s.slug} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/60">
                  <div className="truncate mr-2">
                    <span className="font-semibold text-white">{s.name_bn}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">/{s.slug} • {s.plan} • {s.status}</span>
                  </div>
                  <a
                    href={`/${s.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-slate-400 hover:text-emerald-400 transition"
                    title="পাবলিক সাইট দেখুন"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns: Output, Logs & Inspectors */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-2">
            {[
              { id: 'generator', label: 'লাইভ কনসোল ও লগ', icon: FileText },
              { id: 'verifier', label: 'ভেরিফিকেশন রিপোর্ট', icon: Shield },
              { id: 'credentials', label: 'লগইন ক্রেডেনশিয়াল', icon: Key },
              { id: 'edgecases', label: 'এজ-কেস ক্যাটালগ (৪০টি)', icon: AlertTriangle }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: Console Logs */}
          {activeTab === 'generator' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-slate-400">কনসোল আউটপুট ({logs.length} লাইন)</span>
                <button
                  onClick={() => setLogs([])}
                  className="text-xs text-slate-400 hover:text-slate-200 transition"
                >
                  লগ পরিষ্কার করুন
                </button>
              </div>
              <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-emerald-400 h-96 overflow-y-auto space-y-1 border border-slate-900">
                {logs.length === 0 ? (
                  <span className="text-slate-600">// সিড বা ভেরিফাই চালানোর পর লগ এখানে প্রদর্শিত হবে...</span>
                ) : (
                  logs.map((l, i) => (
                    <div key={i} className="leading-relaxed">{l}</div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Verification Checklist */}
          {activeTab === 'verifier' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  সিস্টেম ভেরিফিকেশন ফলাফল
                </h3>
                {verifyResults && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${verifyResults.pass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {verifyResults.passed} / {verifyResults.total} Passed
                  </span>
                )}
              </div>

              {!verifyResults ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  ভেরিফিকেশন চালাতে বামপাশের "সিস্টেম ভেরিফিকেশন চালান" বাটনে ক্লিক করুন।
                </div>
              ) : (
                <div className="space-y-2">
                  {verifyResults.checks.map((c, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                        c.pass
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                          : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                      }`}
                    >
                      <div>
                        <span className="font-bold block text-sm mb-0.5">{c.name}</span>
                        <span className="text-slate-400">{c.message}</span>
                      </div>
                      <span className="font-bold shrink-0 mt-0.5">
                        {c.pass ? '✅ PASSED' : '❌ FAILED'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Credentials */}
          {activeTab === 'credentials' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                টেস্টিং লগইন তথ্য
              </h3>
              <p className="text-xs text-slate-400">
                সকল রোল ও স্কুল অ্যাডমিনদের ক্রেডেনশিয়াল। বিস্তারিত সংরক্ষিত হয়েছে <code className="text-amber-300">seed-output/credentials.local.md</code>-এ।
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 px-3">স্কুল</th>
                      <th className="py-2 px-3">রোল</th>
                      <th className="py-2 px-3">ইউজারনেম</th>
                      <th className="py-2 px-3">অ্যাডমিন লিঙ্ক</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    <tr className="bg-emerald-950/30">
                      <td className="py-2 px-3 font-semibold text-emerald-300">প্ল্যাটফর্ম ওনার</td>
                      <td className="py-2 px-3 text-slate-400">Owner</td>
                      <td className="py-2 px-3 font-mono text-white">owner / password123</td>
                      <td className="py-2 px-3"><a href="/owner" className="text-emerald-400 underline" target="_blank" rel="noreferrer">প্যানেল</a></td>
                    </tr>
                    {SCHOOL_SPECS.map(s => (
                      <tr key={s.slug} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3 font-medium text-white">{s.name_bn}</td>
                        <td className="py-2 px-3 text-slate-400">Super Admin</td>
                        <td className="py-2 px-3 font-mono text-amber-300">{s.slug}_admin</td>
                        <td className="py-2 px-3">
                          <a href={`/${s.slug}/admin`} className="text-indigo-400 hover:underline" target="_blank" rel="noreferrer">
                            লগইন পেজ
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Edge Cases */}
          {activeTab === 'edgecases' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                এজ-কেস টেস্ট ক্যাটালগ (৪০টি দৃশ্যপট)
              </h3>
              <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
                {EDGE_CASES.map(ec => (
                  <div key={ec.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 text-sm">[{ec.id}] {ec.title}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
                        {ec.module}
                      </span>
                    </div>
                    <p className="text-slate-300">{ec.description}</p>
                    <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800/50">
                      <span className="text-emerald-400 font-semibold">প্রত্যাশিত আচরণ:</span> {ec.expected}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
