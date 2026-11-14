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
import { UserCheck, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';

export default function TeacherManager() {
  const { school, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [teachers, setTeachers] = useState(() => TenantRepository.getTeachers(school.id));
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [deleteModalTeacher, setDeleteModalTeacher] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    category: 'teacher',
    designation: '',
    subject: '',
    qualification: '',
    phone: '',
    email: '',
    photo: null
  });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'নাম লেখা আবশ্যক।';
    if (!form.designation.trim()) errs.designation = 'পদবি উল্লেখ করা আবশ্যক।';
    if (form.phone && !/^01[3-9]\d{8}$/.test(form.phone.trim())) {
      errs.phone = 'মোবাইল নম্বর অবশ্যই ১১ ডিজিট (01...) হতে হবে।';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editTeacher) {
      TenantRepository.updateTeacher(school.id, editTeacher.id, form);
      showToast('শিক্ষকের তথ্য সফলভাবে হালনাগাদ করা হয়েছে!');
    } else {
      TenantRepository.addTeacher({
        school_id: school.id,
        ...form
      });
      showToast('নতুন শিক্ষক/কর্মচারী সফলভাবে যোগ করা হয়েছে!');
    }

    setTeachers(TenantRepository.getTeachers(school.id));
    setAddModalOpen(false);
    setEditTeacher(null);
    setForm({
      name: '',
      category: 'teacher',
      designation: '',
      subject: '',
      qualification: '',
      phone: '',
      email: '',
      photo: null
    });
    setFieldErrors({});
  };

  const openEdit = (t) => {
    setEditTeacher(t);
    setForm({
      name: t.name || '',
      category: t.category || 'teacher',
      designation: t.designation || '',
      subject: t.subject || '',
      qualification: t.qualification || '',
      phone: t.phone || '',
      email: t.email || '',
      photo: t.photo || null
    });
    setFieldErrors({});
    setAddModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteModalTeacher) return;
    TenantRepository.deleteTeacher(deleteModalTeacher.id, school.id);
    setTeachers(TenantRepository.getTeachers(school.id));
    showToast(`"${deleteModalTeacher.name}"-কে তালিকা থেকে অপসারণ করা হয়েছে।`);
    setDeleteModalTeacher(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">শিক্ষক ও কর্মচারী পরিষদ</h2>
          <p className="text-xs text-muted">বিদ্যালয়ের শিক্ষক ও কর্মকর্তাদের প্রোফাইল নিয়ন্ত্রণ</p>
        </div>

        {!supportMode && (
          <Button 
            variant="primary" 
            size="md" 
            icon={Plus} 
            onClick={() => {
              setEditTeacher(null);
              setForm({
                name: '',
                category: 'teacher',
                designation: '',
                subject: '',
                qualification: '',
                phone: '',
                email: '',
                photo: null
              });
              setFieldErrors({});
              setAddModalOpen(true);
            }}
          >
            নতুন শিক্ষক/কর্মচারী যোগ করুন
          </Button>
        )}
      </div>

      <GridTable
        columns={[
          { key: 'order', label: 'ক্রম', width: '60px', fontMono: true, align: 'center' },
          { 
            key: 'name', 
            label: 'নাম ও ছবি', 
            width: '2fr',
            render: (val, row) => (
              <div className="flex items-center gap-2.5">
                {row.photo ? (
                  <img src={row.photo} alt={val} className="w-8 h-8 rounded-full object-cover border border-border shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {val.split(' ').pop()?.[0] || 'শি'}
                  </div>
                )}
                <strong className="text-text">{val}</strong>
              </div>
            )
          },
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
          { key: 'phone', label: 'মোবাইল', width: '130px', fontMono: true },
          ...(!supportMode ? [{
            key: 'actions',
            label: 'কাজ',
            width: '100px',
            align: 'right',
            render: (_, row) => (
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit2}
                  className="text-muted hover:text-primary p-1.5 h-8"
                  onClick={() => openEdit(row)}
                  title="সম্পাদনা করুন"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  className="text-danger hover:bg-danger-soft p-1.5 h-8"
                  onClick={() => setDeleteModalTeacher(row)}
                  title="মুছে ফেলুন"
                />
              </div>
            )
          }] : [])
        ]}
        data={teachers}
        minWidth="800px"
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={editTeacher ? 'শিক্ষক/কর্মকর্তার তথ্য সম্পাদনা' : 'নতুন শিক্ষক বা কর্মচারী যোগ'}
        subtitle="বিদ্যালয়ের অ্যাকাডেমিক ডিরেক্টরিতে অন্তর্ভুক্তির জন্য"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <Input
              label="পূর্ণ নাম *"
              placeholder="e.g. জনাব মোহাম্মদ আমিনুল ইসলাম"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            {fieldErrors.name && (
              <p className="text-danger text-xs mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="ক্যাটাগরি"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={[
                { value: 'teacher', label: 'শিক্ষকমণ্ডলী (Teacher)' },
                { value: 'staff', label: 'কর্মচারী পরিষদ (Staff)' }
              ]}
            />

            <div>
              <Input
                label="পদবি *"
                placeholder="e.g. সহকারী শিক্ষক"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                required
              />
              {fieldErrors.designation && (
                <p className="text-danger text-xs mt-1">{fieldErrors.designation}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="পাঠদানের বিষয়"
              placeholder="e.g. ইংরেজি / গণিত"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <Input
              label="শিক্ষাগত যোগ্যতা"
              placeholder="e.g. এম.এ (ইংরেজি), বি.এড"
              value={form.qualification}
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                label="মোবাইল নম্বর"
                placeholder="018XXXXXXXX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              {fieldErrors.phone && (
                <p className="text-danger text-xs mt-1">{fieldErrors.phone}</p>
              )}
            </div>
            <Input
              label="ইমেইল অ্যাড্রেস"
              type="email"
              placeholder="teacher@school.edu.bd"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <FileUpload
            label="অফিশিয়াল পোর্ট্রেট ছবি (ঐচ্ছিক)"
            helperText="শিক্ষক পরিষদের কার্ডে প্রদর্শনের জন্য"
            type="image"
            value={form.photo}
            onChange={(val) => setForm({ ...form, photo: val })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary">
              {editTeacher ? 'হালনাগাদ করুন' : 'যোগ করুন'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* D13: Delete Teacher Confirmation Modal */}
      {deleteModalTeacher && (
        <Modal
          isOpen={!!deleteModalTeacher}
          onClose={() => setDeleteModalTeacher(null)}
          title="শিক্ষক অপসারণ নিশ্চিতকরণ"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-text leading-relaxed">
              আপনি কি নিশ্চিত যে <strong>"{deleteModalTeacher.name}"</strong> ({deleteModalTeacher.designation})-কে শিক্ষক পরিষদ থেকে অপসারণ করতে চান?
            </p>
            <p className="text-xs text-muted">
              অপসারণের পর অবশিষ্ট শিক্ষকদের ক্রমিক নম্বর স্বয়ংক্রিয়ভাবে পুনর্গঠিত (1..N) হবে।
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeleteModalTeacher(null)}>
                বাতিল
              </Button>
              <Button variant="dangerSolid" size="sm" onClick={confirmDelete}>
                হ্যাঁ, অপসারণ করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
