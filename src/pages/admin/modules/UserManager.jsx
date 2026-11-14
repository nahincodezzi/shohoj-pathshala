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
import { ShieldCheck, Plus, AlertTriangle, KeyRound, RotateCcw } from 'lucide-react';

export default function UserManager() {
  const { school, currentUser, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [resetError, setResetError] = useState('');

  const users = TenantRepository.getUsers(school.id);

  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    password: '',
    role: 'teacher'
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    const existing = TenantRepository.getUsers(school.id);
    if (existing.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      showToast(`"${newUser.username}" ইউজারনেম ইতোমধ্যে বিদ্যমান রয়েছে।`, 'error');
      return;
    }

    const created = {
      id: `usr_${Date.now()}`,
      school_id: school.id,
      username: newUser.username,
      name: newUser.name,
      password: newUser.password,
      role: newUser.role,
      active: true,
      failed_attempts: 0,
      locked_until: null,
      must_change_password: false
    };

    const allUsers = TenantRepository.getUsers(null).concat(TenantRepository.getUsers(school.id)); // get all
    const raw = JSON.parse(localStorage.getItem('sp_tenant_users') || '[]');
    raw.push(created);
    localStorage.setItem('sp_tenant_users', JSON.stringify(raw));

    showToast(`ইউজার "${created.username}" সফলভাবে তৈরি হয়েছে!`);
    setAddModalOpen(false);
  };

  const handleFactoryReset = (e) => {
    e.preventDefault();
    setResetError('');

    try {
      TenantRepository.factoryResetSchool(school.id, resetCode);
      showToast('স্কুলের ডেটা সফলভাবে ফ্যাক্টরি রিসেট করা হয়েছে!');
      setResetModalOpen(false);
      setResetCode('');
      window.location.reload();
    } catch (err) {
      setResetError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">ইউজার ও নিরাপত্তা ব্যবস্থাপনা</h2>
          <p className="text-xs text-muted">স্কুল অ্যাডমিন, শিক্ষক ও কর্মচারীদের ভূমিকা এবং প্রবেশাধিকার</p>
        </div>

        {!supportMode && (
          <Button variant="primary" size="md" icon={Plus} onClick={() => setAddModalOpen(true)}>
            নতুন ইউজার তৈরি করুন
          </Button>
        )}
      </div>

      <GridTable
        columns={[
          { key: 'username', label: 'ইউজারনেম', width: '130px', fontMono: true },
          { key: 'name', label: 'ব্যবহারকারীর নাম', width: '2fr' },
          { 
            key: 'role', 
            label: 'রোল (পদমর্যাদা)', 
            width: '150px',
            render: (val) => (
              <Badge variant={val === 'school_superadmin' ? 'indigo' : val === 'headmaster' ? 'primary' : 'muted'}>
                {val}
              </Badge>
            )
          },
          {
            key: 'active',
            label: 'অ্যাকাউন্ট স্ট্যাটাস',
            width: '120px',
            render: (val, row) => (
              <Badge variant={row.locked_until ? 'danger' : val ? 'success' : 'muted'}>
                {row.locked_until ? 'লকড (১৫ মিনিট)' : val ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
              </Badge>
            )
          }
        ]}
        data={users}
        minWidth="620px"
      />

      {/* Danger Zone: School-level Factory Reset */}
      {currentUser?.role === 'school_superadmin' && !supportMode && (
        <Card surface="surface" className="border-2 border-danger/40 bg-danger-soft/10 p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-danger-soft text-danger flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-danger">বিপজ্জনক জোন — ফ্যাক্টরি রিসেট (Factory Reset)</h3>
              <p className="text-xs text-muted leading-relaxed mt-1">
                এই স্কুলের সকল শিক্ষার্থী, রসিদ, রেজাল্ট, ভর্তি আবেদন ও নোটিশ মুছে ফ্যাক্টরি ডিফল্ট অবস্থায় ফিরিয়ে আনবে। <strong>অন্য কোনো স্কুলের ডেটাতে এর কোনো প্রভাব পড়বে না।</strong>
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="danger" size="md" onClick={() => setResetModalOpen(true)}>
              ফ্যাক্টরি রিসেট শুরু করুন...
            </Button>
          </div>
        </Card>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="নতুন ইউজার তৈরি"
        subtitle="স্কুলের অনুমোদিত কর্মীদের জন্য রোলভিত্তিক অ্যাকাউন্ট"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <Input
            label="ইউজারনেম (Login Username)"
            placeholder="e.g. teacher_science"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            required
          />
          <Input
            label="পূর্ণ নাম"
            placeholder="e.g. মোঃ নাঈম আহমেদ"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <Select
            label="রোল (Role & Permissions)"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            options={[
              { value: 'headmaster', label: 'ভারপ্রাপ্ত প্রধান শিক্ষক (Headmaster)' },
              { value: 'asst_headmaster', label: 'ভারপ্রাপ্ত সহ-প্রধান শিক্ষক' },
              { value: 'teacher', label: 'সহকারী শিক্ষক (Teacher)' },
              { value: 'office_assistant', label: 'অফিস সহকারী (Office Assistant)' }
            ]}
          />
          <Input
            label="পাসওয়ার্ড"
            type="password"
            placeholder="নিরাপদ পাসওয়ার্ড দিন"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary">
              ইউজার তৈরি করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* Factory Reset Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="ফ্যাক্টরি রিসেট নিশ্চিতকরণ"
        subtitle={`স্কুল: ${school.name_bn}`}
      >
        <form onSubmit={handleFactoryReset} className="space-y-4">
          <div className="p-3.5 rounded-lg bg-danger text-white text-xs font-semibold">
            সতর্কতা: নিশ্চিত করতে নিচের বক্সে বড় হাতের অক্ষরে "RESET" লিখুন।
          </div>

          {resetError && (
            <div className="p-2.5 rounded bg-danger-soft text-danger text-xs font-bold">
              {resetError}
            </div>
          )}

          <Input
            label='নিশ্চিতকরণ কোড ("RESET" টাইপ করুন):'
            placeholder="RESET"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setResetModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="dangerSolid">
              স্থায়ীভাবে রিসেট করুন
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

