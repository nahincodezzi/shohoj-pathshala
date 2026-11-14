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
import FileUpload from '../../../components/ui/FileUpload';
import { useToast } from '../../../components/ui/ToastContext';
import { Bell, Plus, AlertCircle, Paperclip, FileText, Download, Trash2, Edit2 } from 'lucide-react';

export default function NoticeManager() {
  const { school, currentUser, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalNotice, setDeleteModalNotice] = useState(null);
  const [editNotice, setEditNotice] = useState(null);
  const [errors, setErrors] = useState({});

  const notices = TenantRepository.getNotices(school.id);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'academic',
    is_urgent: false,
    attachment: null
  });

  const categoryMap = {
    exam: { label: 'পরীক্ষা', variant: 'warning' },
    admission: { label: 'ভর্তি', variant: 'primary' },
    academic: { label: 'একাডেমিক', variant: 'info' },
    general: { label: 'সাধারণ', variant: 'muted' }
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'নোটিশের শিরোনাম লেখা বাধ্যতামূলক।';
    if (!form.description.trim()) errs.description = 'নোটিশের বিবরণ লেখা বাধ্যতামূলক।';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editNotice) {
      TenantRepository.updateNotice(school.id, editNotice.id, form, currentUser?.name);
      showToast('নোটিশ সফলভাবে হালনাগাদ করা হয়েছে!');
    } else {
      // D04: Safely saves to multi-tenant notices table
      TenantRepository.createNotice(school.id, form, currentUser?.name);
      showToast('নোটিশ সফলভাবে প্রকাশিত হয়েছে!');
    }

    setAddModalOpen(false);
    setEditNotice(null);
    setForm({
      title: '',
      description: '',
      category: 'academic',
      is_urgent: false,
      attachment: null
    });
    setErrors({});
  };

  const handleDeleteNotice = () => {
    if (!deleteModalNotice) return;
    TenantRepository.deleteNotice(school.id, deleteModalNotice.id, currentUser?.name);
    showToast('নোটিশ সফলভাবে মুছে ফেলা হয়েছে!');
    setDeleteModalNotice(null);
  };

  const openEdit = (n) => {
    setEditNotice(n);
    setForm({
      title: n.title,
      description: n.description,
      category: n.category || 'academic',
      is_urgent: Boolean(n.is_urgent),
      attachment: n.attachment || null
    });
    setAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">নোটিশ বোর্ড নিয়ন্ত্রণ</h2>
          <p className="text-xs text-muted">সাধারণ ও জরুরি নোটিশ প্রকাশনা, সম্পাদনা ও পরিচালনা</p>
        </div>

        {!supportMode && (
          <Button 
            variant="primary" 
            size="md" 
            icon={Plus} 
            onClick={() => {
              setEditNotice(null);
              setForm({ title: '', description: '', category: 'academic', is_urgent: false, attachment: null });
              setErrors({});
              setAddModalOpen(true);
            }}
          >
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
            render: (val) => {
              const cat = categoryMap[val] || { label: val, variant: 'muted' };
              return (
                <Badge variant={cat.variant}>
                  {cat.label}
                </Badge>
              );
            }
          },
          {
            key: 'attachment',
            label: 'সংযুক্তি',
            width: '100px',
            render: (val) => (
              val ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-full">
                  <Paperclip className="w-3 h-3" /> ফাইল
                </span>
              ) : (
                <span className="text-xs text-muted">—</span>
              )
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
            key: 'actions',
            label: 'অ্যাকশন',
            width: '110px',
            align: 'right',
            render: (_, row) => (
              !supportMode ? (
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit2}
                    title="সম্পাদনা করুন"
                    onClick={() => openEdit(row)}
                    className="p-1.5 h-8 text-muted hover:text-primary"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    title="মুছে ফেলুন"
                    onClick={() => setDeleteModalNotice(row)}
                    className="p-1.5 h-8 text-muted hover:text-danger hover:bg-danger-soft"
                  />
                </div>
              ) : (
                <span className="text-xs text-muted">ভিউ অনলি</span>
              )
            )
          }
        ]}
        data={notices}
        minWidth="760px"
      />

      {/* Add / Edit Notice Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={editNotice ? 'নোটিশ সম্পাদনা' : 'নতুন প্রাতিষ্ঠানিক নোটিশ প্রকাশ'}
        subtitle="বিদ্যালয়ের নোটিশ বোর্ড ও জরুরি টিকারে প্রদর্শনের জন্য"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <Input
              label="নোটিশের শিরোনাম *"
              placeholder="যেমন: বার্ষিক পরীক্ষা ২০২৬ এর সূচি প্রকাশ"
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              required
            />
            {errors.title && (
              <p className="text-danger text-xs mt-1">{errors.title}</p>
            )}
          </div>

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
            <label className="text-xs font-medium text-text">বিস্তারিত বিবরণ *</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              className="w-full rounded-[10px] bg-surface-2 border border-border-strong text-text p-3 text-xs outline-none focus:border-primary"
              placeholder="নোটিশের পূর্ণাঙ্গ বিবরণ লিখুন..."
              required
            />
            {errors.description && (
              <p className="text-danger text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <FileUpload
            label="নোটিশের সংযুক্তি / ফাইল (ঐচ্ছিক)"
            helperText="PDF, DOC, DOCX অথবা নোটিশের ছবি আপলোড করুন"
            type="file"
            accept=".pdf,image/*,.doc,.docx"
            value={form.attachment?.dataUrl || form.attachment}
            onChange={(val, meta) => setForm({ 
              ...form, 
              attachment: val ? { dataUrl: val, name: meta?.name || 'Notice_Attachment.pdf', type: meta?.type || 'application/pdf' } : null 
            })}
          />

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
              {editNotice ? 'হালনাগাদ করুন' : 'প্রকাশ করুন'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* D13: Delete Notice Confirmation Modal */}
      {deleteModalNotice && (
        <Modal
          isOpen={!!deleteModalNotice}
          onClose={() => setDeleteModalNotice(null)}
          title="নোটিশ ডিলিট নিশ্চিতকরণ"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-text leading-relaxed">
              আপনি কি নিশ্চিত যে <strong>"{deleteModalNotice.title}"</strong> নোটিশটি মুছে ফেলতে চান?
            </p>
            <p className="text-xs text-muted">
              একবার মুছে ফেললে এটি পাবলিক ওয়েবসাইট এবং আর্কাইভ থেকে সম্পূর্ণ অপসারিত হবে।
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeleteModalNotice(null)}>
                বাতিল
              </Button>
              <Button variant="dangerSolid" size="sm" onClick={handleDeleteNotice}>
                হ্যাঁ, মুছে ফেলুন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
