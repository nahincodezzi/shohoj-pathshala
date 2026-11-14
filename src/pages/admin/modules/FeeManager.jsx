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
import { CreditCard, Plus, Printer, Ban, CheckCircle2, AlertTriangle, Scissors } from 'lucide-react';

export default function FeeManager() {
  const { school, currentUser, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [voidModalReceipt, setVoidModalReceipt] = useState(null);
  const [printReceipt, setPrintReceipt] = useState(null);
  const [voidReason, setVoidReason] = useState('');

  const receipts = TenantRepository.getReceipts(school.id);
  const students = TenantRepository.getStudents(school.id);

  // Form State
  const [form, setForm] = useState({
    student_id: '',
    student_name: '',
    class: '10',
    roll: '',
    category: 'মাসিক বেতন ও পরীক্ষার ফি',
    amount: '',
    payment_method: 'ক্যাশ'
  });

  const handleStudentSelect = (studentId) => {
    const st = students.find(s => s.student_id === studentId);
    if (st) {
      setForm({
        ...form,
        student_id: st.student_id,
        student_name: st.name_bn,
        class: st.class,
        roll: st.roll
      });
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      alert('টাকার সঠিক পরিমাণ দিন।');
      return;
    }

    try {
      const newRec = TenantRepository.createReceipt(school.id, {
        ...form,
        amount: Number(form.amount)
      }, currentUser?.name || 'অফিস সহকারী');

      showToast(`রসিদ ${newRec.receipt_no} সফলভাবে তৈরি হয়েছে!`);
      setCreateModalOpen(false);
      setPrintReceipt(newRec); // Auto open print preview
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVoidSubmit = (e) => {
    e.preventDefault();
    try {
      TenantRepository.voidReceipt(school.id, voidModalReceipt.id, voidReason, currentUser?.name || 'অফিস সহকারী');
      showToast('রসিদটি সফলভাবে বাতিল (Void) করা হয়েছে!');
      setVoidModalReceipt(null);
      setVoidReason('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">ফি আদায় ও মানি রসিদ</h2>
          <p className="text-xs text-muted">২-কপি ডিজিটাল রসিদ প্রিন্ট ও অডিট ট্রেইল (কোনো রসিদ ডিলিট হয় না)</p>
        </div>

        {!supportMode && (
          <Button variant="primary" size="md" icon={Plus} onClick={() => setCreateModalOpen(true)}>
            নতুন রসিদ তৈরি করুন
          </Button>
        )}
      </div>

      <GridTable
        columns={[
          { key: 'receipt_no', label: 'রসিদ নম্বর', width: '170px', fontMono: true },
          { key: 'student_name', label: 'শিক্ষার্থীর নাম', width: '1.5fr' },
          { key: 'class', label: 'শ্রেণি', width: '70px', render: (val) => `${val}ম` },
          { key: 'roll', label: 'রোল', width: '60px', fontMono: true },
          { key: 'category', label: 'খাত', width: '1.2fr' },
          { 
            key: 'amount', 
            label: 'টাকা (৳)', 
            width: '100px', 
            align: 'right', 
            fontMono: true,
            render: (val, row) => (
              <span className={`font-bold ${row.status === 'voided' ? 'line-through text-danger' : 'text-text'}`}>
                ৳{val.toLocaleString('bn-BD')}
              </span>
            )
          },
          { key: 'payment_method', label: 'মাধ্যম', width: '90px' },
          {
            key: 'status',
            label: 'অবস্থা',
            width: '100px',
            render: (val) => (
              <Badge variant={val === 'paid' ? 'success' : 'danger'}>
                {val === 'paid' ? 'পরিশোধিত' : 'বাতিল (Void)'}
              </Badge>
            )
          },
          {
            key: 'actions',
            label: 'কাজ',
            width: '140px',
            align: 'right',
            render: (_, row) => (
              <div className="flex items-center justify-end gap-1.5">
                <Button variant="secondary" size="sm" icon={Printer} onClick={() => setPrintReceipt(row)}>
                  প্রিন্ট
                </Button>
                {row.status === 'paid' && !supportMode && (
                  <Button variant="danger" size="sm" onClick={() => setVoidModalReceipt(row)}>
                    Void
                  </Button>
                )}
              </div>
            )
          }
        ]}
        data={receipts}
        minWidth="840px"
      />

      {/* ================= CREATE RECEIPT MODAL ================= */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="নতুন ফি আদায়ের রসিদ তৈরি"
        subtitle="ছাত্র ও অফিস কপি সহ ২-পার্ট ডিজিটাল মানি রিসিট"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Select
            label="বিদ্যমান শিক্ষার্থী নির্বাচন করুন"
            value={form.student_id}
            onChange={(e) => handleStudentSelect(e.target.value)}
            options={students.map(s => ({ value: s.student_id, label: `${s.student_id} — ${s.name_bn} (${s.class}ম শ্রেণি, রোল: ${s.roll})` }))}
            placeholder="তালিকা থেকে বেছে নিন..."
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="শিক্ষার্থীর নাম"
              value={form.student_name}
              onChange={(e) => setForm({ ...form, student_name: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="শ্রেণি"
                value={form.class}
                onChange={(e) => setForm({ ...form, class: e.target.value })}
                required
              />
              <Input
                label="রোল"
                value={form.roll}
                onChange={(e) => setForm({ ...form, roll: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="ফি-এর খাত"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={[
                'মাসিক বেতন ও পরীক্ষার ফি',
                'সেশন/ভর্তি ফি',
                'প্রশংসাপত্র ও প্রত্যয়ন ফি',
                'বিলম্ব ফি',
                'বিবিধ'
              ]}
            />
            <Select
              label="পেমেন্ট মাধ্যম"
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              options={['ক্যাশ', 'বিকাশ', 'নগদ', 'রকেট', 'ব্যাংক চালান']}
            />
          </div>

          <Input
            label="টাকার পরিমাণ (টাকায়)"
            type="number"
            placeholder="e.g. 1500"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary">
              রসিদ প্রিন্ট ও সেভ করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* ================= VOID CONFIRMATION MODAL ================= */}
      {voidModalReceipt && (
        <Modal
          isOpen={!!voidModalReceipt}
          onClose={() => setVoidModalReceipt(null)}
          title="রসিদ বাতিল (Void Receipt)"
          subtitle={`রসিদ নম্বর: ${voidModalReceipt.receipt_no}`}
        >
          <form onSubmit={handleVoidSubmit} className="space-y-4">
            <div className="p-3.5 rounded-lg bg-danger-soft border border-danger/30 text-xs text-danger font-medium">
              ⚠️ রসিদটি অডিট স্বার্থে ডাটাবেজ থেকে মোছা হবে না, কিন্তু স্থায়ীভাবে বাতিল (Void) হিসেবে চিহ্নিত থাকবে।
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">বাতিলের সুনির্দিষ্ট কারণ (বাধ্যতামূলক):</label>
              <textarea
                rows={3}
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="যেমন: টাকার অঙ্কে ভুল লেখা হয়েছিল অথবা ভুল শিক্ষার্থীর নামে এন্ট্রি হয়েছিল..."
                className="w-full rounded-[10px] bg-surface-2 border border-border-strong text-text p-3 text-xs outline-none focus:border-danger"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setVoidModalReceipt(null)}>
                ফিরে যান
              </Button>
              <Button type="submit" variant="dangerSolid">
                নিশ্চিত বাতিল করুন (Void)
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= 2-PART PRINTABLE MONEY RECEIPT MODAL (Section 9) ================= */}
      {printReceipt && (
        <Modal
          isOpen={!!printReceipt}
          onClose={() => setPrintReceipt(null)}
          title="মানি রিসিট প্রিভিউ (২-কপি প্রিন্ট ফরম্যাট)"
          subtitle="A4 পৃষ্ঠায় শিক্ষার্থী কপি ও অফিস কপি পাশাপাশি"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* The 2-Part Receipt Layout */}
            <div className="p-6 bg-white text-black rounded-xl border border-slate-300 font-sans text-xs space-y-6 shadow-inner relative">
              
              {/* Void Watermark if voided */}
              {printReceipt.status === 'voided' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
                  <span className="text-7xl font-extrabold text-red-500/25 rotate-[-25deg] border-4 border-red-500/30 px-8 py-2 rounded-xl">
                    VOIDED
                  </span>
                </div>
              )}

              {/* Part 1: Student Copy */}
              <div className="space-y-3 pb-6">
                <div className="flex items-center justify-between border-b border-black pb-2">
                  <div>
                    <h3 className="font-bold text-base">{school.name_bn}</h3>
                    <p className="text-[10px] text-slate-600">EIIN: {school.eiin} • মানি রিসিট</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-slate-100 font-bold text-[11px] border border-slate-300">
                    শিক্ষার্থী কপি (Student Copy)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>রসিদ নং: <strong className="font-mono">{printReceipt.receipt_no}</strong></div>
                  <div className="text-right">তারিখ: <strong className="font-mono">{printReceipt.created_at}</strong></div>
                  <div>শিক্ষার্থী: <strong>{printReceipt.student_name}</strong></div>
                  <div className="text-right">শ্রেণি: <strong>{printReceipt.class}ম</strong> (রোল: {printReceipt.roll})</div>
                  <div>খাত: <strong>{printReceipt.category}</strong></div>
                  <div className="text-right">মাধ্যম: <strong>{printReceipt.payment_method}</strong></div>
                </div>

                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between items-center text-sm">
                  <span>মোট আদায়কৃত টাকা:</span>
                  <span className="font-mono font-bold text-base">৳{Number(printReceipt.amount).toLocaleString('bn-BD')}</span>
                </div>

                {printReceipt.status === 'voided' && (
                  <p className="text-[10px] text-red-600 font-bold">বাতিলের কারণ: {printReceipt.void_reason}</p>
                )}

                <div className="pt-4 flex justify-between items-end text-[10px] text-slate-500">
                  <span>আদায়কারী: {printReceipt.created_by}</span>
                  <span className="border-t border-slate-400 pt-1">অফিস সীল ও স্বাক্ষর</span>
                </div>
              </div>

              {/* Scissor Cut Line Divider (Section 9 Requirement) */}
              <div className="relative border-t-2 border-dashed border-slate-400 my-4 flex items-center justify-center">
                <span className="absolute bg-white px-3 text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                  <Scissors className="w-3.5 h-3.5" /> এখান থেকে কেটে আলাদা করুন
                </span>
              </div>

              {/* Part 2: Office Copy */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-black pb-2">
                  <div>
                    <h3 className="font-bold text-base">{school.name_bn}</h3>
                    <p className="text-[10px] text-slate-600">EIIN: {school.eiin} • মানি রিসিট</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-slate-100 font-bold text-[11px] border border-slate-300">
                    অফিস কপি (Office Copy)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>রসিদ নং: <strong className="font-mono">{printReceipt.receipt_no}</strong></div>
                  <div className="text-right">তারিখ: <strong className="font-mono">{printReceipt.created_at}</strong></div>
                  <div>শিক্ষার্থী: <strong>{printReceipt.student_name}</strong></div>
                  <div className="text-right">শ্রেণি: <strong>{printReceipt.class}ম</strong> (রোল: {printReceipt.roll})</div>
                  <div>খাত: <strong>{printReceipt.category}</strong></div>
                  <div className="text-right">মাধ্যম: <strong>{printReceipt.payment_method}</strong></div>
                </div>

                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between items-center text-sm">
                  <span>মোট আদায়কৃত টাকা:</span>
                  <span className="font-mono font-bold text-base">৳{Number(printReceipt.amount).toLocaleString('bn-BD')}</span>
                </div>

                <div className="pt-4 flex justify-between items-end text-[10px] text-slate-500">
                  <span>হিসাবরক্ষক স্বাক্ষর</span>
                  <span className="border-t border-slate-400 pt-1">প্রধান শিক্ষকের অনুমোদন</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="secondary" size="sm" onClick={() => setPrintReceipt(null)}>
                বন্ধ করুন
              </Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                প্রিন্ট করুন (A4)
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

