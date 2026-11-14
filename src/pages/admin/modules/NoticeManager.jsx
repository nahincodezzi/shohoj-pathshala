import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TenantRepository } from '../../../services/tenantStorage';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';
import Badge from '../../../components/ui/Badge';
import GridTable from '../../../components/ui/GridTable';
import Modal from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/ToastContext';
import { Bell, Plus, AlertCircle } from 'lucide-react';

export default function NoticeManager() {
  const { school, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const notices = TenantRepository.getNotices(school.id);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'academic',
    is_urgent: false
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const existing = TenantRepository.getNotices(school.id);
    const newNotice = {
      id: `not_${Date.now()}`,
      school_id: school.id,
      date: new Date().toISOString().split('T')[0],
      published: true,
      ...form
    };
    existing.unshift(newNotice);
    localStorage.setItem(`sp_tenant_notices`, JSON.stringify(existing));

    showToast('নোটিশ সফলভাবে প্রকাশিত হয়েছে!');
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">নোটিশ বোর্ড নিয়ন্ত্রণ</h2>
          <p className="text-xs text-muted">সাধারণ ও জরুরি নোটিশ প্রকাশনা ও পরিচালনা</p>
        </div>

        {!supportMode && (
          <Button variant="primary" size="md" icon={Plus} onClick={() => setAddModalOpen(true)}>
            নতুন নোটিশ প্রকাশ করুন
          </Button>
        )}
      </div>

      <GridTable
        columns={[
          { key: 'date', label: 'তারিখ', width: '100px', fontMono: true },
          { key: 'title', label: 'শিরোনাম', width: '2fr' },
          { 
            key: 'category', 
            label: 'ক্যাটাগরি', 
            width: '100px',
            render: (val) => (
              <Badge variant={val === 'exam' ? 'info' : val === 'admission' ? 'primary' : 'muted'}>
                {val}
              </Badge>
            )
          },
          {
            key: 'is_urgent',
            label: 'টিকার অবস্থা',
            width: '120px',
            render: (val) => (
              val ? <Badge variant="accent">জরুরি টিকার</Badge> : <span className="text-xs text-muted">সাধারণ</span>
            )
          },
          {
            key: 'published',
            label: 'অবস্থা',
            width: '100px',
            render: (val) => (
              <Badge variant={val ? 'success' : 'muted'}>
                {val ? 'প্রকাশিত' : 'খসড়া'}
              </Badge>
            )
          }
        ]}
        data={notices}
        minWidth="640px"
      />

      {/* Add Notice Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="নতুন প্রাতিষ্ঠানিক নোটিশ প্রকাশ"
        subtitle="বিদ্যালয়ের নোটিশ বোর্ড ও জরুরি টিকারে প্রদর্শনের জন্য"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="নোটিশের শিরোনাম"
            placeholder="e.g. বার্ষিক পরীক্ষা ২০২৬ এর সূচি প্রকাশ"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <Select
            label="ক্যাটাগরি"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={[
              { value: 'exam', label: 'পরীক্ষা (Exam)' },
              { value: 'admission', label: 'ভর্তি (Admission)' },
              { value: 'academic', label: 'একাডেমিক (Academic)' },
              { value: 'general', label: 'সাধারণ (General)' }
            ]}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text">বিস্তারিত বিবরণ</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-[10px] bg-surface-2 border border-border-strong text-text p-3 text-xs outline-none focus:border-primary"
              placeholder="নোটিশের পূর্ণাঙ্গ বিবরণ লিখুন..."
              required
            />
          </div>

          <Checkbox
            label="জরুরি নোটিশ হিসেবে হেডার টিকারে দেখান (Urgent Ticker)"
            description="টিকারে লাল/হলুদ সতর্কবার্তার মতো স্ক্রল করবে।"
            checked={form.is_urgent}
            onChange={(e) => setForm({ ...form, is_urgent: e.target.checked })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary">
              প্রকাশ করুন
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
