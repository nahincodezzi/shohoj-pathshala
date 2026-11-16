import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TenantRepository } from '../../../services/tenantStorage';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import FileUpload from '../../../components/ui/FileUpload';
import Modal from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/ToastContext';
import { 
  Settings, 
  Building2, 
  Palette, 
  Award, 
  MapPin, 
  Share2, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  Calendar,
  ShieldAlert,
  Globe
} from 'lucide-react';

export default function SchoolSettings() {
  const { school, supportMode, currentUser } = useOutletContext();
  const { showToast } = useToast();

  const settings = TenantRepository.getSettings(school.id) || {};

  // Form State: School Identity & Official Codes
  const [nameBn, setNameBn] = useState(school.name_bn || '');
  const [nameEn, setNameEn] = useState(school.name_en || '');
  const [nameAlt, setNameAlt] = useState(school.name_alt || school.name_en || '');
  const [eiin, setEiin] = useState(school.eiin || '');
  const [schoolCode, setSchoolCode] = useState(school.school_code || '');
  const [mpoCode, setMpoCode] = useState(school.mpo_code || '');
  const [board, setBoard] = useState(school.board || 'কুমিল্লা');
  const [district, setDistrict] = useState(school.district || '');
  const [established, setEstablished] = useState(settings.established || '১৯৯০');
  const [admissionYear, setAdmissionYear] = useState(settings.admission_year || '২০২৭');

  // Form State: Branding & Theme
  const [themePref, setThemePref] = useState(school.theme || 'emerald');
  const [logo, setLogo] = useState(school.logo || school.logo_url || settings.logo || '');
  const [taglineBn, setTaglineBn] = useState(settings.tagline_bn || '');
  const [mottoBn, setMottoBn] = useState(settings.motto_bn || '');

  // Form State: Institutional Leadership & Speeches
  const [headmasterName, setHeadmasterName] = useState(settings.headmaster_name || '');
  const [headmasterDesignation, setHeadmasterDesignation] = useState(settings.headmaster_designation || 'প্রধান শিক্ষক');
  const [headmasterPhoto, setHeadmasterPhoto] = useState(settings.headmaster_photo || '');
  const [headmasterMessage, setHeadmasterMessage] = useState(settings.headmaster_message || '');

  const [chairmanName, setChairmanName] = useState(settings.chairman_name || '');
  const [chairmanDesignation, setChairmanDesignation] = useState(settings.chairman_designation || 'সভাপতি, পরিচালনা পর্ষদ');
  const [chairmanPhoto, setChairmanPhoto] = useState(settings.chairman_photo || '');
  const [chairmanMessage, setChairmanMessage] = useState(settings.chairman_message || '');

  // Form State: Contact & Social
  const [addressBn, setAddressBn] = useState(settings.address_bn || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [phoneAlt, setPhoneAlt] = useState(settings.phone_alt || '');
  const [email, setEmail] = useState(settings.email || '');
  const [officeHours, setOfficeHours] = useState(settings.office_hours || '');
  const [facebookUrl, setFacebookUrl] = useState(settings.facebook_url || '');
  const [facebookGroupId, setFacebookGroupId] = useState(settings.facebook_group_id || '');
  const [mapEmbedUrl, setMapEmbedUrl] = useState(settings.map_embed_url || '');

  // Factory Reset State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetCode, setResetCode] = useState('');

  const boardOptions = [
    { value: 'কুমিল্লা', label: 'কুমিল্লা শিক্ষা বোর্ড' },
    { value: 'ঢাকা', label: 'ঢাকা শিক্ষা বোর্ড' },
    { value: 'চট্টগ্রাম', label: 'চট্টগ্রাম শিক্ষা বোর্ড' },
    { value: 'রাজশাহী', label: 'রাজশাহী শিক্ষা বোর্ড' },
    { value: 'যশোর', label: 'যশোর শিক্ষা বোর্ড' },
    { value: 'বরিশাল', label: 'বরিশাল শিক্ষা বোর্ড' },
    { value: 'সিলেট', label: 'সিলেট শিক্ষা বোর্ড' },
    { value: 'দিনাজপুর', label: 'দিনাজপুর শিক্ষা বোর্ড' },
    { value: 'ময়মনসিংহ', label: 'ময়মনসিংহ শিক্ষা বোর্ড' },
    { value: 'মাদ্রাসা', label: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড' },
    { value: 'কারিগরি', label: 'বাংলাদেশ কারিগরি শিক্ষা বোর্ড' }
  ];

  const handleSaveAll = (e) => {
    if (e) e.preventDefault();
    if (supportMode) {
      showToast('সাপোর্ট মোডে কোনো পরিবর্তন সংরক্ষণ করা যাবে না', 'error');
      return;
    }

    try {
      // 1. Update Core School Record in Multi-tenant Database
      TenantRepository.updateSchool(school.id, {
        name_bn: nameBn.trim(),
        name_en: nameEn.trim(),
        name_alt: nameAlt.trim(),
        eiin: eiin.trim(),
        school_code: schoolCode.trim(),
        mpo_code: mpoCode.trim(),
        board,
        district: district.trim(),
        theme: themePref,
        logo: logo || school.logo || '/favicon.svg',
        logo_url: logo || school.logo_url || '/favicon.svg'
      });

      // 2. Update School Extended Settings
      TenantRepository.updateSettings(school.id, {
        logo: logo || school.logo || '/favicon.svg',
        established: established.trim(),
        admission_year: admissionYear.trim(),
        tagline_bn: taglineBn.trim(),
        motto_bn: mottoBn.trim(),
        headmaster_name: headmasterName.trim(),
        headmaster_designation: headmasterDesignation.trim(),
        headmaster_photo: headmasterPhoto,
        headmaster_message: headmasterMessage.trim(),
        chairman_name: chairmanName.trim(),
        chairman_designation: chairmanDesignation.trim(),
        chairman_photo: chairmanPhoto,
        chairman_message: chairmanMessage.trim(),
        address_bn: addressBn.trim(),
        phone: phone.trim(),
        phone_alt: phoneAlt.trim(),
        email: email.trim(),
        office_hours: officeHours.trim(),
        facebook_url: facebookUrl.trim(),
        facebook_group_url: facebookUrl.trim(),
        facebook_group_id: facebookGroupId.trim(),
        map_embed_url: mapEmbedUrl.trim()
      });

      // 3. Save Theme Preference for Tenant
      localStorage.setItem(`${school.slug}_theme`, themePref);

      showToast('স্কুলের সাধারণ সেটিংস ও পরিচিতি সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err) {
      showToast(err.message || 'সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleFactoryReset = () => {
    if (resetCode !== 'RESET') {
      showToast('রিসেট করতে "RESET" টাইপ করুন', 'error');
      return;
    }
    try {
      TenantRepository.factoryResetSchool(school.id, 'RESET');
      showToast('স্কুলের সমস্ত ডেটা সফলভাবে ফ্যাক্টরি ডিফল্টে ফিরিয়ে নেওয়া হয়েছে!');
      setResetModalOpen(false);
      window.location.reload();
    } catch (err) {
      showToast(err.message || 'ফ্যাক্টরি রিসেট ব্যর্থ হয়েছে', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">সাধারণ সেটিংস ও স্কুলের মূল পরিচয়</h2>
          </div>
          <p className="text-xs text-muted mt-1">
            বিদ্যালয়ের নাম, সরকারি কোড, লোগো, থিম কালার, প্রধান শিক্ষক ও সভাপতির বার্তা এবং যোগাযোগের সম্পূর্ণ কন্ট্রোল প্যানেল
          </p>
        </div>

        {!supportMode && (
          <Button
            variant="primary"
            size="md"
            icon={Save}
            onClick={handleSaveAll}
          >
            সকল পরিবর্তন সংরক্ষণ করুন
          </Button>
        )}
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* ================= 1. BASIC IDENTITY & GOVERNMENT CODES ================= */}
        <Card surface="surface" className="p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Building2 className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-heading font-bold text-text">১. প্রাতিষ্ঠানিক পরিচয় ও সরকারি কোড</h3>
              <p className="text-[11px] text-muted">হেডার, ফুটার, মার্কশিট, প্রশংসাপত্র ও আইডি কার্ডে এই তথ্যগুলো স্বয়ংক্রিয়ভাবে বসবে</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="বিদ্যালয়ের নাম (বাংলা) *"
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              placeholder="e.g. বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়"
              required
            />
            <Input
              label="বিদ্যালয়ের নাম (ইংরেজি) *"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Bondua Daulatpur High School"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="বিকল্প ইংরেজি নাম (nameAlt)"
              value={nameAlt}
              onChange={(e) => setNameAlt(e.target.value)}
              placeholder="e.g. BDHS High School"
            />
            <Input
              label="EIIN নম্বর *"
              value={eiin}
              onChange={(e) => setEiin(e.target.value)}
              placeholder="e.g. 106644"
              required
            />
            <Input
              label="স্কুল কোড (School Code)"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
              placeholder="e.g. 4320"
            />
            <Input
              label="MPO কোড"
              value={mpoCode}
              onChange={(e) => setMpoCode(e.target.value)}
              placeholder="e.g. 0905171301"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="মাধ্যমিক শিক্ষা বোর্ড"
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              options={boardOptions}
            />
            <Input
              label="জেলা / উপজেলা"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. ফেনী"
            />
            <Input
              label="প্রতিষ্ঠা সাল"
              value={established}
              onChange={(e) => setEstablished(e.target.value)}
              placeholder="e.g. ১৯৯০"
            />
            <Input
              label="ভর্তি শিক্ষাবর্ষ (admissionYear)"
              value={admissionYear}
              onChange={(e) => setAdmissionYear(e.target.value)}
              placeholder="e.g. ২০২৭"
            />
          </div>
        </Card>

        {/* ================= 2. BRANDING, LOGO & THEME COLOR ================= */}
        <Card surface="surface" className="p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Palette className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-heading font-bold text-text">২. ব্র্যান্ডিং, মনোগ্রাম ও কালার থিম</h3>
              <p className="text-[11px] text-muted">এক ক্লিকে পুরো বিদ্যালয়ের ওয়েবসাইটের ব্র্যান্ড কালার ও অফিশিয়াল লোগো পরিবর্তন</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-2 border border-border flex flex-col sm:flex-row items-center gap-6">
            <div className="shrink-0 text-center">
              <FileUpload
                label="স্কুলের অফিসিয়াল লোগো (Monogram)"
                helperText="1:1 স্কয়ার অনুপাত (স্বয়ংক্রিয় ক্রপ ও কম্প্রেস)"
                type="image"
                aspectRatio="square"
                circular
                value={logo}
                onChange={(val) => setLogo(val)}
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <h4 className="text-sm font-bold text-text">বিদ্যালয়ের কেন্দ্রীয় অফিশিয়াল মনোগ্রাম</h4>
              <p className="text-xs text-muted max-w-xl leading-relaxed">
                এখানে একবার লোগো আপলোড করলে হেডারের মনোগ্রাম, ফুটার, স্টুডেন্ট আইডি কার্ড, রেজাল্ট মার্কশিট এবং মানি রিসিটে স্বয়ংক্রিয়ভাবে লোগোটি বসে যাবে।
              </p>
              {logo && (
                <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary-soft px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> লোগো আপলোড করা রয়েছে
                  </span>
                  <button
                    type="button"
                    onClick={() => setLogo('')}
                    className="text-[11px] text-danger hover:underline cursor-pointer"
                  >
                    মুছে ফেলুন
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text block mb-2">স্কুলের থিম কালার (Theme Palette)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              <button
                type="button"
                onClick={() => setThemePref('emerald')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  themePref === 'emerald'
                    ? 'border-2 border-primary bg-primary-soft text-text font-bold shadow-sm'
                    : 'border-border bg-surface-2 text-muted hover:border-border-strong'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 shrink-0 shadow-xs" />
                  <div className="text-left">
                    <div className="text-xs font-bold">Emerald (সবুজ)</div>
                    <div className="text-[10px] text-muted">প্রাকৃতিক ও ঐতিহ্যবাহী লুক</div>
                  </div>
                </div>
                {themePref === 'emerald' && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </button>

              <button
                type="button"
                onClick={() => setThemePref('indigo')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  themePref === 'indigo'
                    ? 'border-2 border-indigo bg-indigo-soft text-text font-bold shadow-sm'
                    : 'border-border bg-surface-2 text-muted hover:border-border-strong'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo shrink-0 shadow-xs" />
                  <div className="text-left">
                    <div className="text-xs font-bold">Indigo (নীল)</div>
                    <div className="text-[10px] text-muted">আধুনিক ও প্রফেশনাল লুক</div>
                  </div>
                </div>
                {themePref === 'indigo' && <CheckCircle2 className="w-4 h-4 text-indigo" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="স্কুলের মূল ট্যাগলাইন (Tagline)"
              value={taglineBn}
              onChange={(e) => setTaglineBn(e.target.value)}
              placeholder="e.g. জ্ঞানই আলো, শিক্ষাই শক্তি"
            />
            <Input
              label="মূল দর্শন ও নীতিবাক্য (Motto)"
              value={mottoBn}
              onChange={(e) => setMottoBn(e.target.value)}
              placeholder="e.g. নৈতিক শিক্ষা ও আধুনিক প্রযুক্তির সমন্বয়ে ভবিষ্যৎ বিনির্মাণ।"
            />
          </div>
        </Card>

        {/* ================= 3. INSTITUTIONAL LEADERSHIP & MESSAGES ================= */}
        <Card surface="surface" className="p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Award className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-heading font-bold text-text">৩. প্রধান শিক্ষক ও সভাপতির বার্তা (Leadership Messages)</h3>
              <p className="text-[11px] text-muted">হোমপেজের 'প্রতিষ্ঠান প্রধানের বাণী' ও 'সভাপতির বার্তা' সেকশন এখান থেকে নিয়ন্ত্রিত হয়</p>
            </div>
          </div>

          {/* Headmaster Message Box */}
          <div className="p-5 rounded-2xl bg-surface-2 border border-border space-y-4">
            <h4 className="text-xs font-heading font-bold text-primary uppercase tracking-wider">প্রধান শিক্ষকের তথ্য ও বাণী</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="প্রধান শিক্ষকের নাম"
                value={headmasterName}
                onChange={(e) => setHeadmasterName(e.target.value)}
                placeholder="e.g. জনাব বাহার উদ্দিন ভূঁইয়া"
              />
              <Input
                label="পদবি"
                value={headmasterDesignation}
                onChange={(e) => setHeadmasterDesignation(e.target.value)}
                placeholder="e.g. ভারপ্রাপ্ত প্রধান শিক্ষক"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="shrink-0 w-36">
                <FileUpload
                  label="প্রধান শিক্ষকের ছবি"
                  helperText="পাসপোর্ট সাইজ / স্কয়ার ছবি"
                  type="image"
                  aspectRatio="square"
                  value={headmasterPhoto}
                  onChange={(val) => setHeadmasterPhoto(val)}
                />
              </div>
              <div className="flex-1 w-full space-y-1.5">
                <label className="text-xs font-semibold text-text">প্রধান শিক্ষকের পূর্ণাঙ্গ বার্তা / বক্তব্য</label>
                <textarea
                  rows={4}
                  value={headmasterMessage}
                  onChange={(e) => setHeadmasterMessage(e.target.value)}
                  placeholder="বিদ্যালয়ের ইতিহাস, লক্ষ্য, শিক্ষার্থীদের ভবিষ্যৎ ও দিকনির্দেশনামূলক বাণী লিখুন..."
                  className="w-full rounded-xl border border-border bg-surface p-3 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Chairman Message Box */}
          <div className="p-5 rounded-2xl bg-surface-2 border border-border space-y-4">
            <h4 className="text-xs font-heading font-bold text-indigo uppercase tracking-wider">সভাপতির তথ্য ও বার্তা</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="সভাপতির নাম"
                value={chairmanName}
                onChange={(e) => setChairmanName(e.target.value)}
                placeholder="e.g. আলহাজ্ব মো. মজিবুর রহমান"
              />
              <Input
                label="পদবি"
                value={chairmanDesignation}
                onChange={(e) => setChairmanDesignation(e.target.value)}
                placeholder="e.g. সভাপতি, পরিচালনা পর্ষদ"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="shrink-0 w-36">
                <FileUpload
                  label="সভাপতির ছবি"
                  helperText="পাসপোর্ট সাইজ / স্কয়ার ছবি"
                  type="image"
                  aspectRatio="square"
                  value={chairmanPhoto}
                  onChange={(val) => setChairmanPhoto(val)}
                />
              </div>
              <div className="flex-1 w-full space-y-1.5">
                <label className="text-xs font-semibold text-text">পরিচালনা পর্ষদ সভাপতির বার্তা</label>
                <textarea
                  rows={4}
                  value={chairmanMessage}
                  onChange={(e) => setChairmanMessage(e.target.value)}
                  placeholder="পরিচালনা পর্ষদের পক্ষ থেকে শুভেচ্ছা বাণী ও অঙ্গীকার লিখুন..."
                  className="w-full rounded-xl border border-border bg-surface p-3 text-xs text-text focus:outline-none focus:ring-2 focus:ring-indigo/40"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ================= 4. CONTACT & SOCIAL MEDIA HUB ================= */}
        <Card surface="surface" className="p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-heading font-bold text-text">৪. যোগাযোগ, ফেসবুক গ্রুপ ও মিডিয়া কানেকশন</h3>
              <p className="text-[11px] text-muted">কন্টাক্ট সেকশন, হেডার, ফুটার ও ফেসবুক মিডিয়া হাবের যাবতীয় তথ্য</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text">বিদ্যালয়ের সম্পূর্ণ ঠিকানা</label>
            <textarea
              rows={2}
              value={addressBn}
              onChange={(e) => setAddressBn(e.target.value)}
              placeholder="e.g. ফেনী-পরশুরাম মহাসড়ক সংলগ্ন, বন্দুয়া দৌলতপুর, আনন্দপুর ইউনিয়ন, ফুলগাজী, ফেনী।"
              className="w-full rounded-xl border border-border bg-surface-2 p-3 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="প্রাতিষ্ঠানিক মোবাইল নম্বর"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. ০১৮২৪-৪৭২২০০"
            />
            <Input
              label="বিকল্প ফোন নম্বর"
              value={phoneAlt}
              onChange={(e) => setPhoneAlt(e.target.value)}
              placeholder="e.g. ০১৭১২-৮৯৩০৪২"
            />
            <Input
              label="অফিশিয়াল ইমেইল"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. info@school.edu.bd"
            />
            <Input
              label="অফিস সময়"
              value={officeHours}
              onChange={(e) => setOfficeHours(e.target.value)}
              placeholder="e.g. রবি–বৃহস্পতি সকাল ৯:০০–বিকাল ৪:০০"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="ফেসবুক গ্রুপ / পেজ লিংক"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="e.g. https://www.facebook.com/groups/887015382052811/"
            />
            <Input
              label="ফেসবুক গ্রুপ আইডি (Group ID)"
              value={facebookGroupId}
              onChange={(e) => setFacebookGroupId(e.target.value)}
              placeholder="e.g. 887015382052811"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text">গুগল ম্যাপস এমবেড ইউআরএল (Google Maps Embed URL)</label>
            <input
              type="text"
              value={mapEmbedUrl}
              onChange={(e) => setMapEmbedUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </Card>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-xs text-muted">
            * সংরক্ষণ করার পর তথ্যগুলো সাথে সাথে পাবলিক ওয়েবসাইটে কার্যকর হবে।
          </p>

          {!supportMode && (
            <Button
              variant="primary"
              size="lg"
              icon={Save}
              type="submit"
            >
              সকল পরিবর্তন সংরক্ষণ করুন
            </Button>
          )}
        </div>
      </form>

      {/* ================= 5. FACTORY RESET (SUPERADMIN ONLY) ================= */}
      {currentUser?.role === 'school_superadmin' && (
        <Card surface="surface" className="p-6 border border-danger/30 bg-danger-soft/20 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-danger">স্কুল ফ্যাক্টরি রিসেট (Factory Reset)</h4>
                <p className="text-xs text-muted mt-1 leading-relaxed max-w-2xl">
                  শুধুমাত্র সুপার অ্যাডমিনের অনুমতিতে এই স্কুলের সমস্ত ডেটা (শিক্ষার্থী, রেজাল্ট, রসিদ, নোটিশ ও কন্টেন্ট) সম্পূর্ণ ফ্যাক্টরি ডিফল্টে ফিরিয়ে নেবে। প্ল্যাটফর্মের অন্য কোনো স্কুলের তথ্যে কোনো প্রভাব পড়বে না।
                </p>
              </div>
            </div>

            <Button
              variant="danger"
              size="sm"
              icon={RotateCcw}
              onClick={() => {
                setResetCode('');
                setResetModalOpen(true);
              }}
            >
              ফ্যাক্টরি রিসেট
            </Button>
          </div>
        </Card>
      )}

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="⚠️ চূড়ান্ত সতর্কতা: স্কুল ফ্যাক্টরি রিসেট"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-danger-soft text-danger text-xs space-y-2 border border-danger/20">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> এই প্রক্রিয়াটি সম্পূর্ণ অপরিবর্তনীয়!
            </div>
            <p>
              আপনি কি নিশ্চিত যে আপনি <strong>{school.name_bn}</strong>-এর সমস্ত শিক্ষার্থী, রেজাল্ট ও কন্টেন্ট মুছে ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text">
              নিশ্চিত করতে নিচে <strong>RESET</strong> টাইপ করুন:
            </label>
            <Input
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              placeholder="RESET"
              className="font-mono font-bold"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setResetModalOpen(false)}>
              বাতিল
            </Button>
            <Button
              variant="danger"
              disabled={resetCode !== 'RESET'}
              onClick={handleFactoryReset}
            >
              হ্যাঁ, ফ্যাক্টরি রিসেট করুন
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
