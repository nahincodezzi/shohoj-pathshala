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
import { FileText, Plus, CheckCircle2, AlertTriangle, Eye, Printer } from 'lucide-react';

export default function ResultManager() {
  const { school, currentUser, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const results = TenantRepository.getResults(school.id);

  // New Result Entry State
  const [entryClass, setEntryClass] = useState('10');
  const [entryRoll, setEntryRoll] = useState('');
  const [entryExam, setEntryExam] = useState('Annual');
  const [entryYear, setEntryYear] = useState('2026');
  const [subjectMarks, setSubjectMarks] = useState({
    '101': 85, // বাংলা
    '107': 78, // ইংরেজি
    '109': 92, // গণিত
    '136': 80, // পদার্থবিজ্ঞান
    '137': 84, // রসায়ন
    '138': 75, // জীববিজ্ঞান
  });

  const subjectNames = {
    '101': 'বাংলা',
    '107': 'ইংরেজি',
    '109': 'গণিত',
    '136': 'পদার্থবিজ্ঞান',
    '137': 'রসায়ন',
    '138': 'জীববিজ্ঞান'
  };

  // Comilla Board GPA Calculator
  const calculateGradeAndGpa = (marks) => {
    const num = Number(marks);
    if (num >= 80) return { grade: 'A+', gpa: 5.0 };
    if (num >= 70) return { grade: 'A', gpa: 4.0 };
    if (num >= 60) return { grade: 'A-', gpa: 3.5 };
    if (num >= 50) return { grade: 'B', gpa: 3.0 };
    if (num >= 40) return { grade: 'C', gpa: 2.0 };
    if (num >= 33) return { grade: 'D', gpa: 1.0 };
    return { grade: 'F', gpa: 0.0 };
  };

  const handleSaveResult = (e) => {
    e.preventDefault();
    const subjectsArray = Object.entries(subjectMarks).map(([code, marks]) => {
      const calc = calculateGradeAndGpa(marks);
      return {
        code,
        name: subjectNames[code],
        marks: Number(marks),
        grade: calc.grade,
        gpa: calc.gpa
      };
    });

    // Check Fail Guard: if any subject has F, GPA is 0.00 and FAILED
    const hasFail = subjectsArray.some(s => s.grade === 'F');
    const totalGp = subjectsArray.reduce((acc, s) => acc + s.gpa, 0);
    const avgGpa = hasFail ? 0.00 : Math.min(5.00, parseFloat((totalGp / subjectsArray.length).toFixed(2)));
    const status = hasFail ? 'FAILED' : 'PASSED';

    const newResult = {
      id: `res_${Date.now()}`,
      school_id: school.id,
      class: entryClass,
      roll: Number(entryRoll),
      exam: entryExam,
      year: entryYear,
      total_gpa: avgGpa.toFixed(2),
      status,
      published: true,
      subjects: subjectsArray
    };

    // Save
    const existing = TenantRepository.getResults(school.id);
    existing.unshift(newResult);
    localStorage.setItem(`sp_tenant_results`, JSON.stringify(existing));

    showToast(`ফলাফল এন্ট্রি সম্পন্ন! জিপিএ: ${newResult.total_gpa} (${status})`);
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">ফলাফল ও মার্কস এন্ট্রি</h2>
          <p className="text-xs text-muted">কুমিল্লা শিক্ষা বোর্ড গ্রেডিং স্কেল ও ফলাফল অনুমোদন</p>
        </div>

        {!supportMode && (
          <Button variant="primary" size="md" icon={Plus} onClick={() => setAddModalOpen(true)}>
            নতুন ফলাফল এন্ট্রি করুন
          </Button>
        )}
      </div>

      <GridTable
        columns={[
          { key: 'class', label: 'শ্রেণি', width: '80px', render: (val) => `${val}ম` },
          { key: 'roll', label: 'রোল', width: '70px', fontMono: true, align: 'center' },
          { key: 'exam', label: 'পরীক্ষা', width: '120px' },
          { key: 'year', label: 'বছর', width: '80px', fontMono: true },
          { key: 'total_gpa', label: 'GPA', width: '90px', fontMono: true },
          {
            key: 'status',
            label: 'অবস্থা',
            width: '120px',
            render: (val) => (
              <Badge variant={val === 'PASSED' ? 'success' : 'danger'}>
                {val}
              </Badge>
            )
          },
          {
            key: 'published',
            label: 'পাবলিশড',
            width: '100px',
            render: (val) => (
              <Badge variant={val ? 'primary' : 'muted'}>
                {val ? 'অনুমোদিত' : 'ড্রাফট'}
              </Badge>
            )
          },
          {
            key: 'actions',
            label: 'মার্কশিট',
            width: '90px',
            align: 'right',
            render: (_, row) => (
              <Button variant="secondary" size="sm" icon={Eye} onClick={() => setSelectedResult(row)}>
                দেখুন
              </Button>
            )
          }
        ]}
        data={results}
        minWidth="720px"
      />

      {/* ================= ADD RESULT MODAL ================= */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="শ্রেণিভিত্তিক নম্বর এন্ট্রি"
        subtitle="বোর্ড পলিসি অনুসারে জিপিএ ও গ্রেড স্বয়ংক্রিয় গণিত হবে"
      >
        <form onSubmit={handleSaveResult} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Select
              label="শ্রেণি"
              value={entryClass}
              onChange={(e) => setEntryClass(e.target.value)}
              options={['6', '7', '8', '9', '10'].map(c => ({ value: c, label: `${c}ম শ্রেণি` }))}
            />
            <Input
              label="রোল"
              type="number"
              placeholder="e.g. 5"
              value={entryRoll}
              onChange={(e) => setEntryRoll(e.target.value)}
              required
            />
            <Select
              label="পরীক্ষা"
              value={entryExam}
              onChange={(e) => setEntryExam(e.target.value)}
              options={['Annual', 'Pre-Test', 'Test']}
            />
            <Select
              label="বছর"
              value={entryYear}
              onChange={(e) => setEntryYear(e.target.value)}
              options={['2026', '2025']}
            />
          </div>

          <div className="pt-2 border-t border-border">
            <h4 className="text-xs font-bold text-text mb-3">বিষয়ভিত্তিক নম্বর (১০০ এর মধ্যে):</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(subjectNames).map(([code, name]) => (
                <div key={code} className="flex items-center justify-between p-2 rounded-lg bg-surface-2 border border-border">
                  <span className="text-xs font-medium text-text">{name}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={subjectMarks[code] || 0}
                    onChange={(e) => setSubjectMarks({ ...subjectMarks, [code]: e.target.value })}
                    className="w-16 h-8 text-center text-xs font-mono font-bold rounded bg-surface border border-border text-primary"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-warning-soft border border-warning-line text-xs text-warning">
            ⚠️ কোনো বিষয়ে ৩৩ এর নিচে পেলে কুমিল্লা বোর্ড নিয়ম অনুযায়ী চূড়ান্ত ফল <strong>FAILED (GPA 0.00)</strong> হবে।
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary">
              ফলাফল প্রকাশ করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* Marksheet View Modal */}
      {selectedResult && (
        <Modal
          isOpen={!!selectedResult}
          onClose={() => setSelectedResult(null)}
          title="মার্কশিট প্রিভিউ"
          subtitle={`শ্রেণি: ${selectedResult.class}ম | রোল: ${selectedResult.roll} | পরীক্ষা: ${selectedResult.exam}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary-soft border border-primary/25 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted">মোট ফলাফল:</span>
                <div className="text-2xl font-mono font-extrabold text-primary">
                  GPA {selectedResult.total_gpa}
                </div>
              </div>
              <Badge variant={selectedResult.status === 'PASSED' ? 'success' : 'danger'}>
                {selectedResult.status}
              </Badge>
            </div>

            <GridTable
              columns={[
                { key: 'name', label: 'বিষয়', width: '2fr' },
                { key: 'marks', label: 'প্রাপ্ত নম্বর', width: '90px', align: 'right', fontMono: true },
                { key: 'grade', label: 'গ্রেড', width: '70px', align: 'center', fontMono: true },
                { key: 'gpa', label: 'পয়েন্ট', width: '70px', align: 'right', fontMono: true }
              ]}
              data={selectedResult.subjects}
              zebra
            />

            <div className="flex justify-end pt-4 border-t border-border">
              <Button variant="secondary" size="sm" onClick={() => setSelectedResult(null)}>
                বন্ধ করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

