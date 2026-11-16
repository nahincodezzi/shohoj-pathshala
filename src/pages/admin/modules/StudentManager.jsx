import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { TenantRepository } from '../../../services/tenantStorage';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import GridTable from '../../../components/ui/GridTable';
import Modal from '../../../components/ui/Modal';
import FileUpload from '../../../components/ui/FileUpload';
import { useToast } from '../../../components/ui/ToastContext';
import { exportToCsv } from '../../../utils/exportCsv';
import { toBengaliOrdinal, toBengaliNumber } from '../../../utils/dateFormatter';
import { 
  Users, 
  Plus, 
  Search, 
  CreditCard, 
  Printer, 
  GraduationCap, 
  CheckCircle2, 
  Download,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  Edit2,
  Trash2
} from 'lucide-react';

export default function StudentManager() {
  const { school, currentUser, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [classFilter, setClassFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteModalStudent, setDeleteModalStudent] = useState(null);
  const [idCardStudent, setIdCardStudent] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Excel Bulk Import State
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [excelFileName, setExcelFileName] = useState('');
  const [excelErrors, setExcelErrors] = useState([]);

  // Form State
  const [form, setForm] = useState({
    name_bn: '',
    name_en: '',
    father_name: '',
    mother_name: '',
    class: '10',
    group: 'Science',
    roll: '',
    mobile: '',
    dob: '',
    blood_group: '',
    address: '',
    photo: null
  });
  const [formError, setFormError] = useState('');

  const students = TenantRepository.getStudents(school.id);

  const filteredStudents = students.filter(s => {
    if (classFilter !== 'all' && s.class !== classFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.name_bn.toLowerCase().includes(q) ||
        (s.name_en && s.name_en.toLowerCase().includes(q)) ||
        s.student_id.toLowerCase().includes(q) ||
        String(s.roll) === q
      );
    }
    return true;
  });

  const validateForm = () => {
    const errs = {};
    if (!form.name_bn.trim()) errs.name_bn = 'শিক্ষার্থীর নাম (বাংলায়) লেখা আবশ্যক।';
    const rollNum = Number(form.roll);
    if (isNaN(rollNum) || rollNum < 1 || rollNum > 9999) {
      errs.roll = 'রোল নম্বর অবশ্যই ১ থেকে ৯৯৯৯ এর মধ্যে হতে হবে (রোল ০ গ্রহণযোগ্য নয়)।';
    }
    if (form.mobile && !/^01[3-9]\d{8}$/.test(form.mobile.trim())) {
      errs.mobile = 'মোবাইল নম্বর অবশ্যই সঠিক ১১ ডিজিটের বাংলাদেশি নম্বর (01...) হতে হবে।';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!validateForm()) return;

    try {
      if (editStudent) {
        TenantRepository.updateStudent(school.id, editStudent.id, form);
        showToast('শিক্ষার্থীর তথ্য সফলভাবে আপডেট হয়েছে!');
      } else {
        TenantRepository.createStudent(school.id, form);
        showToast('শিক্ষার্থী সফলভাবে নিবন্ধিত হয়েছে!');
      }

      setAddModalOpen(false);
      setEditStudent(null);
      setForm({
        name_bn: '',
        name_en: '',
        father_name: '',
        mother_name: '',
        class: '10',
        group: 'Science',
        roll: '',
        mobile: '',
        dob: '',
        blood_group: '',
        address: '',
        photo: null
      });
      setFieldErrors({});
    } catch (err) {
      setFormError(err.message);
    }
  };

  const openEdit = (s) => {
    setEditStudent(s);
    setForm({
      name_bn: s.name_bn || '',
      name_en: s.name_en || '',
      father_name: s.father_name || '',
      mother_name: s.mother_name || '',
      class: s.class || '10',
      group: s.group || 'Science',
      roll: s.roll || '',
      mobile: s.mobile || '',
      dob: s.dob || '',
      blood_group: s.blood_group || '',
      address: s.address || '',
      photo: s.photo || null
    });
    setFieldErrors({});
    setFormError('');
    setAddModalOpen(true);
  };

  const handleDeleteStudent = () => {
    if (!deleteModalStudent) return;
    TenantRepository.deleteStudent(school.id, deleteModalStudent.id);
    showToast('শিক্ষার্থী সফলভাবে তালিকা থেকে মুছে ফেলা হয়েছে!');
    setDeleteModalStudent(null);
  };

  const handleExportCsv = () => {
    const headers = ['Student ID', 'নাম (বাংলা)', 'Student Name (English)', 'শ্রেণি', 'রোল', 'বিভাগ', 'পিতার নাম', 'মোবাইল', 'ঠিকানা'];
    const rows = filteredStudents.map(s => [
      s.student_id,
      s.name_bn,
      s.name_en,
      toBengaliOrdinal(s.class),
      s.roll,
      s.group,
      s.father_name,
      s.mobile,
      s.address
    ]);
    exportToCsv(`${school.slug}_students_${classFilter}_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
    showToast('শিক্ষার্থী তালিকা CSV আকারে এক্সপোর্ট হয়েছে!');
  };

  const handleDownloadSampleExcel = () => {
    const wsData = [
      ['name_bn', 'name_en', 'class', 'roll', 'group', 'mobile', 'father_name', 'mother_name', 'blood_group', 'address'],
      ['মো. তানভীর আহমেদ', 'Md. Tanvir Ahmed', '10', 1, 'Science', '01811223344', 'মো. রফিক উদ্দিন', 'রাশেদা বেগম', 'A+', 'ফুলগাজী, ফেনী'],
      ['ফাতেমা আক্তার', 'Fatima Akter', '10', 2, 'Science', '01855667788', 'মো. আবুল কালাম', 'নুরজাহান বেগম', 'B+', 'আনন্দপুর, ফেনী'],
      ['হাসান মাহমুদ', 'Hasan Mahmud', '9', 1, 'Business Studies', '01711223344', 'আব্দুল হামিদ', 'হোসনে আরা', 'O+', 'সদর, ফেনী']
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'student_bulk_import_sample.xlsx');
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

        const existing = TenantRepository.getStudents(school.id);
        const validated = [];
        const errs = [];
        const seenClassRoll = new Set();

        rows.forEach((r, idx) => {
          const rowNum = idx + 2;
          const nameBn = String(r.name_bn || r['নাম (বাংলা)'] || r['নাম'] || '').trim();
          const nameEn = String(r.name_en || r['Name'] || r['name'] || '').trim();
          const cls = String(r.class || r['শ্রেণি'] || r['Class'] || '').replace(/[^0-9]/g, '');
          const roll = Number(r.roll || r['রোল'] || r['Roll']);
          const grp = String(r.group || r['বিভাগ'] || 'General').trim();
          const mobile = String(r.mobile || r['মোবাইল'] || '').trim();
          const father = String(r.father_name || r['পিতার নাম'] || '').trim();
          const mother = String(r.mother_name || r['মাতার নাম'] || '').trim();
          const blood = String(r.blood_group || r['রক্তের গ্রুপ'] || '').trim();
          const addr = String(r.address || r['ঠিকানা'] || '').trim();

          if (!nameBn) {
            errs.push(`সারি ${rowNum}: শিক্ষার্থীর নাম (বাংলা) অনুপস্থিত।`);
            return;
          }
          if (!cls || !['6', '7', '8', '9', '10'].includes(cls)) {
            errs.push(`সারি ${rowNum}: সঠিক শ্রেণি (৬-১০) দিন।`);
            return;
          }
          if (!roll || roll < 1 || roll > 9999) {
            errs.push(`সারি ${rowNum}: রোল নম্বর ১-৯৯৯৯ এর মধ্যে হতে হবে।`);
            return;
          }

          const key = `${cls}_${roll}`;
          if (seenClassRoll.has(key)) {
            errs.push(`সারি ${rowNum}: ফাইলে একই শ্রেণি ${cls}-এ ডুপ্লিকেট রোল ${roll} পাওয়া গেছে।`);
            return;
          }
          seenClassRoll.add(key);

          if (existing.some(s => s.class === cls && Number(s.roll) === roll)) {
            errs.push(`সারি ${rowNum}: শ্রেণি ${cls}-এ রোল ${roll} ইতোমধ্যে ডেটাবেজে রয়েছে।`);
            return;
          }

          validated.push({
            name_bn: nameBn,
            name_en: nameEn || nameBn,
            class: cls,
            roll,
            group: ['9', '10'].includes(cls) ? (grp || 'Science') : 'General',
            mobile,
            father_name: father,
            mother_name: mother,
            blood_group: blood,
            address: addr
          });
        });

        setExcelData(validated);
        setExcelErrors(errs);
      } catch (err) {
        showToast('ফাইলটি পড়তে সমস্যা হয়েছে। দয়া করে সঠিক .xlsx বা .csv ফাইল দিন।', 'error');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmExcelImport = () => {
    if (excelData.length === 0) return;
    try {
      let importedCount = 0;
      excelData.forEach(st => {
        TenantRepository.createStudent(school.id, st);
        importedCount++;
      });
      showToast(`${toBengaliNumber(importedCount)} জন শিক্ষার্থীর তথ্য সফলভাবে Excel থেকে ইমপোর্ট করা হয়েছে!`);
      setExcelModalOpen(false);
      setExcelData([]);
      setExcelErrors([]);
      setExcelFileName('');
    } catch (err) {
      showToast(err.message || 'ইমপোর্টে ত্রুটি হয়েছে', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">শিক্ষার্থী রেজিস্ট্রি ও রোল বরাদ্দ</h2>
          <p className="text-xs text-muted">শ্রেণিভিত্তিক শিক্ষার্থী ডাটাবেস, আইডি কার্ড ও এনরোলমেন্ট</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="md" icon={Download} onClick={handleExportCsv}>
            CSV এক্সপোর্ট
          </Button>
          {!supportMode && (
            <Button 
              variant="secondary" 
              size="md" 
              icon={FileSpreadsheet} 
              onClick={() => {
                setExcelData([]);
                setExcelErrors([]);
                setExcelFileName('');
                setExcelModalOpen(true);
              }}
            >
              Excel (.xlsx) আপলোড
            </Button>
          )}
          {!supportMode && (
            <Button 
              variant="primary" 
              size="md" 
              icon={Plus} 
              onClick={() => {
                setEditStudent(null);
                setForm({
                  name_bn: '',
                  name_en: '',
                  father_name: '',
                  mother_name: '',
                  class: '10',
                  group: 'Science',
                  roll: '',
                  mobile: '',
                  dob: '',
                  blood_group: '',
                  address: '',
                  photo: null
                });
                setFieldErrors({});
                setFormError('');
                setAddModalOpen(true);
              }}
            >
              নতুন শিক্ষার্থী যোগ করুন
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card surface="surface" className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setClassFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              classFilter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-2 text-muted hover:text-text'
            }`}
          >
            সব শ্রেণি ({students.length})
          </button>
          {['6', '7', '8', '9', '10'].map(c => {
            const count = students.filter(s => s.class === c).length;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setClassFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  classFilter === c ? 'bg-primary text-on-primary' : 'bg-surface-2 text-muted hover:text-text'
                }`}
              >
                {toBengaliOrdinal(c)} ({count})
              </button>
            );
          })}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="নাম, রোল বা আইডি দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>
      </Card>

      {/* Students Grid Table */}
      <GridTable
        columns={[
          { 
            key: 'student_id', 
            label: 'আইডি নম্বর', 
            width: '145px', 
            fontMono: true,
            render: (val) => (
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-2 border border-border/80 text-text">
                {val}
              </span>
            )
          },
          { 
            key: 'roll', 
            label: 'রোল', 
            width: '65px', 
            fontMono: true, 
            align: 'center', 
            render: (val) => (
              <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-md bg-surface-2/90 font-mono text-xs font-bold text-text border border-border/70 shadow-2xs">
                {toBengaliNumber(val)}
              </span>
            ) 
          },
          { 
            key: 'name_bn', 
            label: 'শিক্ষার্থীর নাম', 
            width: '1.4fr',
            render: (val, row) => (
              <div className="flex items-center gap-3">
                {row.photo ? (
                  <img src={row.photo} alt={val} className="w-9 h-9 rounded-full object-cover border border-border shrink-0 shadow-2xs" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                    {val?.split(' ').pop()?.[0] || 'ছাত্র'}
                  </div>
                )}
                <div className="min-w-0">
                  <strong className="text-text font-bold text-sm block truncate">{val}</strong>
                  <span className="text-[11px] text-muted font-mono block truncate">{row.name_en || '—'}</span>
                </div>
              </div>
            )
          },
          { 
            key: 'class', 
            label: 'শ্রেণি', 
            width: '100px', 
            render: (val) => (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-soft text-primary-text border border-primary/25">
                {toBengaliOrdinal(val)} শ্রেণি
              </span>
            ) 
          },
          { 
            key: 'group', 
            label: 'বিভাগ', 
            width: '95px',
            render: (val) => (
              <span className="text-xs text-muted font-medium">
                {val || 'সাধারণ'}
              </span>
            )
          },
          { 
            key: 'mobile', 
            label: 'মোবাইল', 
            width: '125px', 
            fontMono: true,
            render: (val) => (
              <span className="font-mono text-xs text-muted">
                {val || '—'}
              </span>
            ) 
          },
          {
            key: 'action',
            label: 'অ্যাকশন',
            width: '180px',
            align: 'right',
            noTruncate: true,
            render: (_, row) => (
              <div className="flex items-center justify-end gap-1.5 shrink-0">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  icon={Printer}
                  onClick={() => setIdCardStudent(row)}
                  title="আইডি কার্ড প্রিন্ট"
                  className="px-2.5 h-8 text-xs font-semibold shrink-0 gap-1.5"
                >
                  আইডি কার্ড
                </Button>
                {!supportMode && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon={Edit2}
                      onClick={() => openEdit(row)}
                      title="সম্পাদনা করুন"
                      className="p-1.5 h-8 text-muted hover:text-primary shrink-0"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon={Trash2}
                      onClick={() => setDeleteModalStudent(row)}
                      title="মুছে ফেলুন"
                      className="p-1.5 h-8 text-muted hover:text-danger hover:bg-danger-soft shrink-0"
                    />
                  </>
                )}
              </div>
            )
          }
        ]}
        data={filteredStudents}
        minWidth="940px"
      />

      {/* ================= ADD / EDIT STUDENT MODAL ================= */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={editStudent ? 'শিক্ষার্থীর তথ্য সম্পাদনা' : 'নতুন শিক্ষার্থী ভর্তি / রেজিস্ট্রেশন'}
        subtitle="বিদ্যালয়ের নির্দিষ্ট শ্রেণিতে রোল বরাদ্দ ও প্রোফাইল ডাটাবেস"
        maxWidth="max-w-2xl"
      >
        {formError && (
          <div className="p-3 mb-4 rounded-lg bg-danger-soft text-danger text-xs font-semibold border border-danger/30">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="শিক্ষার্থীর নাম (বাংলা) *"
                placeholder="যেমন: আব্দুর রহমান"
                value={form.name_bn}
                onChange={(e) => setForm({ ...form, name_bn: e.target.value })}
                required
              />
              {fieldErrors.name_bn && (
                <p className="text-danger text-xs mt-1">{fieldErrors.name_bn}</p>
              )}
            </div>

            <Input
              label="Student Name (English)"
              placeholder="e.g. Abdur Rahman"
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="শ্রেণি"
              value={form.class}
              onChange={(e) => setForm({ ...form, class: e.target.value })}
              options={['6', '7', '8', '9', '10'].map(c => ({ value: c, label: `${toBengaliOrdinal(c)} শ্রেণি` }))}
            />

            <Select
              label="বিভাগ (Group)"
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
              options={[
                { value: 'General', label: 'সাধারণ (General)' },
                { value: 'Science', label: 'বিজ্ঞান (Science)' },
                { value: 'Business Studies', label: 'ব্যবসায় শিক্ষা' },
                { value: 'Humanities', label: 'মানবিক' }
              ]}
            />

            <div>
              <Input
                label="শ্রেণি রোল নম্বর *"
                type="number"
                min="1"
                max="9999"
                placeholder="1"
                value={form.roll}
                onChange={(e) => setForm({ ...form, roll: e.target.value })}
                required
              />
              {fieldErrors.roll && (
                <p className="text-danger text-xs mt-1">{fieldErrors.roll}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="পিতার নাম"
              value={form.father_name}
              onChange={(e) => setForm({ ...form, father_name: e.target.value })}
            />
            <Input
              label="মাতার নাম"
              value={form.mother_name}
              onChange={(e) => setForm({ ...form, mother_name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Input
                label="অভিভাবকের মোবাইল (১১ ডিজিট)"
                placeholder="018XXXXXXXX"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
              {fieldErrors.mobile && (
                <p className="text-danger text-xs mt-1">{fieldErrors.mobile}</p>
              )}
            </div>

            <Input
              label="জন্ম তারিখ"
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />

            <Select
              label="রক্তের গ্রুপ"
              value={form.blood_group}
              onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
              options={[
                { value: '', label: 'জানা নেই' },
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' }
              ]}
            />
          </div>

          <FileUpload
            label="শিক্ষার্থীর পাসপোর্ট সাইজ ছবি (ঐচ্ছিক)"
            helperText="আইডি কার্ড ও ডিজিটাল রেকর্ডের জন্য"
            type="image"
            value={form.photo}
            onChange={(val) => setForm({ ...form, photo: val })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text">ঠিকানা / গ্রাম</label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-[10px] bg-surface-2 border border-border-strong text-text p-2.5 text-xs outline-none focus:border-primary"
              placeholder="গ্রাম, ইউনিয়ন, উপজেলা, জেলা"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary">
              {editStudent ? 'আপডেট করুন' : 'নিবন্ধন সম্পন্ন করুন'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ================= D26: DIGITAL STUDENT ID CARD MODAL ================= */}
      {idCardStudent && (
        <Modal
          isOpen={!!idCardStudent}
          onClose={() => setIdCardStudent(null)}
          title="ডিজিটাল স্টুডেন্ট আইডি কার্ড"
          subtitle="প্রিন্টযোগ্য অফিসিয়াল লেমিনেটেড কার্ড"
          maxWidth="max-w-md"
        >
          <div className="p-2 flex flex-col items-center">
            {/* ID Card Box (D26: Logo + Photo + Barcode + Clean Print) */}
            <div className="printable-document w-[320px] rounded-2xl border-2 border-primary/40 bg-surface text-text p-5 shadow-xl text-center space-y-3 relative overflow-hidden printable-card">
              <div className="absolute top-0 left-0 right-0 h-2 bg-primary" />
              
              <div className="flex items-center justify-center gap-2 pt-1">
                {school.logo_url && (
                  <img src={school.logo_url} alt="Logo" className="w-7 h-7 object-contain" />
                )}
                <div>
                  <h4 className="text-xs font-heading font-bold leading-tight">{school.name_bn}</h4>
                  <p className="text-[9px] text-muted font-mono">EIIN: {school.eiin} • {school.district}</p>
                </div>
              </div>

              {/* Student Photo */}
              <div className="w-20 h-20 rounded-full border-2 border-primary mx-auto bg-surface-2 flex items-center justify-center overflow-hidden shadow-inner">
                {idCardStudent.photo ? (
                  <img src={idCardStudent.photo} alt={idCardStudent.name_bn} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary font-bold text-xl">
                    {idCardStudent.name_bn.split(' ').pop()?.[0] || 'ছাত্র'}
                  </span>
                )}
              </div>

              <div>
                <h5 className="text-base font-heading font-bold text-text">{idCardStudent.name_bn}</h5>
                <p className="text-xs font-mono text-primary font-bold">{idCardStudent.student_id}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-left p-3 rounded-xl bg-surface-2 border border-border">
                <div>
                  <span className="text-muted block text-[10px]">শ্রেণি</span>
                  <span className="font-bold">{toBengaliOrdinal(idCardStudent.class)}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">রোল নম্বর</span>
                  <span className="font-bold font-mono">{toBengaliNumber(idCardStudent.roll)}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">বিভাগ</span>
                  <span>{idCardStudent.group || 'General'}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">রক্তের গ্রুপ</span>
                  <span className="font-bold text-danger">{idCardStudent.blood_group || 'O+'}</span>
                </div>
              </div>

              <div className="text-left text-[10px] text-muted px-1">
                <span>জরুরি যোগাযোগ: </span>
                <span className="font-mono text-text font-semibold">{idCardStudent.mobile || school.phone}</span>
              </div>

              {/* D26: Barcode Pattern Visual */}
              <div className="pt-1 border-t border-border/80">
                <div className="font-mono text-[10px] tracking-widest text-muted select-none">
                  ||||| | ||| |||| | ||||| ||| || ||||
                </div>
                <span className="text-[9px] font-mono text-muted">{idCardStudent.student_id}</span>
              </div>

              <div className="pt-2 flex items-center justify-between text-[9px] text-muted border-t border-border/80">
                <span>মেয়াদ: ৩১ ডিসেম্বর ২০২৭</span>
                <span className="font-bold text-text">ভারপ্রাপ্ত প্রধান শিক্ষক</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 no-print">
              <Button variant="secondary" size="sm" onClick={() => setIdCardStudent(null)}>
                বন্ধ করুন
              </Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                আইডি কার্ড প্রিন্ট করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Excel Bulk Import Modal */}
      {excelModalOpen && (
        <Modal
          isOpen={excelModalOpen}
          onClose={() => setExcelModalOpen(false)}
          title="📊 Excel (.xlsx / .csv) ফাইল থেকে শিক্ষার্থী বাল্ক আপলোড"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-surface-2 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-text">নমুনা এক্সেল টেমপ্লেট</h4>
                <p className="text-[11px] text-muted">সঠিক ফরম্যাটে তথ্য সাজাতে নমুনা ফাইলটি ডাউনলোড করে পূরণ করুন।</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={handleDownloadSampleExcel}
              >
                নমুনা টেমপ্লেট ডাউনলোড
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text block">Excel (.xlsx) বা .csv ফাইল নির্বাচন করুন:</label>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleExcelUpload}
                className="w-full text-xs text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-on-primary hover:file:opacity-90 cursor-pointer p-2 rounded-xl bg-surface-2 border border-dashed border-border"
              />
              {excelFileName && (
                <div className="text-[11px] text-primary flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> নির্বাচিত ফাইল: {excelFileName}
                </div>
              )}
            </div>

            {/* Error List */}
            {excelErrors.length > 0 && (
              <div className="p-3.5 rounded-xl bg-danger-soft border border-danger/25 space-y-1.5 max-h-36 overflow-y-auto">
                <div className="text-xs font-bold text-danger flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {excelErrors.length}টি ত্রুটি পাওয়া গেছে (এগুলো সংশোধন করতে হবে):
                </div>
                <ul className="text-[11px] text-danger/90 list-disc list-inside space-y-0.5 font-mono">
                  {excelErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview of Valid Records */}
            {excelData.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text">
                    ইমপোর্টের জন্য প্রস্তুত: <strong className="text-primary font-mono">{toBengaliNumber(excelData.length)} জন</strong>
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto border border-border rounded-xl bg-surface">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-surface-2 border-b border-border text-[11px] text-muted uppercase font-mono">
                      <tr>
                        <th className="p-2.5">রোল</th>
                        <th className="p-2.5">শ্রেণি</th>
                        <th className="p-2.5">শিক্ষার্থীর নাম</th>
                        <th className="p-2.5">বিভাগ</th>
                        <th className="p-2.5">মোবাইল</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-mono text-[11px]">
                      {excelData.slice(0, 10).map((row, i) => (
                        <tr key={i} className="hover:bg-surface-2/50">
                          <td className="p-2.5 font-bold text-primary">{toBengaliNumber(row.roll)}</td>
                          <td className="p-2.5">{toBengaliOrdinal(row.class)}</td>
                          <td className="p-2.5 font-sans font-medium text-text">{row.name_bn}</td>
                          <td className="p-2.5">{row.group}</td>
                          <td className="p-2.5 text-muted">{row.mobile || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {excelData.length > 10 && (
                    <div className="p-2 text-center text-[10px] text-muted border-t border-border bg-surface-2/40">
                      আরও {toBengaliNumber(excelData.length - 10)} জন শিক্ষার্থী তালিকায় রয়েছে...
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <Button variant="secondary" size="sm" onClick={() => setExcelModalOpen(false)}>
                বাতিল
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Upload}
                disabled={excelData.length === 0}
                onClick={handleConfirmExcelImport}
              >
                ইমপোর্ট সম্পন্ন করুন ({toBengaliNumber(excelData.length)} জন)
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* D13: Delete Student Confirmation Modal */}
      {deleteModalStudent && (
        <Modal
          isOpen={!!deleteModalStudent}
          onClose={() => setDeleteModalStudent(null)}
          title="শিক্ষার্থী ডিলিট নিশ্চিতকরণ"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-text leading-relaxed">
              আপনি কি নিশ্চিত যে শিক্ষার্থী <strong>"{deleteModalStudent.name_bn}"</strong> ({deleteModalStudent.student_id})-কে তালিকা থেকে মুছে ফেলতে চান?
            </p>
            <p className="text-xs text-muted">
              একবার মুছে ফেললে এই শিক্ষার্থীর সকল পরীক্ষার ফলাফল ও রেজিস্ট্রি ডাটা মুছে যাবে।
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeleteModalStudent(null)}>
                বাতিল
              </Button>
              <Button variant="dangerSolid" size="sm" onClick={handleDeleteStudent}>
                হ্যাঁ, মুছে ফেলুন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
