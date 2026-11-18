import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { TenantRepository } from '../../../services/tenantStorage';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Modal from '../../../components/ui/Modal';
import FilterChip from '../../../components/ui/FilterChip';
import EmptyState from '../../../components/ui/EmptyState';
import { useToast } from '../../../components/ui/ToastContext';
import { toBengaliNumber } from '../../../utils/dateFormatter';
import { 
  Award, 
  FileText, 
  Plus, 
  Search, 
  Printer, 
  ExternalLink, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  QrCode,
  UserCheck,
  Building2,
  Calendar,
  AlertCircle,
  Copy
} from 'lucide-react';

export default function CertificateManager() {
  const { school, supportMode, currentUser } = useOutletContext();
  const { showToast } = useToast();

  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Issue Certificate Modal State
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [formData, setFormData] = useState({
    type: 'testimonial',
    student_id: '',
    student_name_bn: '',
    student_name_en: '',
    father_name_bn: '',
    mother_name_bn: '',
    class: '10',
    roll: '1',
    section: 'A',
    session: '২০২৫-২০২৬',
    exam_name: 'মাধ্যমিক স্কুল সার্টিফিকেট (এসএসসি) পরীক্ষা',
    exam_year: '২০২৬',
    exam_roll: '',
    exam_reg: '',
    gpa: '৫.০০',
    board: school.board || 'কুমিল্লা',
    conduct: 'উত্তম ও সন্তোষজনক',
    tc_reason: 'অভিভাবকের বদলিজনিত কারণে',
    dues_cleared: true,
    remarks: 'তাহার নৈতিক চরিত্র প্রশংসনীয়। প্রতিষ্ঠান বা রাষ্ট্রবিরোধী কোনো কার্যকলাপে তাহার সংশ্লিষ্টতা ছিল না।',
    issued_date: new Date().toISOString().split('T')[0]
  });

  // Certificate Print / View Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [activeCert, setActiveCert] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const loadData = () => {
    const certList = TenantRepository.getCertificates(school.id);
    const studList = TenantRepository.getStudents(school.id);
    setCertificates(certList);
    setStudents(studList);
  };

  useEffect(() => {
    loadData();
  }, [school.id]);

  // When a student is selected in the issue modal, auto-populate details
  const handleStudentSelect = (sId) => {
    setSelectedStudentId(sId);
    const s = students.find(item => item.student_id === sId || item.id === sId);
    if (s) {
      setFormData(prev => ({
        ...prev,
        student_id: s.student_id,
        student_name_bn: s.name_bn,
        student_name_en: s.name_en || '',
        father_name_bn: s.father_name_bn || s.guardian_name || '',
        mother_name_bn: s.mother_name_bn || '',
        class: String(s.class),
        roll: String(s.roll),
        section: s.section || 'A',
        session: s.session || '২০২৫-২০২৬',
        gpa: s.gpa || prev.gpa
      }));
    }
  };

  // Generate QR Code when active certificate changes
  useEffect(() => {
    if (activeCert) {
      const verifyUrl = `${window.location.origin}/${school.slug}/verify/${activeCert.verification_code}`;
      QRCode.toDataURL(verifyUrl, {
        width: 140,
        margin: 1,
        color: {
          dark: '#064E3B',
          light: '#FFFFFF'
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR Gen error:', err));
    }
  }, [activeCert, school.slug]);

  // Issue Certificate Submit
  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (supportMode) {
      showToast('সাপোর্ট মোডে কোনো পরিবর্তন সংরক্ষণ করা যাবে না', 'error');
      return;
    }
    if (!formData.student_name_bn.trim()) {
      showToast('অনুগ্রহ করে শিক্ষার্থীর নাম লিখুন', 'error');
      return;
    }

    try {
      const creator = currentUser?.name || 'প্রধান শিক্ষক';
      const created = TenantRepository.createCertificate(school.id, formData, creator);
      showToast(`${created.type_bn} সফলভাবে তৈরি ও ইস্যু করা হয়েছে!`);
      setIssueModalOpen(false);
      loadData();
      setActiveCert(created);
      setViewModalOpen(true);
    } catch (err) {
      showToast(err.message || 'সনদ তৈরি ব্যর্থ হয়েছে', 'error');
    }
  };

  // Delete Certificate
  const handleDelete = (cert) => {
    if (supportMode) {
      showToast('সাপোর্ট মোডে ডিলিট করা যাবে না', 'error');
      return;
    }
    if (window.confirm(`আপনি কি নিশ্চিত যে সনদ নং "${cert.certificate_no}" মুছে ফেলতে চান?`)) {
      TenantRepository.deleteCertificate(school.id, cert.id);
      showToast('সনদ সফলভাবে মুছে ফেলা হয়েছে');
      loadData();
      if (activeCert?.id === cert.id) {
        setViewModalOpen(false);
      }
    }
  };

  // Copy Verification Link
  const handleCopyLink = (code) => {
    const link = `${window.location.origin}/${school.slug}/verify/${code}`;
    navigator.clipboard.writeText(link);
    showToast('ভেরিফিকেশন লিংক ক্লিপবোর্ডে কপি করা হয়েছে!');
  };

  // Filter & Search
  const filteredCerts = certificates.filter(cert => {
    if (typeFilter !== 'all' && cert.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        cert.student_name_bn?.toLowerCase().includes(q) ||
        cert.student_name_en?.toLowerCase().includes(q) ||
        cert.certificate_no?.toLowerCase().includes(q) ||
        cert.verification_code?.toLowerCase().includes(q) ||
        String(cert.roll).includes(q)
      );
    }
    return true;
  });

  // Stats Counters
  const countTotal = certificates.length;
  const countTestimonial = certificates.filter(c => c.type === 'testimonial').length;
  const countAttestation = certificates.filter(c => c.type === 'attestation').length;
  const countTc = certificates.filter(c => c.type === 'tc').length;

  const schoolSettings = TenantRepository.getSettings(school.id) || {};

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">
              সনদ ও প্রত্যয়নপত্র ব্যবস্থাপনা
            </h2>
          </div>
          <p className="text-xs text-muted mt-1">
            ডিজিটাল প্রশংসাপত্র (Testimonial), প্রত্যয়নপত্র ও ছাড়পত্র (TC) জেনারেশন ও লাইভ QR যাচাইকরণ
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            setSelectedStudentId('');
            setFormData({
              type: 'testimonial',
              student_id: '',
              student_name_bn: '',
              student_name_en: '',
              father_name_bn: '',
              mother_name_bn: '',
              class: '10',
              roll: '1',
              section: 'A',
              session: '২০২৫-২০২৬',
              exam_name: 'মাধ্যমিক স্কুল সার্টিফিকেট (এসএসসি) পরীক্ষা',
              exam_year: '২০২৬',
              exam_roll: '',
              exam_reg: '',
              gpa: '৫.০০',
              board: school.board || 'কুমিল্লা',
              conduct: 'উত্তম ও সন্তোষজনক',
              tc_reason: 'অভিভাবকের বদলিজনিত কারণে',
              dues_cleared: true,
              remarks: 'তাহার নৈতিক চরিত্র প্রশংসনীয়। প্রতিষ্ঠান বা রাষ্ট্রবিরোধী কোনো কার্যকলাপে তাহার সংশ্লিষ্টতা ছিল না।',
              issued_date: new Date().toISOString().split('T')[0]
            });
            setIssueModalOpen(true);
          }}
        >
          নতুন সনদ ইস্যু করুন
        </Button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card surface="surface" className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted block mb-1">মোট ইস্যুকৃত সনদ</span>
            <p className="text-2xl font-mono font-extrabold text-primary">
              {toBengaliNumber(countTotal)}
            </p>
            <span className="text-[11px] text-muted">ডিজিটাল রেকর্ড সংরক্ষিত</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </Card>

        <Card surface="surface" className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted block mb-1">প্রশংসাপত্র (Testimonial)</span>
            <p className="text-2xl font-mono font-extrabold text-info">
              {toBengaliNumber(countTestimonial)}
            </p>
            <span className="text-[11px] text-muted">এসএসসি ও প্রমোশন সনদ</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-info-soft text-info flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        </Card>

        <Card surface="surface" className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted block mb-1">প্রত্যয়নপত্র (Attestation)</span>
            <p className="text-2xl font-mono font-extrabold text-indigo">
              {toBengaliNumber(countAttestation)}
            </p>
            <span className="text-[11px] text-muted">অধ্যয়নরত প্রত্যয়ন</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-soft text-indigo flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </Card>

        <Card surface="surface" className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted block mb-1">ছাড়পত্র (TC)</span>
            <p className="text-2xl font-mono font-extrabold text-warning">
              {toBengaliNumber(countTc)}
            </p>
            <span className="text-[11px] text-muted">বিদ্যালয় স্থানান্তর সনদ</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning-soft text-warning flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter Chips & Search Bar */}
      <Card surface="surface" className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <FilterChip
              label="সব সনদ"
              count={countTotal}
              active={typeFilter === 'all'}
              onClick={() => setTypeFilter('all')}
            />
            <FilterChip
              label="প্রশংসাপত্র"
              count={countTestimonial}
              active={typeFilter === 'testimonial'}
              onClick={() => setTypeFilter('testimonial')}
            />
            <FilterChip
              label="প্রত্যয়নপত্র"
              count={countAttestation}
              active={typeFilter === 'attestation'}
              onClick={() => setTypeFilter('attestation')}
            />
            <FilterChip
              label="ছাড়পত্র (TC)"
              count={countTc}
              active={typeFilter === 'tc'}
              onClick={() => setTypeFilter('tc')}
            />
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="শিক্ষার্থী, রোল বা সনদ নম্বর খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      </Card>

      {/* Certificates Table */}
      {filteredCerts.length === 0 ? (
        <EmptyState
          icon={Award}
          title="কোনো সনদ পাওয়া যায়নি"
          description="নতুন সনদ তৈরি করতে উপরের 'নতুন সনদ ইস্যু করুন' বাটনে ক্লিক করুন।"
          actionLabel="নতুন সনদ ইস্যু করুন"
          onAction={() => setIssueModalOpen(true)}
        />
      ) : (
        <Card surface="surface" className="overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted border-b border-border uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">সনদ নম্বর ও কোড</th>
                  <th className="py-3 px-4">ধরন</th>
                  <th className="py-3 px-4">শিক্ষার্থী বিবরণ</th>
                  <th className="py-3 px-4">শ্রেণি ও রোল</th>
                  <th className="py-3 px-4">জিপিএ / ফলাফল</th>
                  <th className="py-3 px-4">ইস্যু তারিখ</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCerts.map((cert) => {
                  const isTc = cert.type === 'tc';
                  const isAtt = cert.type === 'attestation';
                  return (
                    <tr key={cert.id} className="hover:bg-surface-2/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-text block">
                          {cert.certificate_no}
                        </span>
                        <span className="font-mono text-[10px] text-primary flex items-center gap-1 mt-0.5">
                          <QrCode className="w-3 h-3 shrink-0" />
                          {cert.verification_code}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant={isTc ? 'warning' : isAtt ? 'info' : 'primary'}>
                          {isTc ? 'ছাড়পত্র (TC)' : isAtt ? 'প্রত্যয়নপত্র' : 'প্রশংসাপত্র'}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-text">{cert.student_name_bn}</div>
                        {cert.student_name_en && (
                          <div className="text-[11px] text-muted">{cert.student_name_en}</div>
                        )}
                        <div className="text-[10px] text-muted mt-0.5">
                          পিতা: {cert.father_name_bn || '—'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-text">
                          {toBengaliNumber(cert.class)}ম শ্রেণি
                        </span>
                        <div className="text-[10px] text-muted font-mono">
                          রোল: {toBengaliNumber(cert.roll)} {cert.section ? `(${cert.section})` : ''}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {cert.gpa ? (
                          <span className="font-mono font-bold text-success bg-success-soft px-2 py-0.5 rounded text-[11px]">
                            GPA: {cert.gpa}
                          </span>
                        ) : (
                          <span className="text-muted text-[11px]">—</span>
                        )}
                        <div className="text-[10px] text-muted truncate max-w-[140px] mt-0.5">
                          {cert.conduct || 'সন্তোষজনক'}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-muted text-[11px]">
                        {cert.issued_date}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="primary"
                            size="xs"
                            icon={Printer}
                            onClick={() => {
                              setActiveCert(cert);
                              setViewModalOpen(true);
                            }}
                            title="সনদ দেখুন ও প্রিন্ট করুন"
                          >
                            প্রিন্ট / ভিউ
                          </Button>

                          <Button
                            variant="secondary"
                            size="xs"
                            icon={ExternalLink}
                            onClick={() => handleCopyLink(cert.verification_code)}
                            title="যাচাই লিংক কপি করুন"
                          >
                            যাচাই
                          </Button>

                          <Button
                            variant="danger"
                            size="xs"
                            icon={Trash2}
                            onClick={() => handleDelete(cert)}
                            title="মুছুন"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ================= 1. ISSUE CERTIFICATE MODAL ================= */}
      <Modal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        title="নতুন অফিসিয়াল সনদ ইস্যু করুন"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleIssueSubmit} className="space-y-4">
          {/* Student Quick-Select Dropdown */}
          <div className="p-3 rounded-xl bg-surface-2 border border-border space-y-2">
            <label className="text-xs font-semibold text-text flex items-center justify-between">
              <span>শিক্ষার্থী নির্বাচন করুন (Auto-populate):</span>
              <span className="text-[10px] text-primary">স্কুলের তালিকা থেকে স্বয়ংক্রিয় পূরণ হবে</span>
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => handleStudentSelect(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">-- শিক্ষার্থী নির্বাচন করুন --</option>
              {students.map((s) => (
                <option key={s.id} value={s.student_id}>
                  {s.student_id} — {s.name_bn} ({s.class}ম শ্রেণি, রোল: {s.roll})
                </option>
              ))}
            </select>
          </div>

          {/* Certificate Type Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text">সনদের ধরন (Certificate Type) *</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'testimonial' }))}
                className={`p-3 rounded-xl border text-center transition-all ${
                  formData.type === 'testimonial'
                    ? 'border-primary bg-primary-soft text-primary font-bold shadow-xs'
                    : 'border-border bg-surface-2 text-muted hover:border-border-strong'
                }`}
              >
                <Award className="w-4 h-4 mx-auto mb-1 text-inherit" />
                <div className="text-xs">প্রশংসাপত্র</div>
                <div className="text-[10px] opacity-75">Testimonial</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'attestation' }))}
                className={`p-3 rounded-xl border text-center transition-all ${
                  formData.type === 'attestation'
                    ? 'border-indigo bg-indigo-soft text-indigo font-bold shadow-xs'
                    : 'border-border bg-surface-2 text-muted hover:border-border-strong'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-inherit" />
                <div className="text-xs">প্রত্যয়নপত্র</div>
                <div className="text-[10px] opacity-75">Attestation</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'tc' }))}
                className={`p-3 rounded-xl border text-center transition-all ${
                  formData.type === 'tc'
                    ? 'border-warning bg-warning-soft text-warning font-bold shadow-xs'
                    : 'border-border bg-surface-2 text-muted hover:border-border-strong'
                }`}
              >
                <UserCheck className="w-4 h-4 mx-auto mb-1 text-inherit" />
                <div className="text-xs">ছাড়পত্র (TC)</div>
                <div className="text-[10px] opacity-75">Transfer Cert</div>
              </button>
            </div>
          </div>

          {/* Student Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="শিক্ষার্থীর নাম (বাংলা) *"
              value={formData.student_name_bn}
              onChange={(e) => setFormData({ ...formData, student_name_bn: e.target.value })}
              placeholder="e.g. আব্দুর রহমান"
              required
            />
            <Input
              label="শিক্ষার্থীর নাম (ইংরেজি)"
              value={formData.student_name_en}
              onChange={(e) => setFormData({ ...formData, student_name_en: e.target.value })}
              placeholder="e.g. Abdur Rahman"
            />
          </div>

          {/* Parents' Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="পিতার নাম *"
              value={formData.father_name_bn}
              onChange={(e) => setFormData({ ...formData, father_name_bn: e.target.value })}
              placeholder="e.g. মো. মজিবুর রহমান"
              required
            />
            <Input
              label="মাতার নাম *"
              value={formData.mother_name_bn}
              onChange={(e) => setFormData({ ...formData, mother_name_bn: e.target.value })}
              placeholder="e.g. মোসাম্মৎ আয়েশা বেগম"
              required
            />
          </div>

          {/* Academic Particulars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              label="শ্রেণি *"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              placeholder="e.g. 10"
              required
            />
            <Input
              label="রোল নম্বর *"
              value={formData.roll}
              onChange={(e) => setFormData({ ...formData, roll: e.target.value })}
              placeholder="e.g. 1"
              required
            />
            <Input
              label="শাখা / গ্রুপ"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              placeholder="e.g. বিজ্ঞান / ক"
            />
            <Input
              label="শিক্ষাবর্ষ / সেশন"
              value={formData.session}
              onChange={(e) => setFormData({ ...formData, session: e.target.value })}
              placeholder="e.g. ২০২৫-২০২৬"
            />
          </div>

          {/* Exam & Result Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="পরীক্ষার নাম (যদি থাকে)"
              value={formData.exam_name}
              onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
              placeholder="e.g. এসএসসি পরীক্ষা ২০২৬"
            />
            <Input
              label="প্রাপ্ত GPA / গ্রেড"
              value={formData.gpa}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              placeholder="e.g. ৫.০০"
            />
            <Input
              label="বোর্ড"
              value={formData.board}
              onChange={(e) => setFormData({ ...formData, board: e.target.value })}
              placeholder="e.g. কুমিল্লা"
            />
          </div>

          {/* Board Exam Roll & Reg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="বোর্ড পরীক্ষার রোল (ঐচ্ছিক)"
              value={formData.exam_roll}
              onChange={(e) => setFormData({ ...formData, exam_roll: e.target.value })}
              placeholder="e.g. ৬৭৮১২৩"
            />
            <Input
              label="বোর্ড রেজিস্ট্রেশন নম্বর (ঐচ্ছিক)"
              value={formData.exam_reg}
              onChange={(e) => setFormData({ ...formData, exam_reg: e.target.value })}
              placeholder="e.g. ১৬১২৩৪৫৬৭৮"
            />
          </div>

          {/* If TC: Transfer Reason */}
          {formData.type === 'tc' && (
            <div className="p-3 rounded-xl bg-warning-soft/30 border border-warning/20 space-y-2">
              <Input
                label="বিদ্যালয় ত্যাগের কারণ (TC Reason) *"
                value={formData.tc_reason}
                onChange={(e) => setFormData({ ...formData, tc_reason: e.target.value })}
                placeholder="e.g. পিতার বদলিজনিত কারণে / পারিবারিক কারণে"
                required
              />
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.dues_cleared}
                  onChange={(e) => setFormData({ ...formData, dues_cleared: e.target.checked })}
                  className="rounded text-warning focus:ring-warning"
                />
                <span className="text-xs text-text font-medium">বিদ্যালয়ের যাবতীয় পাওনা পরিশোধিত</span>
              </label>
            </div>
          )}

          {/* Conduct & Remarks */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text">আচরণ ও চারিত্রিক মন্তব্য</label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full rounded-xl border border-border bg-surface p-2.5 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Issue Date */}
          <div className="w-48">
            <Input
              label="ইস্যুর তারিখ *"
              type="date"
              value={formData.issued_date}
              onChange={(e) => setFormData({ ...formData, issued_date: e.target.value })}
              required
            />
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="secondary" onClick={() => setIssueModalOpen(false)}>
              বাতিল
            </Button>
            <Button variant="primary" type="submit" icon={Award}>
              সনদ সংরক্ষণ ও প্রিন্ট ভিউ
            </Button>
          </div>
        </form>
      </Modal>

      {/* ================= 2. CERTIFICATE PRINT & VIEW MODAL ================= */}
      {activeCert && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`সনদ প্রিভিউ — ${activeCert.certificate_no}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-2 border border-border no-print">
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="text-muted">ভেরিফিকেশন কোড:</span>
                <span className="font-mono font-bold text-text">{activeCert.verification_code}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Copy}
                  onClick={() => handleCopyLink(activeCert.verification_code)}
                >
                  লিংক কপি
                </Button>
                <Link
                  to={`/${school.slug}/verify/${activeCert.verification_code}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-hover text-xs font-semibold text-text transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  পাবলিক যাচাই পেজ
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Printer}
                  onClick={() => window.print()}
                >
                  প্রিন্ট / ডাউনলোড (1-A4)
                </Button>
              </div>
            </div>

            {/* ================= PRINTABLE CERTIFICATE SHEET ================= */}
            <div className="printable-sheet bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl border-4 border-double border-emerald-900/60 relative overflow-hidden font-serif max-w-[850px] mx-auto min-h-[600px] flex flex-col justify-between">
              {/* Ornamental Corner Borders */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-emerald-900 pointer-events-none" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-emerald-900 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-emerald-900 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-emerald-900 pointer-events-none" />

              {/* Watermark Crest Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
                <Award className="w-96 h-96 text-emerald-950" />
              </div>

              {/* Header: School Identity */}
              <div className="relative z-10 text-center pb-4 border-b-2 border-emerald-900/30">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="w-20 text-left font-mono text-[10px] text-slate-600 leading-tight">
                    <div>EIIN: {school.eiin}</div>
                    <div>বোর্ড: {school.board}</div>
                    <div>প্রতিষ্ঠা: {schoolSettings.established || '১৯৯০'}</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <img
                      src={school.logo || school.logo_url || '/favicon.svg'}
                      alt="Logo"
                      className="w-14 h-14 object-contain rounded-full border border-emerald-900/20 p-1 mb-1"
                    />
                    <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-heading tracking-tight">
                      {school.name_bn}
                    </h1>
                    <p className="text-xs font-sans text-slate-700 tracking-wider uppercase font-semibold">
                      {school.name_en || school.nameAlt}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {schoolSettings.address_bn || `${school.district || 'ফেনী'}, বাংলাদেশ`}
                    </p>
                  </div>

                  <div className="w-20 text-right font-mono text-[10px] text-slate-600 leading-tight">
                    <div>সনদ নং:</div>
                    <div className="font-bold text-slate-900">{activeCert.certificate_no}</div>
                    <div className="mt-1">তারিখ:</div>
                    <div className="font-bold">{activeCert.issued_date}</div>
                  </div>
                </div>

                {/* Certificate Title Banner */}
                <div className="inline-block mt-3 px-8 py-1.5 rounded-full bg-emerald-900 text-white font-heading font-black text-lg tracking-wider shadow-sm uppercase">
                  {activeCert.type === 'tc' 
                    ? 'ছাড়পত্র / ট্রান্সফার সার্টিফিকেট (T.C.)' 
                    : activeCert.type === 'attestation' 
                    ? 'প্রত্যয়নপত্র (Attestation Certificate)' 
                    : 'প্রশংসাপত্র (Testimonial)'}
                </div>
              </div>

              {/* Body: Official Certification Prose */}
              <div className="relative z-10 py-6 text-slate-800 text-sm sm:text-base leading-loose font-serif text-justify space-y-4">
                <p>
                  এই মর্মে প্রত্যয়ন করা যাইতেছে যে, 
                  <strong className="text-emerald-950 font-bold px-1.5 underline decoration-emerald-800/40">
                    {activeCert.student_name_bn}
                  </strong>
                  {activeCert.student_name_en && (
                    <span className="font-sans text-sm font-semibold text-slate-700">
                      ({activeCert.student_name_en}),
                    </span>
                  )} 
                  পিতা: <strong className="font-bold">{activeCert.father_name_bn}</strong>, 
                  মাতা: <strong className="font-bold">{activeCert.mother_name_bn}</strong>; 
                  এই বিদ্যালয়ের <strong className="font-bold">{toBengaliNumber(activeCert.class)}ম শ্রেণির</strong> একজন নিয়মিত শিক্ষার্থী ছিল। 
                  তাহার শ্রেণি রোল নম্বর ছিল <strong className="font-mono font-bold">{toBengaliNumber(activeCert.roll)}</strong> 
                  {activeCert.section ? ` (শাখা: ${activeCert.section})` : ''} এবং শিক্ষাবর্ষ ছিল <strong className="font-bold">{activeCert.session}</strong>।
                </p>

                {activeCert.type === 'testimonial' && (
                  <p>
                    সে {activeCert.board} শিক্ষা বোর্ডের অধীনে অনুষ্ঠিত{' '}
                    <strong className="font-bold">{activeCert.exam_name || 'এস.এস.সি'}</strong> পরীক্ষায় অংশ গ্রহণ করিয়া 
                    জিপিএ (GPA) <strong className="font-mono font-bold text-emerald-950">{activeCert.gpa || '৫.০০'}</strong> পেয়ে সফলতার সহিত উত্তীর্ণ হইয়াছে।
                    {activeCert.exam_roll && (
                      <span> তাহার বোর্ড পরীক্ষার রোল নম্বর: <strong className="font-mono font-bold">{activeCert.exam_roll}</strong></span>
                    )}
                    {activeCert.exam_reg && (
                      <span> এবং রেজিস্ট্রেশন নম্বর: <strong className="font-mono font-bold">{activeCert.exam_reg}</strong>।</span>
                    )}
                  </p>
                )}

                {activeCert.type === 'tc' && (
                  <p>
                    বিদ্যালয় পরিত্যাগের কারণ: <strong className="font-bold text-slate-900">{activeCert.tc_reason || 'পিতার বদলিজনিত কারণে'}</strong>। 
                    বিদ্যালয়ে অধ্যয়নকালীন তাহার যাবতীয় পাওনা পরিশোধিত রহিয়াছে এবং সে স্বেচ্ছায় বিদ্যালয় ত্যাগ করিয়াছে।
                  </p>
                )}

                <p>
                  বিদ্যালয়ে অধ্যয়নকালে তাহার চরিত্র <strong className="font-bold text-emerald-950">{activeCert.conduct || 'উত্তম ও প্রশংসনীয়'}</strong> ছিল। 
                  {activeCert.remarks || 'প্রতিষ্ঠান বা রাষ্ট্রবিরোধী কোনো কার্যকলাপে তাহার কোনো সংশ্লিষ্টতা ছিল না।'} 
                  আমি তাহার জীবনের সর্বাঙ্গীন উন্নতি ও উজ্জ্বল ভবিষ্যৎ কামনা করি।
                </p>
              </div>

              {/* Footer: QR Code & Signatures */}
              <div className="relative z-10 pt-6 border-t border-emerald-900/30 flex items-end justify-between gap-4">
                {/* Left: Dynamic QR Code Verification Stamp */}
                <div className="flex items-center gap-3">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="Verification QR" 
                      className="w-24 h-24 rounded-lg border border-slate-300 p-1 bg-white shadow-xs" 
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg border border-slate-300 flex items-center justify-center bg-slate-50 font-mono text-[9px] text-slate-400">
                      QR Code
                    </div>
                  )}
                  <div className="text-[10px] text-slate-600 font-sans leading-snug">
                    <div className="font-bold text-emerald-950 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      ডিজিটাল সত্যতা যাচাই
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      ক্যামেরা দিয়ে QR কোড স্ক্যান করে এই সনদের মূল সরকারি তথ্য অনলাইনে মিলিয়ে নিন।
                    </div>
                    <div className="font-mono font-bold text-slate-800 mt-1">
                      কোড: {activeCert.verification_code}
                    </div>
                  </div>
                </div>

                {/* Center: Official Seal */}
                <div className="text-center font-sans hidden sm:block">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-900/40 flex items-center justify-center mx-auto mb-1 text-[10px] text-emerald-900 font-bold uppercase">
                    বিদ্যালয় সীল
                  </div>
                  <span className="text-[9px] text-slate-500">অফিশিয়াল গোল সীলমোহর</span>
                </div>

                {/* Right: Headmaster Signature & Designation */}
                <div className="text-center font-sans">
                  <div className="h-10 flex items-end justify-center mb-1">
                    <span className="font-serif italic text-emerald-950 text-sm font-bold border-b border-slate-800 px-6 pb-0.5">
                      {schoolSettings.headmaster_name || 'জনাব বাহার উদ্দিন ভূঁইয়া'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {schoolSettings.headmaster_designation || 'প্রধান শিক্ষক'}
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {school.name_bn}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
