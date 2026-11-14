import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TenantRepository } from '../../../services/tenantStorage';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import GridTable from '../../../components/ui/GridTable';
import Modal from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/ToastContext';
import { CheckCircle2, XCircle, Printer, Eye, UserCheck } from 'lucide-react';

export default function AdmissionManager() {
  const { school, currentUser, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [selectedAdm, setSelectedAdm] = useState(null);
  const admissions = TenantRepository.getAdmissions(school.id);

  const handleApprove = (adm) => {
    try {
      const result = TenantRepository.approveAdmission(school.id, adm.id, currentUser?.name || 'প্রধান শিক্ষক');
      showToast(`আবেদন অনুমোদিত! রোল ${result.admission.assigned_roll} বরাদ্দ হয়েছে এবং শিক্ষার্থী তৈরি হয়েছে।`);
      setSelectedAdm(null);
    } catch (err) {
      showToast(err.message || 'অনুমোদনে ত্রুটি হয়েছে', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">অনলাইন ভর্তি আবেদন পর্যালোচনা</h2>
        <p className="text-xs text-muted">ভর্তি আবেদন যাচাই, রোল বরাদ্দ ও শিক্ষার্থী অনুমোদন প্যানেল</p>
      </div>

      <GridTable
        columns={[
          { key: 'tracking_id', label: 'ট্র্যাকিং কোড', width: '150px', fontMono: true },
          { 
            key: 'name_bn', 
            label: 'আবেদনকারী', 
            width: '2fr',
            render: (val, row) => (
              <div className="flex items-center gap-3">
                {row.photo ? (
                  <img src={row.photo} alt={val} className="w-8 h-8 rounded-full object-cover border border-border shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {val?.[0] || 'শিক্ষার্থী'}
                  </div>
                )}
                <div>
                  <div className="font-bold text-text">{val}</div>
                  {row.name_en && <div className="text-[10px] text-muted font-mono">{row.name_en}</div>}
                </div>
              </div>
            )
          },
          { key: 'applied_class', label: 'শ্রেণি', width: '80px', render: (val) => `${val}ম` },
          { key: 'mobile', label: 'মোবাইল', width: '120px', fontMono: true },
          { key: 'applied_at', label: 'আবেদনের সময়', width: '140px', fontMono: true },
          {
            key: 'status',
            label: 'অবস্থা',
            width: '120px',
            render: (val, row) => (
              <Badge variant={val === 'approved' ? 'success' : val === 'rejected' ? 'danger' : 'warning'}>
                {val === 'approved' ? `রোল ${row.assigned_roll}` : val === 'rejected' ? 'বাতিল' : 'অপেক্ষমাণ'}
              </Badge>
            )
          },
          {
            key: 'actions',
            label: 'পদক্ষেপ',
            width: '140px',
            align: 'right',
            render: (_, row) => (
              <div className="flex items-center justify-end gap-1.5">
                <Button variant="secondary" size="sm" onClick={() => setSelectedAdm(row)}>
                  দেখুন
                </Button>
                {row.status === 'pending' && !supportMode && (
                  <Button variant="primary" size="sm" onClick={() => handleApprove(row)}>
                    অনুমোদন
                  </Button>
                )}
              </div>
            )
          }
        ]}
        data={admissions}
        minWidth="780px"
      />

      {/* View & Review Modal */}
      {selectedAdm && (
        <Modal
          isOpen={!!selectedAdm}
          onClose={() => setSelectedAdm(null)}
          title="ভর্তি আবেদনপত্রের বিস্তারিত"
          subtitle={`ট্র্যাকিং আইডি: ${selectedAdm.tracking_id}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            {selectedAdm.photo && (
              <div className="flex justify-center pb-2">
                <div className="relative group">
                  <img
                    src={selectedAdm.photo}
                    alt={selectedAdm.name_bn}
                    className="w-24 h-28 object-cover rounded-xl border-2 border-primary shadow-sm"
                  />
                  <span className="block text-center text-[10px] text-muted mt-1 font-mono">পাসপোর্ট ছবি</span>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2.5">
              <div className="flex justify-between">
                <span className="text-muted">শিক্ষার্থীর নাম (বাংলা):</span>
                <span className="font-bold text-text">{selectedAdm.name_bn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Student Name (English):</span>
                <span className="font-mono text-text">{selectedAdm.name_en || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">ভর্তির শ্রেণি:</span>
                <span className="font-bold text-primary">{selectedAdm.applied_class}ম শ্রেণি</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">পিতার নাম:</span>
                <span className="text-text">{selectedAdm.father_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">মাতার নাম:</span>
                <span className="text-text">{selectedAdm.mother_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">মোবাইল নম্বর:</span>
                <span className="font-mono text-text">{selectedAdm.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">পূর্ববর্তী বিদ্যালয়:</span>
                <span className="text-text">{selectedAdm.prev_school || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">পূর্ববর্তী জিপিএ:</span>
                <span className="font-mono text-text">{selectedAdm.prev_gpa || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">বর্তমান অবস্থা:</span>
                <Badge variant={selectedAdm.status === 'approved' ? 'success' : selectedAdm.status === 'rejected' ? 'danger' : 'warning'}>
                  {selectedAdm.status === 'approved' ? `অনুমোদিত (রোল: ${selectedAdm.assigned_roll})` : selectedAdm.status === 'rejected' ? 'বাতিল' : 'অপেক্ষমাণ'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button variant="secondary" size="sm" onClick={() => setSelectedAdm(null)}>
                বন্ধ করুন
              </Button>

              {selectedAdm.status === 'pending' && !supportMode && (
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="sm" onClick={() => handleApprove(selectedAdm)}>
                    অনুমোদন করুন (স্বয়ংক্রিয় রোল বরাদ্দ)
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

