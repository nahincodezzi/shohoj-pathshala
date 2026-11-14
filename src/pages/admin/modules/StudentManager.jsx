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
import { useToast } from '../../../components/ui/ToastContext';
import { 
  Users, 
  Plus, 
  Search, 
  CreditCard, 
  Printer, 
  GraduationCap, 
  CheckCircle2, 
  Download 
} from 'lucide-react';

export default function StudentManager() {
  const { school, currentUser, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [classFilter, setClassFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [idCardStudent, setIdCardStudent] = useState(null);

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
    address: ''
  });
  const [formError, setFormError] = useState('');

  const students = TenantRepository.getStudents(school.id);

  const filteredStudents = students.filter(s => {
    if (classFilter !== 'all' && s.class !== classFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.name_bn.toLowerCase().includes(q) ||
        s.student_id.toLowerCase().includes(q) ||
        String(s.roll) === q
      );
    }
    return true;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    try {
      TenantRepository.createStudent(school.id, form);
      showToast('শিক্ষার্থী সফলভাবে নিবন্ধিত হয়েছে!');
      setAddModalOpen(false);
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
        address: ''
      });
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">শিক্ষার্থী ব্যবস্থাপনা</h2>
          <p className="text-xs text-muted">শ্রেণিভিত্তিক রোল ও শিক্ষার্থী প্রোফাইল ডিরেক্টরি</p>
        </div>

        {!supportMode && (
          <Button variant="primary" size="md" icon={Plus} onClick={() => setAddModalOpen(true)}>
            নতুন শিক্ষার্থী যোগ করুন
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <Card surface="surface" className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', '6', '7', '8', '9', '10'].map(cls => (
            <button
              key={cls}
              type="button"
              onClick={() => setClassFilter(cls)}
              className={`h-9 px-3.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                classFilter === cls
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-2 text-muted hover:text-text'
              }`}
            >
              {cls === 'all' ? 'সব শ্রেণি' : `${cls}ম শ্রেণি`}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="নাম বা রোল দিয়ে খুঁজুন..."
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
          { key: 'roll', label: 'রোল', width: '70px', fontMono: true, align: 'center' },
          { key: 'name_bn', label: 'শিক্ষার্থীর নাম', width: '2fr' },
          { key: 'class', label: 'শ্রেণি', width: '80px', render: (val) => `${val}ম` },
          { key: 'group', label: 'বিভাগ', width: '100px' },
          { key: 'mobile', label: 'মোবাইল', width: '120px', fontMono: true },
          {
            key: 'action',
            label: 'আইডি কার্ড',
            width: '100px',
            align: 'center',
            render: (_, row) => (
              <Button 
                variant="secondary" 
                size="sm" 
                icon={CreditCard}
                onClick={() => setIdCardStudent(row)}
              >
                কার্ড
              </Button>
            )
          }
        ]}
        data={filteredStudents}
        minWidth="680px"
      />

      {/* ================= ADD STUDENT MODAL ================= */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="নতুন শিক্ষার্থী ভর্তি / রেজিস্ট্রেশন"
        subtitle="বিদ্যালয়ের নির্দিষ্ট শ্রেণিতে রোল বরাদ্দ"
      >
        {formError && (
          <div className="p-3 mb-4 rounded-lg bg-danger-soft text-danger text-xs font-semibold border border-danger/30">
            {formError}
          </div>
        )}

        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="শিক্ষার্থীর নাম (বাংলা)"
              placeholder="e.g. মোঃ মাহিন ইসলাম"
              value={form.name_bn}
              onChange={(e) => setForm({ ...form, name_bn: e.target.value })}
              required
            />
            <Input
              label="Student Name (English)"
              placeholder="e.g. Md. Mahin Islam"
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="শ্রেণি"
              value={form.class}
              onChange={(e) => setForm({ ...form, class: e.target.value })}
              options={['6', '7', '8', '9', '10'].map(c => ({ value: c, label: `${c}ম শ্রেণি` }))}
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
            <Input
              label="শ্রেণি রোল নম্বর"
              type="number"
              placeholder="1"
              value={form.roll}
              onChange={(e) => setForm({ ...form, roll: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="পিতার নাম"
              value={form.father_name}
              onChange={(e) => setForm({ ...form, father_name: e.target.value })}
              required
            />
            <Input
              label="মাতার নাম"
              value={form.mother_name}
              onChange={(e) => setForm({ ...form, mother_name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="মোবাইল নম্বর"
              placeholder="018XXXXXXXX"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              required
            />
            <Input
              label="জন্ম তারিখ"
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              required
            />
          </div>

          <Input
            label="ঠিকানা"
            placeholder="গ্রাম, উপজেলা, জেলা"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary">
              শিক্ষার্থী সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* ================= DIGITAL STUDENT ID CARD MODAL ================= */}
      {idCardStudent && (
        <Modal
          isOpen={!!idCardStudent}
          onClose={() => setIdCardStudent(null)}
          title="ডিজিটাল স্টুডেন্ট আইডি কার্ড"
          subtitle="প্রিন্টযোগ্য অফিসিয়াল লেমিনেটেড কার্ড"
        >
          <div className="p-4 flex flex-col items-center">
            {/* ID Card Box (Official Format) */}
            <div className="w-[320px] rounded-2xl border-2 border-primary/40 bg-surface text-text p-5 shadow-xl text-center space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-primary" />
              
              <div>
                <h4 className="text-sm font-heading font-bold leading-tight">{school.name_bn}</h4>
                <p className="text-[10px] text-muted font-mono">EIIN: {school.eiin} • {school.district}</p>
              </div>

              {/* Student Avatar */}
              <div className="w-20 h-20 rounded-full border-2 border-primary mx-auto bg-surface-2 flex items-center justify-center text-primary font-bold text-xl shadow-inner">
                {idCardStudent.name_bn.split(' ').pop()?.[0] || 'ছাত্র'}
              </div>

              <div>
                <h5 className="text-base font-heading font-bold text-text">{idCardStudent.name_bn}</h5>
                <p className="text-xs font-mono text-primary font-semibold">{idCardStudent.student_id}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-left p-3 rounded-xl bg-surface-2 border border-border">
                <div>
                  <span className="text-muted block text-[10px]">শ্রেণি</span>
                  <span className="font-bold">{idCardStudent.class}ম শ্রেণি</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">রোল নম্বর</span>
                  <span className="font-bold font-mono">{idCardStudent.roll}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">বিভাগ</span>
                  <span>{idCardStudent.group}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">জরুরি ফোন</span>
                  <span className="font-mono">{idCardStudent.mobile}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[9px] text-muted border-t border-border/80">
                <span>মেয়াদ: ৩১ ডিসেম্বর ২০২৬</span>
                <span className="font-bold text-text">ভারপ্রাপ্ত প্রধান শিক্ষক</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={() => setIdCardStudent(null)}>
                বন্ধ করুন
              </Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                প্রিন্ট করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

