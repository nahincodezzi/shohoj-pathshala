import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TenantRepository } from '../../../services/tenantStorage';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/ToastContext';
import { Globe, Palette, Save, CheckCircle2, Award, BookOpen, MapPin, Share2 } from 'lucide-react';

export default function CmsManager() {
  const { school, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const settings = TenantRepository.getSettings(school.id) || {};

  const [activeTab, setActiveTab] = useState('branding'); // 'branding', 'messages', 'about', 'contact'

  const [themePref, setThemePref] = useState(school.theme || 'emerald');
  const [taglineBn, setTaglineBn] = useState(settings.tagline_bn || '');
  const [mottoBn, setMottoBn] = useState(settings.motto_bn || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [phoneAlt, setPhoneAlt] = useState(settings.phone_alt || '');
  const [email, setEmail] = useState(settings.email || '');
  const [officeHours, setOfficeHours] = useState(settings.office_hours || '');
  const [uniformRules, setUniformRules] = useState(settings.uniform_rules || '');
  
  // Headmaster & Chairman
  const [headmasterName, setHeadmasterName] = useState(settings.headmaster_name || '');
  const [headmasterDesignation, setHeadmasterDesignation] = useState(settings.headmaster_designation || '');
  const [headmasterMessage, setHeadmasterMessage] = useState(settings.headmaster_message || '');
  const [chairmanName, setChairmanName] = useState(settings.chairman_name || '');
  const [chairmanDesignation, setChairmanDesignation] = useState(settings.chairman_designation || '');
  const [chairmanMessage, setChairmanMessage] = useState(settings.chairman_message || '');

  // History & Vision
  const [historyBn, setHistoryBn] = useState(settings.history_bn || '');
  const [visionBn, setVisionBn] = useState(settings.vision_bn || '');
  const [missionBn, setMissionBn] = useState(settings.mission_bn || '');

  // Social & Maps
  const [facebookUrl, setFacebookUrl] = useState(settings.facebook_url || '');
  const [mapEmbedUrl, setMapEmbedUrl] = useState(settings.map_embed_url || '');

  const handleSave = (e) => {
    e.preventDefault();
    try {
      TenantRepository.updateSchool(school.id, { theme: themePref });
      TenantRepository.updateSettings(school.id, {
        tagline_bn: taglineBn,
        motto_bn: mottoBn,
        phone,
        phone_alt: phoneAlt,
        email,
        office_hours: officeHours,
        uniform_rules: uniformRules,
        headmaster_name: headmasterName,
        headmaster_designation: headmasterDesignation,
        headmaster_message: headmasterMessage,
        chairman_name: chairmanName,
        chairman_designation: chairmanDesignation,
        chairman_message: chairmanMessage,
        history_bn: historyBn,
        vision_bn: visionBn,
        mission_bn: missionBn,
        facebook_url: facebookUrl,
        map_embed_url: mapEmbedUrl
      });
      // Save local theme preference for tenant
      localStorage.setItem(`${school.slug}_theme`, themePref);
      showToast('ওয়েবসাইট ও সিএমএস সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">ওয়েবসাইট ও সিএমএস কনফিগারেশন</h2>
        <p className="text-xs text-muted">ব্র্যান্ডিং, প্রধান শিক্ষকের বাণী, ইতিহাস ও প্রাতিষ্ঠানিক তথ্য পরিবর্তন</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
        {[
          { key: 'branding', label: 'ব্র্যান্ডিং ও মূলমন্ত্র', icon: Palette },
          { key: 'messages', label: 'প্রধান শিক্ষক ও সভাপতির বাণী', icon: Award },
          { key: 'about', label: 'ইতিহাস, ভিশন ও মিশন', icon: BookOpen },
          { key: 'contact', label: 'যোগাযোগ ও সোশ্যাল মিডিয়া', icon: MapPin }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: BRANDING & THEME */}
        {activeTab === 'branding' && (
          <Card surface="surface" className="p-6 space-y-5">
            <div>
              <label className="text-xs font-medium text-text block mb-2">স্কুলের কালার থিম (Theme)</label>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <button
                  type="button"
                  onClick={() => setThemePref('emerald')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    themePref === 'emerald'
                      ? 'border-2 border-primary bg-primary-soft text-text font-bold'
                      : 'border-border bg-surface-2 text-muted'
                  }`}
                >
                  <span>Emerald (সবুজ)</span>
                  <span className="w-4 h-4 rounded-full bg-emerald-600" />
                </button>

                <button
                  type="button"
                  onClick={() => setThemePref('indigo')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
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
              label="স্কুলের মূল ট্যাগলাইন (বাংলা)"
              value={taglineBn}
              onChange={(e) => setTaglineBn(e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">মূলমন্ত্র ও দর্শন (Motto):</label>
              <textarea
                rows={3}
                value={mottoBn}
                onChange={(e) => setMottoBn(e.target.value)}
                className="w-full rounded-[10px] bg-surface-2 border border-border text-text p-3 text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">পোশাক নীতিমালা সারসংক্ষেপ:</label>
              <textarea
                rows={2}
                value={uniformRules}
                onChange={(e) => setUniformRules(e.target.value)}
                className="w-full rounded-[10px] bg-surface-2 border border-border text-text p-3 text-xs outline-none focus:border-primary"
              />
            </div>
          </Card>
        )}

        {/* TAB 2: SPEECHES & MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <Card surface="surface" className="p-6 space-y-4">
              <span className="text-xs font-mono font-bold text-primary uppercase">প্রধান শিক্ষকের তথ্য ও বাণী</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="প্রধান শিক্ষকের নাম"
                  value={headmasterName}
                  onChange={(e) => setHeadmasterName(e.target.value)}
                />
                <Input
                  label="পদবী"
                  value={headmasterDesignation}
                  onChange={(e) => setHeadmasterDesignation(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text">প্রধান শিক্ষকের প্রাতিষ্ঠানিক বাণী:</label>
                <textarea
                  rows={5}
                  value={headmasterMessage}
                  onChange={(e) => setHeadmasterMessage(e.target.value)}
                  className="w-full rounded-[10px] bg-surface-2 border border-border text-text p-3 text-xs outline-none focus:border-primary leading-relaxed"
                />
              </div>
            </Card>

            <Card surface="surface" className="p-6 space-y-4">
              <span className="text-xs font-mono font-bold text-indigo uppercase">পরিচালনা পর্ষদের সভাপতির তথ্য ও বাণী</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="সভাপতির নাম"
                  value={chairmanName}
                  onChange={(e) => setChairmanName(e.target.value)}
                />
                <Input
                  label="পদবী"
                  value={chairmanDesignation}
                  onChange={(e) => setChairmanDesignation(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text">সভাপতির উদ্বোধনী বাণী:</label>
                <textarea
                  rows={4}
                  value={chairmanMessage}
                  onChange={(e) => setChairmanMessage(e.target.value)}
                  className="w-full rounded-[10px] bg-surface-2 border border-border text-text p-3 text-xs outline-none focus:border-primary leading-relaxed"
                />
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: ABOUT, HISTORY & VISION */}
        {activeTab === 'about' && (
          <Card surface="surface" className="p-6 space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">বিদ্যালয়ের ইতিহাস ও পটভূমি:</label>
              <textarea
                rows={5}
                value={historyBn}
                onChange={(e) => setHistoryBn(e.target.value)}
                className="w-full rounded-[10px] bg-surface-2 border border-border text-text p-3 text-xs outline-none focus:border-primary leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text">আমাদের ভিশন (Vision):</label>
                <textarea
                  rows={4}
                  value={visionBn}
                  onChange={(e) => setVisionBn(e.target.value)}
                  className="w-full rounded-[10px] bg-surface-2 border border-border text-text p-3 text-xs outline-none focus:border-primary leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text">আমাদের মিশন (Mission):</label>
                <textarea
                  rows={4}
                  value={missionBn}
                  onChange={(e) => setMissionBn(e.target.value)}
                  className="w-full rounded-[10px] bg-surface-2 border border-border text-text p-3 text-xs outline-none focus:border-primary leading-relaxed"
                />
              </div>
            </div>
          </Card>
        )}

        {/* TAB 4: CONTACT & SOCIAL */}
        {activeTab === 'contact' && (
          <Card surface="surface" className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="অফিসিয়াল প্রধান ফোন"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label="বিকল্প ফোন / হেল্পলাইন"
                value={phoneAlt}
                onChange={(e) => setPhoneAlt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="অফিসিয়াল ইমেইল"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="অফিস সময়সূচি"
                value={officeHours}
                onChange={(e) => setOfficeHours(e.target.value)}
              />
            </div>

            <Input
              label="ফেসবুক পেজ / গ্রুপের লিঙ্ক"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/groups/..."
            />

            <Input
              label="গুগল ম্যাপস এমবেড লিঙ্ক (Google Maps Embed URL)"
              value={mapEmbedUrl}
              onChange={(e) => setMapEmbedUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </Card>
        )}

        {/* Action Button */}
        {!supportMode && (
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="lg" icon={Save}>
              সকল পরিবর্তন সংরক্ষণ ও লাইভ আপডেট করুন
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
