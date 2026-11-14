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
import { FileText, Plus, Download, Trash2, Calendar, BookOpen } from 'lucide-react';

export default function RoutineManager() {
  const { school, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const routines = TenantRepository.getRoutines(school.id);

  const [form, setForm] = useState({
    title: '',
    category: 'class_routine',
    effective_date: new Date().toISOString().slice(0, 10),
    file_size: '১.২ MB'
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    try {
      TenantRepository.createRoutine(school.id, form);
      showToast('রুটিন / সিলেবাস সফলভাবে প্রকাশিত হয়েছে!');
      setAddModalOpen(false);
      setForm({
        title: '',
        category: 'class_routine',
        effective_date: new Date().toISOString().slice(0, 10),
        file_size: '১.২ MB'
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = (id) => {
    TenantRepository.deleteRoutine(school.id, id);
    showToast('ডকুমেন্ট মুছে ফেলা হয়েছে।');
    setDeleteId(null);
  };

  const categoryMap = {
    class_routine: 'ক্লাস রুটিন',
    exam_routine: 'পরীক্ষার সময়সূচি',
    syllabus: 'সিলেবাস ও পাঠ্যক্রম',
    calendar: 'একাডেমিক ক্যালেন্ডার'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">রুটিন, সিলেবাস ও একাডেমিক ক্যালেন্ডার</h2>
          <p className="text-xs text-muted">শিক্ষার্থী ও অভিভাবকদের জন্য ডাউনলোডযোগ্য ক্লাস ও পরীক্ষার রুটিন</p>
        </div>

        {!supportMode && (
          <Button variant="primary" size="md" icon={Plus} onClick={() => setAddModalOpen(true)}>
            নতুন রুটিন যোগ করুন
          </Button>
        )}
      </div>

      <GridTable
        columns={[
          { key: 'title', label: 'শিরোনাম', width: '2.5fr' },
          { 
            key: 'category', 
            label: 'ধরন', 
            width: '150px',
            render: (val) => (
              <Badge variant="primary" symbol="●">
                {categoryMap[val] || val}
              </Badge>
            )
          },
          { key: 'effective_date', label: 'প্রকাশকাল', width: '130px', fontMono: true },
          { key: 'file_size', label: 'সাইজ', width: '90px', fontMono: true },
          { key: 'type', label: 'ফরম্যাট', width: '80px', align: 'center', fontMono: true },
          {
            key: 'id',
            label: 'অ্যাকশন',
            width: '80px',
            align: 'center',
            render: (id) => (
              !supportMode && (
                <button
                  type="button"
                  onClick={() => setDeleteId(id)}
                  className="p-1.5 rounded-lg text-danger hover:bg-danger-soft transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )
            )
          }
        ]}
        data={routines}
        zebra
      />

      {/* Add Modal */}
      {addModalOpen && (
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="নতুন রুটিন / সিলেবাস প্রকাশ করুন"
          subtitle="পিডিএফ ফাইলের বিবরণ পূরণ করুন"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <Input
              label="ফাইলের শিরোনাম"
              placeholder="e.g. বার্ষিক পরীক্ষা ২০২৬ এর সময়সূচি"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <Select
              label="ডকুমেন্টের ক্যাটাগরি"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={[
                { value: 'class_routine', label: 'সাপ্তাহিক ক্লাস রুটিন' },
                { value: 'exam_routine', label: 'পরীক্ষার সময়সূচি' },
                { value: 'syllabus', label: 'সিলেবাস ও পাঠ্যক্রম' },
                { value: 'calendar', label: 'একাডেমিক ক্যালেন্ডার ও ছুটি' }
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="কার্যকরের তারিখ"
                value={form.effective_date}
                onChange={(e) => setForm({ ...form, effective_date: e.target.value })}
              />
              <Input
                label="আনুমানিক ফাইল সাইজ"
                value={form.file_size}
                onChange={(e) => setForm({ ...form, file_size: e.target.value })}
              />
            </div>

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
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <Modal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          title="ডকুমেন্ট মুছে ফেলা নিশ্চিতকরণ"
          subtitle="আপনি কি নিশ্চিতভাবে এই রুটিনটি অপসারণ করতে চান?"
        >
          <div className="space-y-4">
            <p className="text-xs text-muted">
              অপসারণ করার পর এটি আর পাবলিক ওয়েবসাইটে প্রদর্শিত হবে না।
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setDeleteId(null)}>
                ফিরে যান
              </Button>
              <Button variant="dangerSolid" onClick={() => handleDelete(deleteId)}>
                হ্যাঁ, মুছে ফেলুন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

