import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TenantRepository } from '../../../services/tenantStorage';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/ToastContext';
import { Globe, Palette, Save, CheckCircle2 } from 'lucide-react';

export default function CmsManager() {
  const { school, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const settings = TenantRepository.getSettings(school.id) || {};

  const [themePref, setThemePref] = useState(school.theme || 'emerald');
  const [taglineBn, setTaglineBn] = useState(settings.tagline_bn || '');
  const [mottoBn, setMottoBn] = useState(settings.motto_bn || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [email, setEmail] = useState(settings.email || '');
  const [officeHours, setOfficeHours] = useState(settings.office_hours || '');
  const [uniformRules, setUniformRules] = useState(settings.uniform_rules || '');

  const handleSave = (e) => {
    e.preventDefault();
    try {
      TenantRepository.updateSchool(school.id, { theme: themePref });
      TenantRepository.updateSettings(school.id, {
        tagline_bn: taglineBn,
        motto_bn: mottoBn,
        phone,
        email,
        office_hours: officeHours,
        uniform_rules: uniformRules
      });
      // Save local theme preference for tenant
      localStorage.setItem(`${school.slug}_theme`, themePref);
      showToast('ওয়েবসাইট ও সিএমএস সেটিংস সংরক্ষিত হয়েছে!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">ওয়েবসাইট ও সিএমএস কনফিগারেশন</h2>
        <p className="text-xs text-muted">ব্র্যান্ডিং থিম, মূলমন্ত্র ও প্রাতিষ্ঠানিক তথ্য লাইভ প্রিভিউ সহ পরিবর্তন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form */}
        <div className="lg:col-span-7">
          <Card surface="surface">
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text block mb-1.5">স্কুলের ব্র্যান্ড থিম (Theme)</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setThemePref('emerald')}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      themePref === 'emerald'
                        ? 'border-2 border-emerald-500 bg-emerald-500/10 text-text font-bold'
                        : 'border-border bg-surface-2 text-muted'
                    }`}
                  >
                    <span>Emerald (সবুজ)</span>
                    <span className="w-4 h-4 rounded-full bg-emerald-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setThemePref('indigo')}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      themePref === 'indigo'
                        ? 'border-2 border-indigo bg-indigo-soft text-text font-bold'
                        : 'border-border bg-surface-2 text-muted'
                    }`}
                  >
                    <span>Indigo (নীল)</span>
                    <span className="w-4 h-4 rounded-full bg-indigo" />
                  </button>
                </div>
              </div>

              <Input
                label="স্কুলের ট্যাগলাইন (বাংলা)"
                value={taglineBn}
                onChange={(e) => setTaglineBn(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text">মূলমন্ত্র ও দর্শন (Motto)</label>
                <textarea
                  rows={3}
                  value={mottoBn}
                  onChange={(e) => setMottoBn(e.target.value)}
                  className="w-full rounded-[10px] bg-surface-2 border border-border text-text p-3 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="অফিসিয়াল ফোন নম্বর"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  label="অফিসিয়াল ইমেইল"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Input
                label="অফিস সময়সূচি"
                value={officeHours}
                onChange={(e) => setOfficeHours(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text">পোশাক নীতিমালা (Uniform Code)</label>
                <textarea
                  rows={2}
                  value={uniformRules}
                  onChange={(e) => setUniformRules(e.target.value)}
                  className="w-full rounded-[10px] bg-surface-2 border border-border text-text p-3 text-xs outline-none focus:border-primary"
                />
              </div>

              {!supportMode && (
                <div className="pt-4 border-t border-border flex justify-end">
                  <Button type="submit" variant="primary" icon={Save}>
                    সেভ ও লাইভ আপডেট করুন
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-muted">
            <span>লাইভ প্রিভিউ (পাবলিক সাইটে যেভাবে দেখাবে)</span>
          </div>

          <Card surface="surface" className="p-6 border-2 border-primary/25 space-y-4">
            <div className="text-center space-y-2 pb-4 border-b border-border">
              <Badge variant="primary">থিম: {themePref}</Badge>
              <h3 className="text-xl font-heading font-bold text-text">{school.name_bn}</h3>
              <p className="text-xs font-heading text-primary font-medium italic">"{taglineBn || 'জ্ঞানের আলো'}"</p>
              <p className="text-[11px] text-muted">{mottoBn || 'নৈতিক শিক্ষাই আদর্শ।'}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted">
                <span>ফোন:</span>
                <span className="font-mono text-text">{phone || '—'}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>ইমেইল:</span>
                <span className="font-mono text-text">{email || '—'}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>অফিস সময়:</span>
                <span className="text-text">{officeHours || '—'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
