import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TenantRepository, hashPassword } from '../../../services/tenantStorage';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import GridTable from '../../../components/ui/GridTable';
import Modal from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/ToastContext';
import { ShieldCheck, Plus, AlertTriangle, KeyRound, RotateCcw, Trash2, Power } from 'lucide-react';

export default function UserManager() {
  const { school, currentUser, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [resetError, setResetError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const [users, setUsers] = useState(() => TenantRepository.getUsers(school.id));

  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    password: '',
    role: 'teacher'
  });

  const roleLabels = {
    school_superadmin: 'সুপার অ্যাডমিন',
    headmaster: 'প্রধান শিক্ষক',
    asst_headmaster: 'সহকারী প্রধান শিক্ষক',
    teacher: 'সহকারী শিক্ষক',
    office_assistant: 'অফিস সহকারী'
  };

  const validate = () => {
    const errs = {};
    if (!newUser.username.trim()) errs.username = 'ইউজারনেম দেওয়া আবশ্যক।';
    if (!newUser.name.trim()) errs.name = 'ব্যবহারকারীর নাম লেখা আবশ্যক।';
    
    // D19: Password strength check
    if (!newUser.password || newUser.password.length < 6 || !/(?=.*[A-Za-z])(?=.*\d)/.test(newUser.password)) {
      errs.password = 'পাসওয়ার্ডে কমপক্ষে ৬টি অক্ষর, যার মধ্যে অন্তত ১টি বর্ণ এবং ১টি সংখ্যা থাকা আবশ্যক।';
    }

    const existing = TenantRepository.getUsers(school.id);
    if (existing.some(u => u.username.toLowerCase() === newUser.username.trim().toLowerCase())) {
      errs.username = `"${newUser.username}" ইউজারনেমটি ইতোমধ্যে ব্যবহৃত হচ্ছে।`;
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // D05: Hashed password
    const created = {
      id: `usr_${Date.now()}`,
      school_id: school.id,
      username: newUser.username.trim().toLowerCase(),
      name: newUser.name.trim(),
      password: hashPassword(newUser.password),
      role: newUser.role,
      active: true,
      failed_attempts: 0,
      locked_until: null,
      must_change_password: false
    };

    const raw = JSON.parse(localStorage.getItem('sp_tenant_users') || '[]');
    raw.push(created);
    localStorage.setItem('sp_tenant_users', JSON.stringify(raw));

    setUsers(TenantRepository.getUsers(school.id));
    showToast(`ইউজার "${created.username}" সফলভাবে তৈরি হয়েছে!`);
    setAddModalOpen(false);
    setNewUser({ username: '', name: '', password: '', role: 'teacher' });
    setFormErrors({});
  };

  const toggleUserActive = (user) => {
    if (user.role === 'school_superadmin') {
      showToast('সুপার অ্যাডমিন অ্যাকাউন্ট নিষ্ক্রিয় করা যাবে না।', 'error');
      return;
    }
    const updated = TenantRepository.updateUser(user.id, { active: !user.active });
    setUsers(TenantRepository.getUsers(school.id));
    showToast(`ইউজার "${user.username}" ${updated.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে।`);
  };

  const handleDeleteUser = () => {
    if (!deleteModalUser) return;
    if (deleteModalUser.role === 'school_superadmin') {
      showToast('সুপার অ্যাডমিন অ্যাকাউন্ট মুছে ফেলা যাবে না।', 'error');
      setDeleteModalUser(null);
      return;
    }
    TenantRepository.deleteUser(deleteModalUser.id);
    setUsers(TenantRepository.getUsers(school.id));
    showToast(`ইউজার "${deleteModalUser.username}" সফলভাবে মুছে ফেলা হয়েছে!`);
    setDeleteModalUser(null);
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
                {roleLabels[val] || val}
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
          },
          {
            key: 'actions',
            label: 'অ্যাকশন',
            width: '120px',
            align: 'right',
            render: (_, row) => (
              !supportMode && row.role !== 'school_superadmin' ? (
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Power}
                    title={row.active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                    onClick={() => toggleUserActive(row)}
                    className={`p-1.5 h-8 ${row.active ? 'text-warning hover:bg-warning-soft' : 'text-success hover:bg-success-soft'}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    title="ইউজার মুছুন"
                    onClick={() => setDeleteModalUser(row)}
                    className="p-1.5 h-8 text-danger hover:bg-danger-soft"
                  />
                </div>
              ) : (
                <span className="text-xs text-muted">—</span>
              )
            )
          }
        ]}
        data={users}
        minWidth="680px"
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
          <div>
            <Input
              label="ইউজারনেম (Login Username) *"
              placeholder="e.g. teacher_science"
              value={newUser.username}
              onChange={(e) => {
                setNewUser({ ...newUser, username: e.target.value });
                if (formErrors.username) setFormErrors({ ...formErrors, username: '' });
              }}
              required
            />
            {formErrors.username && (
              <p className="text-danger text-xs mt-1">{formErrors.username}</p>
            )}
          </div>

          <div>
            <Input
              label="পূর্ণ নাম *"
              placeholder="e.g. মোঃ নাঈম আহমেদ"
              value={newUser.name}
              onChange={(e) => {
                setNewUser({ ...newUser, name: e.target.value });
                if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
              }}
              required
            />
            {formErrors.name && (
              <p className="text-danger text-xs mt-1">{formErrors.name}</p>
            )}
          </div>

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

          <div>
            <Input
              label="পাসওয়ার্ড *"
              type="password"
              placeholder="নিরাপদ পাসওয়ার্ড দিন (কমপক্ষে ৬ অক্ষর, বর্ণ ও সংখ্যা)"
              value={newUser.password}
              onChange={(e) => {
                setNewUser({ ...newUser, password: e.target.value });
                if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
              }}
              required
            />
            <span className="text-[10px] text-muted block mt-1">কমপক্ষে ৬টি অক্ষর, যার মধ্যে অন্তত ১টি বর্ণ এবং ১টি সংখ্যা আবশ্যক।</span>
            {formErrors.password && (
              <p className="text-danger text-xs mt-1">{formErrors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary">
              তৈরি করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* D13: Delete User Confirmation Modal */}
      {deleteModalUser && (
        <Modal
          isOpen={!!deleteModalUser}
          onClose={() => setDeleteModalUser(null)}
          title="ইউজার ডিলিট নিশ্চিতকরণ"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-text leading-relaxed">
              আপনি কি নিশ্চিত যে ইউজার <strong>"{deleteModalUser.username}"</strong> ({deleteModalUser.name})-কে সিস্টেম থেকে মুছে ফেলতে চান?
            </p>
            <p className="text-xs text-muted">
              এই ইউজার আর কোনো ড্যাশবোর্ডে প্রবেশ করতে পারবেন না।
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeleteModalUser(null)}>
                বাতিল
              </Button>
              <Button variant="dangerSolid" size="sm" onClick={handleDeleteUser}>
                হ্যাঁ, মুছে ফেলুন
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Factory Reset Modal */}
      {resetModalOpen && (
        <Modal
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
          title="ফ্যাক্টরি রিসেট নিশ্চিতকরণ"
          subtitle="স্কুলের সকল ডেটা রিসেট করার জন্য অনুমতি কোড লিখুন"
        >
          <form onSubmit={handleFactoryReset} className="space-y-4">
            <div className="p-3 rounded-lg bg-danger-soft border border-danger/30 text-xs text-danger font-semibold">
              ⚠️ সতর্কবার্তা: এটি অপরিবর্তনীয়! এই স্কুলের ডাটাবেস সম্পূর্ণ খালি হয়ে যাবে। নিশ্চিত করতে নিচের ঘরে <strong>RESET-{school.code_prefix}</strong> লিখুন।
            </div>

            {resetError && (
              <p className="text-xs text-danger font-semibold">{resetError}</p>
            )}

            <Input
              label="কনফার্মেশন কোড"
              placeholder={`RESET-${school.code_prefix}`}
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setResetModalOpen(false)}>
                বাতিল
              </Button>
              <Button type="submit" variant="dangerSolid">
                স্থায়ীভাবে রিসেট সম্পন্ন করুন
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
