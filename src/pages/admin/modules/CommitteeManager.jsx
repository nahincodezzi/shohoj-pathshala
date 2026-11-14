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
import { Users, Plus, Phone, Trash2, Award, Shield } from 'lucide-react';

export default function CommitteeManager() {
  const { school, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const committee = TenantRepository.getCommittee(school.id);

  const [form, setForm] = useState({
    name: '',
    designation: '',
    role_category: 'অভিভাবক প্রতিনিধি',
    phone: '',
    status: 'active'
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    try {
      TenantRepository.createCommitteeMember(school.id, form);
      showToast('পরিচালনা পর্ষদের সদস্য সফলভাবে যুক্ত করা হয়েছে!');
      setAddModalOpen(false);
      setForm({
        name: '',
        designation: '',
        role_category: 'অভিভাবক প্রতিনিধি',
        phone: '',
        status: 'active'
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = (id) => {
    TenantRepository.deleteCommitteeMember(school.id, id);
    showToast('সদস্য অপসারিত হয়েছে।');
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">পরিচালনা পর্ষদ ও ম্যানেজিং কমিটি</h2>
          <p className="text-xs text-muted">বিদ্যালয়ের সভাপতি, শিক্ষক ও অভিভাবক প্রতিনিধিবৃন্দের তালিকা</p>
        </div>

        {!supportMode && (
          <Button variant="primary" size="md" icon={Plus} onClick={() => setAddModalOpen(true)}>
            নতুন সদস্য যোগ করুন
          </Button>
        )}
      </div>

      {/* GridTable */}
      <GridTable
        columns={[
          { key: 'order', label: 'ক্রম', width: '60px', fontMono: true },
          { key: 'name', label: 'সদস্যের নাম', width: '2fr' },
          { key: 'designation', label: 'পদবী', width: '1.5fr' },
          { key: 'role_category', label: 'প্রতিনিধিত্বের ধরন', width: '1.5fr' },
          { key: 'phone', label: 'মোবাইল নম্বর', width: '140px', fontMono: true },
          {
            key: 'status',
            label: 'অবস্থা',
            width: '90px',
            render: (val) => (
              <Badge variant={val === 'active' ? 'success' : 'muted'} symbol="●">
                {val === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
              </Badge>
            )
          },
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
        data={committee}
        zebra
      />

      {/* Add Member Modal */}
      {addModalOpen && (
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="পরিচালনা পর্ষদের নতুন সদস্য যুক্ত করুন"
          subtitle="ম্যানেজিং কমিটির তথ্যাবলী পূরণ করুন"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <Input
              label="সদস্যের নাম"
              placeholder="e.g. জনাব মো. রফিকুল ইসলাম"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="পদবী"
              placeholder="e.g. সভাপতি / সহ-সভাপতি / অভিভাবক সদস্য"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              required
            />
            <Select
              label="প্রতিনিধিত্বের ক্যাটাগরি"
              value={form.role_category}
              onChange={(e) => setForm({ ...form, role_category: e.target.value })}
              options={[
                'সভাপতি, পরিচালনা পর্ষদ',
                'সহ-সভাপতি',
                'প্রধান শিক্ষক (সদস্য-সচিব)',
                'অভিভাবক প্রতিনিধি',
                'শিক্ষক প্রতিনিধি',
                'দাতা সদস্য',
                'বিদ্যোৎসাহী সদস্য'
              ]}
            />
            <Input
              label="যোগাযোগের মোবাইল নম্বর"
              placeholder="018XXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

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
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <Modal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          title="সদস্য অপসারণ নিশ্চিতকরণ"
          subtitle="আপনি কি নিশ্চিতভাবে এই সদস্যকে তালিকা থেকে মুছে ফেলতে চান?"
        >
          <div className="space-y-4">
            <p className="text-xs text-muted">
              এই সদস্যকে মুছে ফেললে তিনি আর ওয়েবসাইটের পরিচালনা পর্ষদ সেকশনে প্রদর্শিত হবেন না।
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setDeleteId(null)}>
                ফিরে যান
              </Button>
              <Button variant="dangerSolid" onClick={() => handleDelete(deleteId)}>
                হ্যাঁ, অপসারণ করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

