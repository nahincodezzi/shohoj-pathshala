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
import { UserCheck, Plus, Phone, Mail, Award } from 'lucide-react';

export default function TeacherManager() {
  const { school, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const teachers = TenantRepository.getTeachers(school.id);

  const [form, setForm] = useState({
    name: '',
    category: 'teacher',
    designation: '',
    subject: '',
    qualification: '',
    phone: '',
    email: ''
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const existing = TenantRepository.getTeachers(school.id);
    const newTeacher = {
      id: `tch_${Date.now()}`,
      school_id: school.id,
      order: existing.length + 1,
      ...form
    };
    existing.push(newTeacher);
    localStorage.setItem(`sp_tenant_teachers`, JSON.stringify(existing));

    showToast('নতুন শিক্ষক/কর্মচারী সফলভাবে যোগ করা হয়েছে!');
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">শিক্ষক ও কর্মচারী পরিষদ</h2>
          <p className="text-xs text-muted">বিদ্যালয়ের শিক্ষক ও কর্মকর্তাদের প্রোফাইল নিয়ন্ত্রণ</p>
        </div>

        {!supportMode && (
          <Button variant="primary" size="md" icon={Plus} onClick={() => setAddModalOpen(true)}>
            নতুন শিক্ষক/কর্মচারী যোগ করুন
          </Button>
        )}
      </div>

      <GridTable
        columns={[
          { key: 'order', label: 'ক্রম', width: '60px', fontMono: true, align: 'center' },
          { key: 'name', label: 'নাম', width: '2fr' },
          { 
            key: 'category', 
            label: 'বিভাগ', 
            width: '100px',
            render: (val) => (
              <Badge variant={val === 'teacher' ? 'primary' : 'muted'}>
                {val === 'teacher' ? 'শিক্ষক' : 'কর্মচারী'}
              </Badge>
            )
          },
          { key: 'designation', label: 'পদবি', width: '1.5fr' },
          { key: 'subject', label: 'বিষয়', width: '1.2fr' },
          { key: 'phone', label: 'মোবাইল', width: '120px', fontMono: true }
        ]}
        data={teachers}
        minWidth="680px"
      />

      {/* Add Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="নতুন শিক্ষক বা কর্মচারী যোগ"
        subtitle="বিদ্যালয়ের অ্যাকাডেমিক ডিরেক্টরিতে অন্তর্ভুক্তির জন্য"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="পূর্ণ নাম"
            placeholder="e.g. জনাব মোহাম্মদ আমিনুল ইসলাম"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="ক্যাটাগরি"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={[
                { value: 'teacher', label: 'শিক্ষক (Teacher)' },
                { value: 'staff', label: 'কর্মচারী (Staff)' }
              ]}
            />
            <Input
              label="পদবি (Designation)"
              placeholder="e.g. সহকারী শিক্ষক"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="পাঠদানের বিষয়"
              placeholder="e.g. গণিত"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <Input
              label="শিক্ষাগত যোগ্যতা"
              placeholder="e.g. বি.এসসি, এম.এসসি, বি.এড"
              value={form.qualification}
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="মোবাইল নম্বর"
              placeholder="018XXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <Input
              label="ইমেইল"
              type="email"
              placeholder="email@school.edu.bd"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary">
              সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
