import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">শিক্ষার্থী রেজিস্ট্রি ও রোল বরাদ্দ</h2>
          <p className="text-xs text-muted">শ্রেণিভিত্তিক শিক্ষার্থী ডাটাবেস, আইডি কার্ড ও এনরোলমেন্ট</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md" icon={Download} onClick={handleExportCsv}>
            CSV এক্সপোর্ট
          </Button>
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
          { key: 'student_id', label: 'আইডি নম্বর', width: '130px', fontMono: true },
          { key: 'roll', label: 'রোল', width: '70px', fontMono: true, align: 'center', render: (val) => toBengaliNumber(val) },
          { 
            key: 'name_bn', 
            label: 'শিক্ষার্থীর নাম', 
            width: '2fr',
            render: (val, row) => (
              <div className="flex items-center gap-2.5">
                {row.photo ? (
                  <img src={row.photo} alt={val} className="w-8 h-8 rounded-full object-cover border border-border shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {val.split(' ').pop()?.[0] || 'ছাত্র'}
                  </div>
                )}
                <div>
                  <strong className="text-text block">{val}</strong>
                  <span className="text-[10px] text-muted font-mono">{row.name_en || '—'}</span>
                </div>
              </div>
            )
          },
          { key: 'class', label: 'শ্রেণি', width: '90px', render: (val) => toBengaliOrdinal(val) },
          { key: 'group', label: 'বিভাগ', width: '100px' },
          { key: 'mobile', label: 'মোবাইল', width: '120px', fontMono: true },
          {
            key: 'action',
            label: 'অ্যাকশন',
            width: '150px',
            align: 'right',
            render: (_, row) => (
              <div className="flex items-center justify-end gap-1.5">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  icon={CreditCard}
                  onClick={() => setIdCardStudent(row)}
                  title="আইডি কার্ড"
                  className="px-2.5 h-8 text-xs"
                >
                  কার্ড
                </Button>
                {!supportMode && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon={Edit2}
                      onClick={() => openEdit(row)}
                      title="সম্পাদনা করুন"
                      className="p-1.5 h-8 text-muted hover:text-primary"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon={Trash2}
                      onClick={() => setDeleteModalStudent(row)}
                      title="মুছে ফেলুন"
                      className="p-1.5 h-8 text-muted hover:text-danger hover:bg-danger-soft"
                    />
                  </>
                )}
              </div>
            )
          }
        ]}
        data={filteredStudents}
        minWidth="760px"
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
