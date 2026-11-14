import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TenantRepository } from '../../../services/tenantStorage';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/ToastContext';
import { 
  Globe, 
  Palette, 
  Save, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  MapPin, 
  Share2, 
  SlidersHorizontal, 
  Sparkles, 
  Trash2, 
  Plus, 
  ShieldAlert, 
  RotateCcw 
} from 'lucide-react';

export default function CmsManager() {
  const { school, supportMode, currentUser } = useOutletContext();
  const { showToast } = useToast();

  const settings = TenantRepository.getSettings(school.id) || {};
  const currentUniform = TenantRepository.getUniform(school.id) || {
    boys: { shirt: '', pant: '', shoes: '', badge: '', belt: '' },
    girls: { dress: '', salwar: '', orna: '', shoes: '', hair: '' },
    winter: '',
    guidelines: []
  };

  const [activeTab, setActiveTab] = useState('branding'); // 'branding', 'sliders', 'uniform', 'messages', 'about', 'contact', 'reset'

  const [themePref, setThemePref] = useState(school.theme || 'emerald');
  const [taglineBn, setTaglineBn] = useState(settings.tagline_bn || '');
  const [mottoBn, setMottoBn] = useState(settings.motto_bn || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [phoneAlt, setPhoneAlt] = useState(settings.phone_alt || '');
  const [email, setEmail] = useState(settings.email || '');
  const [officeHours, setOfficeHours] = useState(settings.office_hours || '');
  
  // Uniform
  const [uniformData, setUniformData] = useState(currentUniform);

  // Sliders
  const [sliders, setSliders] = useState(TenantRepository.getSliders(school.id));
  const [newSlide, setNewSlide] = useState({ title: '', subtitle: '', image: '', tag: 'নতুন' });

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

  // Factory Reset
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetConfirmCode, setResetConfirmCode] = useState('');

  const handleAddSlide = () => {
    if (!newSlide.title || !newSlide.image) {
      showToast('স্লাইডের শিরোনাম ও ছবির লিংক দেওয়া আবশ্যক', 'error');
      return;
    }
    const updated = [...sliders, { id: `sl_${Date.now()}`, ...newSlide }];
    setSliders(updated);
    TenantRepository.updateSliders(school.id, updated);
    setNewSlide({ title: '', subtitle: '', image: '', tag: 'নতুন' });
    showToast('নতুন স্লাইড যুক্ত করা হয়েছে!');
  };

  const handleDeleteSlide = (slideId) => {
    const updated = sliders.filter(s => s.id !== slideId);
    setSliders(updated);
    TenantRepository.updateSliders(school.id, updated);
    showToast('স্লাইড মুছে ফেলা হয়েছে।');
  };

  const handleFactoryReset = () => {
    if (resetConfirmCode !== 'RESET') {
      showToast('রিসেট করতে "RESET" টাইপ করুন', 'error');
      return;
    }
    try {
      TenantRepository.factoryResetSchool(school.id, 'RESET');
      showToast('স্কুল ডেটা সফলভাবে রিসেট করা হয়েছে!');
      setResetModalOpen(false);
      window.location.reload();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

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
      TenantRepository.updateUniform(school.id, uniformData);
      TenantRepository.updateSliders(school.id, sliders);
      // Save local theme preference for tenant
      localStorage.setItem(`${school.slug}_theme`, themePref);
      showToast('ওয়েবসাইট ও সিএমএস সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err) {
      showToast(err.message || 'সেটিংস সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">ওয়েবসাইট ও সিএমএস কনফিগারেশন</h2>
        <p className="text-xs text-muted">ব্র্যান্ডিং, স্লাইডার, পোশাক নীতিমালা, বাণী, ইতিহাস ও প্রাতিষ্ঠানিক তথ্য ডায়নামিক ম্যানেজমেন্ট</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
        {[
          { key: 'branding', label: 'ব্র্যান্ডিং ও মূলমন্ত্র', icon: Palette },
          { key: 'sliders', label: 'হিরো স্লাইডার', icon: SlidersHorizontal },
          { key: 'uniform', label: 'পোশাক নীতিমালা', icon: Sparkles },
          { key: 'messages', label: 'প্রধান শিক্ষক ও সভাপতির বাণী', icon: Award },
          { key: 'about', label: 'ইতিহাস, ভিশন ও মিশন', icon: BookOpen },
          { key: 'contact', label: 'যোগাযোগ ও সোশ্যাল মিডিয়া', icon: MapPin },
          ...(currentUser?.role === 'school_superadmin' ? [{ key: 'reset', label: 'ফ্যাক্টরি রিসেট', icon: RotateCcw }] : [])
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
          <Card surface="surface" className="p-6 space-y-5 animate-fade-in">
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
          </Card>
        )}

        {/* TAB 2: HERO SLIDERS */}
        {activeTab === 'sliders' && (
          <div className="space-y-6 animate-fade-in">
            <Card surface="surface" className="p-6 space-y-4">
              <span className="text-xs font-mono font-bold text-primary uppercase">বিদ্যমান হিরো স্লাইডসমূহ ({sliders.length}টি)</span>
              <div className="space-y-3">
                {sliders.map((s, idx) => (
                  <div key={s.id || idx} className="p-4 rounded-xl bg-surface-2 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={s.image} alt={s.title} className="w-16 h-12 rounded-lg object-cover border border-border shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text">{s.title}</span>
                          {s.tag && <Badge variant="primary" size="sm">{s.tag}</Badge>}
                        </div>
                        <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{s.subtitle}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(s.id)}
                      className="p-1.5 rounded-lg text-danger hover:bg-danger-soft transition-colors cursor-pointer shrink-0"
                      title="স্লাইড মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card surface="surface" className="p-6 space-y-4 border-2 border-dashed border-border">
              <span className="text-xs font-mono font-bold text-accent uppercase">+ নতুন স্লাইড যোগ করুন</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="স্লাইড শিরোনাম"
                  placeholder="e.g. জ্ঞান ও আদর্শের বিদ্যাপীঠ"
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                />
                <Input
                  label="ট্যাগ ব্যাজ (যেমন: ভর্তি চলছে / স্বাগতম)"
                  placeholder="e.g. স্বাগতম"
                  value={newSlide.tag}
                  onChange={(e) => setNewSlide({ ...newSlide, tag: e.target.value })}
                />
              </div>
              <Input
                label="ছবির URL"
                placeholder="https://images.unsplash.com/..."
                value={newSlide.image}
                onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
              />
              <Input
                label="উপ-শিরোনাম বা সংক্ষিপ্ত বিবরণ"
                placeholder="e.g. গুণগত শিক্ষা ও নৈতিকতার মেলবন্ধন..."
                value={newSlide.subtitle}
                onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
              />
              <div className="flex justify-end pt-2">
                <Button type="button" variant="secondary" icon={Plus} onClick={handleAddSlide}>
                  স্লাইড তালিকায় যুক্ত করুন
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: UNIFORM DRESS CODE */}
        {activeTab === 'uniform' && (
          <div className="space-y-6 animate-fade-in">
            <Card surface="surface" className="p-6 space-y-4 border-t-4 border-t-primary">
              <span className="text-xs font-mono font-bold text-primary uppercase">ছাত্রদের পোশাক নীতিমালা (Boys)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="শার্ট"
                  value={uniformData?.boys?.shirt || ''}
                  onChange={(e) => setUniformData({
                    ...uniformData,
                    boys: { ...uniformData.boys, shirt: e.target.value }
                  })}
                />
                <Input
                  label="প্যান্ট"
                  value={uniformData?.boys?.pant || ''}
                  onChange={(e) => setUniformData({
                    ...uniformData,
                    boys: { ...uniformData.boys, pant: e.target.value }
                  })}
                />
                <Input
                  label="জুতো ও মোজা"
                  value={uniformData?.boys?.shoes || ''}
                  onChange={(e) => setUniformData({
                    ...uniformData,
                    boys: { ...uniformData.boys, shoes: e.target.value }
                  })}
                />
                <Input
                  label="প্রাতিষ্ঠানিক ব্যাজ"
                  value={uniformData?.boys?.badge || ''}
                  onChange={(e) => setUniformData({
                    ...uniformData,
                    boys: { ...uniformData.boys, badge: e.target.value }
                  })}
                />
              </div>
            </Card>

            <Card surface="surface" className="p-6 space-y-4 border-t-4 border-t-accent">
              <span className="text-xs font-mono font-bold text-accent uppercase">ছাত্রীদের পোশাক নীতিমালা (Girls)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="ফ্রক / কামিজ"
                  value={uniformData?.girls?.dress || ''}
                  onChange={(e) => setUniformData({
                    ...uniformData,
                    girls: { ...uniformData.girls, dress: e.target.value }
                  })}
                />
                <Input
                  label="পায়জামা / সালোয়ার"
                  value={uniformData?.girls?.salwar || ''}
                  onChange={(e) => setUniformData({
                    ...uniformData,
                    girls: { ...uniformData.girls, salwar: e.target.value }
                  })}
                />
                <Input
                  label="ওড়না ও ফিতা"
                  value={uniformData?.girls?.orna || ''}
                  onChange={(e) => setUniformData({
                    ...uniformData,
                    girls: { ...uniformData.girls, orna: e.target.value }
                  })}
                />
                <Input
                  label="জুতো ও মোজা"
                  value={uniformData?.girls?.shoes || ''}
                  onChange={(e) => setUniformData({
                    ...uniformData,
                    girls: { ...uniformData.girls, shoes: e.target.value }
                  })}
                />
              </div>
            </Card>

            <Card surface="surface" className="p-6 space-y-4">
              <span className="text-xs font-mono font-bold text-text uppercase">শীতকালীন পোশাক ও সাধারণ নির্দেশিকা</span>
              <Input
                label="শীতকালীন পোশাকের বিবরণ"
                value={uniformData?.winter || ''}
                onChange={(e) => setUniformData({
                  ...uniformData,
                  winter: e.target.value
                })}
              />
            </Card>
          </div>
        )}

        {/* TAB 4: SPEECHES & MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-fade-in">
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

        {/* TAB 5: ABOUT, HISTORY & VISION */}
        {activeTab === 'about' && (
          <Card surface="surface" className="p-6 space-y-5 animate-fade-in">
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

        {/* TAB 6: CONTACT & SOCIAL */}
        {activeTab === 'contact' && (
          <Card surface="surface" className="p-6 space-y-4 animate-fade-in">
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

        {/* TAB 7: FACTORY RESET (SUPER ADMIN ONLY) */}
        {activeTab === 'reset' && currentUser?.role === 'school_superadmin' && (
          <Card surface="surface" className="p-6 space-y-4 border-2 border-danger/40 animate-fade-in">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-8 h-8 text-danger shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-danger">স্কুল ফ্যাক্টরি রিসেট (সুপার অ্যাডমিন জোন)</h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  ফ্যাক্টরি রিসেট করলে শুধুমাত্র <strong>{school.name_bn}</strong>-এর সমস্ত ছাত্র-ছাত্রী, ফলাফল, ফি রসিদ, নোটিশ এবং কন্টেন্ট ডিফল্ট টেমপ্লেটে ফিরে যাবে। প্ল্যাটফর্মের অন্য কোনো স্কুলের কোনো তথ্য ক্ষতিগ্রস্ত হবে না।
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <Button type="button" variant="danger" icon={RotateCcw} onClick={() => setResetModalOpen(true)}>
                ফ্যাক্টরি রিসেট উইন্ডো খুলুন
              </Button>
            </div>
          </Card>
        )}

        {/* Action Button */}
        {!supportMode && activeTab !== 'reset' && (
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="lg" icon={Save}>
              সকল পরিবর্তন সংরক্ষণ ও লাইভ আপডেট করুন
            </Button>
          </div>
        )}
      </form>

      {/* Factory Reset Modal */}
      {resetModalOpen && (
        <Modal
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
          title="সতর্কতা: ফ্যাক্টরি রিসেট নিশ্চিতকরণ"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-danger font-semibold leading-relaxed">
              আপনি কি নিশ্চিত যে আপনি {school.name_bn}-এর সমস্ত ডেটা ফ্যাক্টরি রিসেট করতে চান? এই প্রক্রিয়াটি অপরিবর্তনীয়।
            </p>
            <div>
              <label className="text-text font-medium block mb-1">নিশ্চিত করতে নিচে <strong>RESET</strong> লিখুন:</label>
              <Input
                placeholder="RESET"
                value={resetConfirmCode}
                onChange={(e) => setResetConfirmCode(e.target.value)}
              />
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="secondary" size="sm" onClick={() => setResetModalOpen(false)}>
                বাতিল করুন
              </Button>
              <Button variant="danger" size="sm" icon={RotateCcw} onClick={handleFactoryReset}>
                চূড়ান্ত রিসেট সম্পন্ন করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
