import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { TenantRepository } from '../../../services/tenantStorage';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import GridTable from '../../../components/ui/GridTable';
import Modal from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/ToastContext';
import { toBengaliOrdinal, toBengaliNumber } from '../../../utils/dateFormatter';
import { FileText, Plus, CheckCircle2, AlertTriangle, Eye, Printer, Trash2, Upload, FileSpreadsheet, Download } from 'lucide-react';

export default function ResultManager() {
  const { school, currentUser, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [deleteModalResult, setDeleteModalResult] = useState(null);
  const [duplicateConfirm, setDuplicateConfirm] = useState(null);

  const results = TenantRepository.getResults(school.id);
  const students = TenantRepository.getStudents(school.id);

  // New Result Entry State
  const [entryClass, setEntryClass] = useState('10');
  const [entryGroup, setEntryGroup] = useState('Science');
  const [entryRoll, setEntryRoll] = useState('');
  const [entryExam, setEntryExam] = useState('Annual');
  const [entryYear, setEntryYear] = useState('2026');

  // Excel Bulk Marks Import State
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [excelExam, setExcelExam] = useState('Annual');
  const [excelYear, setExcelYear] = useState('2026');
  const [excelClass, setExcelClass] = useState('10');
  const [excelGroup, setExcelGroup] = useState('Science');
  const [excelData, setExcelData] = useState([]);
  const [excelErrors, setExcelErrors] = useState([]);
  const [excelFileName, setExcelFileName] = useState('');

  // Exam Types (Unified with Public Search - D12)
  const examOptions = [
    { value: 'First-Term', label: '১ম সাময়িক পরীক্ষা' },
    { value: 'Half-Yearly', label: 'অর্ধবার্ষিক পরীক্ষা' },
    { value: 'Annual', label: 'বার্ষিক পরীক্ষা' },
    { value: 'Pre-Test', label: 'প্রাক-নির্বাচনী পরীক্ষা' },
    { value: 'Test', label: 'নির্বাচনী পরীক্ষা (Test)' }
  ];

  // Subject Configurations per Class & Group (D12)
  const getSubjectList = (cls, grp) => {
    if (['6', '7', '8'].includes(cls)) {
      return [
        { code: '101', name: 'বাংলা' },
        { code: '107', name: 'ইংরেজি' },
        { code: '109', name: 'গণিত' },
        { code: '127', name: 'সাধারণ বিজ্ঞান' },
        { code: '150', name: 'বাংলাদেশ ও বিশ্বপরিচয়' },
        { code: '111', name: 'ধর্ম ও নৈতিক শিক্ষা' }
      ];
    }
    // Classes 9 & 10
    if (grp === 'Business Studies') {
      return [
        { code: '101', name: 'বাংলা' },
        { code: '107', name: 'ইংরেজি' },
        { code: '109', name: 'গণিত' },
        { code: '141', name: 'ব্যবসায় উদ্যোগ' },
        { code: '146', name: 'হিসাববিজ্ঞান' },
        { code: '152', name: 'ফিন্যান্স ও ব্যাংকিং' },
        { code: '111', name: 'ইসলাম ও নৈতিক শিক্ষা' }
      ];
    }
    if (grp === 'Humanities') {
      return [
        { code: '101', name: 'বাংলা' },
        { code: '107', name: 'ইংরেজি' },
        { code: '109', name: 'গণিত' },
        { code: '140', name: 'পৌরনীতি ও নাগরিকতা' },
        { code: '153', name: 'বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা' },
        { code: '110', name: 'ভূগোল ও পরিবেশ' },
        { code: '111', name: 'ইসলাম ও নৈতিক শিক্ষা' }
      ];
    }
    // Default: Science
    return [
      { code: '101', name: 'বাংলা' },
      { code: '107', name: 'ইংরেজি' },
      { code: '109', name: 'গণিত' },
      { code: '136', name: 'পদার্থবিজ্ঞান' },
      { code: '137', name: 'রসায়ন' },
      { code: '138', name: 'জীববিজ্ঞান' },
      { code: '111', name: 'ইসলাম ও নৈতিক শিক্ষা' }
    ];
  };

  const currentSubjects = getSubjectList(entryClass, entryGroup);
  const [subjectMarks, setSubjectMarks] = useState({});

  // Reset marks template whenever class or group changes
  useEffect(() => {
    const defaultMarks = {};
    currentSubjects.forEach(s => {
      defaultMarks[s.code] = subjectMarks[s.code] || 75;
    });
    setSubjectMarks(defaultMarks);
  }, [entryClass, entryGroup]);

  // Match Student (D11: Ghost Student Check)
  const matchedStudent = students.find(
    s => s.class === entryClass && Number(s.roll) === Number(entryRoll)
  );

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

    if (!matchedStudent) {
      showToast('এই শ্রেণি ও রোলের কোনো শিক্ষার্থী পাওয়া যায়নি!', 'error');
      return;
    }

    const subjectsArray = currentSubjects.map(s => {
      const marks = subjectMarks[s.code] || 0;
      const calc = calculateGradeAndGpa(marks);
      return {
        code: s.code,
        name: s.name,
        marks: Number(marks),
        grade: calc.grade,
        gpa: calc.gpa
      };
    });

    const hasFail = subjectsArray.some(s => s.grade === 'F');
    const totalGp = subjectsArray.reduce((acc, s) => acc + s.gpa, 0);
    const avgGpa = hasFail ? 0.00 : Math.min(5.00, parseFloat((totalGp / subjectsArray.length).toFixed(2)));
    const status = hasFail ? 'FAILED' : 'PASSED';

    const resultPayload = {
      class: entryClass,
      group: ['9', '10'].includes(entryClass) ? entryGroup : 'General',
      roll: Number(entryRoll),
      exam: entryExam,
      year: entryYear,
      total_gpa: avgGpa.toFixed(2),
      status,
      published: true,
      subjects: subjectsArray
    };

    // D06: Check if already exists
    const existing = results.find(
      r => r.class === entryClass && 
           Number(r.roll) === Number(entryRoll) && 
           r.exam === entryExam && 
           String(r.year) === String(entryYear)
    );

    if (existing) {
      setDuplicateConfirm({ payload: resultPayload, existing });
      return;
    }

    executeSaveResult(resultPayload);
  };

  const executeSaveResult = (payload) => {
    try {
      const res = TenantRepository.addResult(school.id, payload, currentUser?.name);
      showToast(
        res.isUpdate 
          ? `ফলাফল সফলভাবে আপডেট করা হয়েছে! নতুন জিপিএ: ${payload.total_gpa}` 
          : `ফলাফল এন্ট্রি সম্পন্ন! জিপিএ: ${payload.total_gpa} (${payload.status})`
      );
      setAddModalOpen(false);
      setDuplicateConfirm(null);
      setEntryRoll('');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = () => {
    if (!deleteModalResult) return;
    TenantRepository.deleteResult(school.id, deleteModalResult.id, currentUser?.name);
    showToast('ফলাফল সফলভাবে মুছে ফেলা হয়েছে!');
    setDeleteModalResult(null);
  };

  const handleDownloadSampleMarksExcel = () => {
    const subjects = getSubjectList(excelClass, excelGroup);
    const headerRow = ['roll', ...subjects.map(s => s.code)];
    const labelRow = ['রোল নম্বর', ...subjects.map(s => s.name)];
    const sampleRow1 = [1, ...subjects.map(() => 85)];
    const sampleRow2 = [2, ...subjects.map(() => 75)];

    const wsData = [headerRow, labelRow, sampleRow1, sampleRow2];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Marks');
    XLSX.writeFile(wb, `marks_import_sample_class_${excelClass}.xlsx`);
  };

  const handleExcelMarksUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        if (rawRows.length < 3) {
          setExcelErrors(['ফাইলে পর্যাপ্ত নম্বর এন্ট্রি পাওয়া যায়নি।']);
          return;
        }

        const subjects = getSubjectList(excelClass, excelGroup);
        const headerCodes = rawRows[0];
        const dataRows = rawRows.slice(2);

        const validated = [];
        const errs = [];
        const seenRolls = new Set();
        const classStudents = students.filter(s => s.class === excelClass);

        dataRows.forEach((r, idx) => {
          const rowNum = idx + 3;
          const roll = Number(r[0]);
          if (!roll || isNaN(roll)) return;

          if (seenRolls.has(roll)) {
            errs.push(`সারি ${rowNum}: ফাইলে একই রোল ${roll} একাধিকবার পাওয়া গেছে।`);
            return;
          }
          seenRolls.add(roll);

          const student = classStudents.find(s => Number(s.roll) === roll);
          if (!student) {
            errs.push(`সারি ${rowNum}: শ্রেণি ${excelClass}-এ রোল ${roll} নম্বরের কোনো নিবন্ধিত শিক্ষার্থী পাওয়া যায়নি।`);
            return;
          }

          const subjectsArray = subjects.map((subj, subjIdx) => {
            const colIdx = headerCodes.findIndex(h => String(h).trim() === String(subj.code).trim());
            const markVal = colIdx !== -1 ? Number(r[colIdx]) || 0 : (Number(r[subjIdx + 1]) || 0);
            const calc = calculateGradeAndGpa(markVal);
            return {
              code: subj.code,
              name: subj.name,
              marks: markVal,
              grade: calc.grade,
              gpa: calc.gpa
            };
          });

          const hasFail = subjectsArray.some(s => s.grade === 'F');
          const totalGp = subjectsArray.reduce((acc, s) => acc + s.gpa, 0);
          const avgGpa = hasFail ? 0.00 : Math.min(5.00, parseFloat((totalGp / subjectsArray.length).toFixed(2)));
          const status = hasFail ? 'FAILED' : 'PASSED';

          validated.push({
            student_name: student.name_bn,
            roll,
            class: excelClass,
            group: ['9', '10'].includes(excelClass) ? excelGroup : 'General',
            exam: excelExam,
            year: excelYear,
            total_gpa: avgGpa.toFixed(2),
            status,
            published: true,
            subjects: subjectsArray
          });
        });

        setExcelData(validated);
        setExcelErrors(errs);
      } catch (err) {
        showToast('মার্কস ফাইল প্রসেস করতে ব্যর্থ হয়েছে। সঠিক ফরম্যাটের ফাইল দিন।', 'error');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmExcelMarksImport = () => {
    if (excelData.length === 0) return;
    try {
      let importedCount = 0;
      excelData.forEach(resPayload => {
        TenantRepository.createResult(school.id, resPayload, currentUser?.name || 'শিক্ষক');
        importedCount++;
      });
      showToast(`${toBengaliNumber(importedCount)} জন শিক্ষার্থীর পরীক্ষার ফলাফল সফলভাবে Excel থেকে সংরক্ষিত ও পাবলিশ হয়েছে!`);
      setExcelModalOpen(false);
      setExcelData([]);
      setExcelErrors([]);
      setExcelFileName('');
    } catch (err) {
      showToast(err.message || 'মার্কস ইমপোর্টে সমস্যা হয়েছে', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">ফলাফল ও মার্কস এন্ট্রি</h2>
          <p className="text-xs text-muted">কুমিল্লা শিক্ষা বোর্ড গ্রেডিং স্কেল ও ফলাফল অনুমোদন</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!supportMode && (
            <Button
              variant="secondary"
              size="md"
              icon={FileSpreadsheet}
              onClick={() => {
                setExcelData([]);
                setExcelErrors([]);
                setExcelFileName('');
                setExcelModalOpen(true);
              }}
            >
              Excel (.xlsx) আপলোড
            </Button>
          )}
          {!supportMode && (
            <Button variant="primary" size="md" icon={Plus} onClick={() => setAddModalOpen(true)}>
              নতুন ফলাফল এন্ট্রি করুন
            </Button>
          )}
        </div>
      </div>

      <GridTable
        columns={[
          { 
            key: 'class', 
            label: 'শ্রেণি', 
            width: '100px', 
            render: (val) => (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-soft text-primary-text border border-primary/25">
                {toBengaliOrdinal(val)} শ্রেণি
              </span>
            )
          },
          { 
            key: 'roll', 
            label: 'রোল', 
            width: '65px', 
            fontMono: true, 
            align: 'center', 
            render: (val) => (
              <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-md bg-surface-2/90 font-mono text-xs font-bold text-text border border-border/70 shadow-2xs">
                {toBengaliNumber(val)}
              </span>
            )
          },
          { 
            key: 'student_name_bn', 
            label: 'শিক্ষার্থীর নাম', 
            width: '1.5fr',
            render: (val, row) => (
              <div>
                <strong className="text-text font-bold text-sm block">{val || 'শিক্ষার্থী'}</strong>
                <span className="text-[11px] text-muted font-mono">{row.group || 'General'}</span>
              </div>
            )
          },
          { 
            key: 'exam', 
            label: 'পরীক্ষা', 
            width: '140px',
            render: (val) => {
              const matched = examOptions.find(e => e.value === val);
              return <span className="text-xs font-medium text-text">{matched ? matched.label : val}</span>;
            }
          },
          { 
            key: 'year', 
            label: 'বছর', 
            width: '80px', 
            fontMono: true, 
            render: (val) => <span className="font-mono text-xs text-muted">{toBengaliNumber(val)}</span> 
          },
          { 
            key: 'total_gpa', 
            label: 'GPA', 
            width: '90px', 
            fontMono: true,
            render: (val) => <span className="font-bold text-primary text-sm font-mono">{val}</span>
          },
          {
            key: 'status',
            label: 'অবস্থা',
            width: '110px',
            render: (val) => (
              <Badge variant={val === 'PASSED' ? 'success' : 'danger'}>
                {val}
              </Badge>
            )
          },
          {
            key: 'actions',
            label: 'অ্যাকশন',
            width: '130px',
            align: 'right',
            noTruncate: true,
            render: (_, row) => (
              <div className="flex items-center justify-end gap-1.5 shrink-0">
                <Button variant="secondary" size="sm" icon={Eye} onClick={() => setSelectedResult(row)}>
                  দেখুন
                </Button>
                {!supportMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    title="মুছে ফেলুন"
                    onClick={() => setDeleteModalResult(row)}
                    className="p-1.5 h-8 text-muted hover:text-danger hover:bg-danger-soft shrink-0"
                  />
                )}
              </div>
            )
          }
        ]}
        data={results}
        minWidth="920px"
      />

      {/* ================= ADD RESULT MODAL ================= */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="শ্রেণিভিত্তিক নম্বর এন্ট্রি"
        subtitle="বোর্ড পলিসি অনুসারে জিপিএ ও গ্রেড স্বয়ংক্রিয় গণিত হবে"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveResult} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Select
              label="শ্রেণি"
              value={entryClass}
              onChange={(e) => setEntryClass(e.target.value)}
              options={['6', '7', '8', '9', '10'].map(c => ({ value: c, label: `${toBengaliOrdinal(c)} শ্রেণি` }))}
            />

            {['9', '10'].includes(entryClass) && (
              <Select
                label="বিভাগ (Group)"
                value={entryGroup}
                onChange={(e) => setEntryGroup(e.target.value)}
                options={[
                  { value: 'Science', label: 'বিজ্ঞান (Science)' },
                  { value: 'Business Studies', label: 'ব্যবসায় শিক্ষা' },
                  { value: 'Humanities', label: 'মানবিক' }
                ]}
              />
            )}

            <div>
              <Input
                label="রোল নম্বর *"
                type="number"
                placeholder="যেমন: 1"
                value={entryRoll}
                onChange={(e) => setEntryRoll(e.target.value)}
                required
              />
            </div>

            <Select
              label="পরীক্ষা"
              value={entryExam}
              onChange={(e) => setEntryExam(e.target.value)}
              options={examOptions}
            />

            <Select
              label="বছর"
              value={entryYear}
              onChange={(e) => setEntryYear(e.target.value)}
              options={['2026', '2025', '2024'].map(y => ({ value: y, label: toBengaliNumber(y) }))}
            />
          </div>

          {/* D11: Ghost Student Feedback */}
          {entryRoll && (
            matchedStudent ? (
              <div className="p-3 rounded-xl bg-success-soft border border-success/30 text-xs text-success flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  শিক্ষার্থী শনাক্তকরণ: <strong>{matchedStudent.name_bn}</strong> (আইডি: {matchedStudent.student_id}, পিতা: {matchedStudent.father_name})
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-danger-soft border border-danger/30 text-xs text-danger flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  শ্রেণি {toBengaliOrdinal(entryClass)}-এ রোল <strong>{entryRoll}</strong> নম্বরের কোনো নিবন্ধিত শিক্ষার্থী পাওয়া যায়নি!
                </span>
              </div>
            )
          )}

          {/* Dynamic Subject Marks Form */}
          <div className="pt-2 border-t border-border">
            <h4 className="text-xs font-bold text-text mb-3">
              বিষয়ভিত্তিক নম্বর (১০০ এর মধ্যে) — {entryClass}ম শ্রেণি ({['9', '10'].includes(entryClass) ? entryGroup : 'সাধারণ'}):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {currentSubjects.map((s) => (
                <div key={s.code} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-2 border border-border">
                  <div>
                    <span className="text-xs font-semibold text-text block">{s.name}</span>
                    <span className="text-[10px] text-muted font-mono">কোড: {s.code}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={subjectMarks[s.code] || ''}
                    onChange={(e) => setSubjectMarks({ ...subjectMarks, [s.code]: e.target.value })}
                    className="w-16 h-8 text-center text-xs font-mono font-bold rounded bg-surface border border-border text-primary focus:border-primary outline-none"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-warning-soft border border-warning-line text-xs text-warning">
            ⚠️ কুমিল্লা বোর্ড নিয়ম অনুসারে কোনো বিষয়ে ৩৩ এর নিচে পেলে সামগ্রিক ফল <strong>FAILED (GPA 0.00)</strong> হবে।
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary" disabled={!matchedStudent}>
              ফলাফল সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* D06: Duplicate Result Confirmation Modal */}
      {duplicateConfirm && (
        <Modal
          isOpen={!!duplicateConfirm}
          onClose={() => setDuplicateConfirm(null)}
          title="ফলাফল প্রতিস্থাপন নিশ্চিতকরণ"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-warning-soft border border-warning-line text-xs text-warning flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>
                এই শিক্ষার্থীর (শ্রেণি: {toBengaliOrdinal(duplicateConfirm.payload.class)}, রোল: {duplicateConfirm.payload.roll}) {duplicateConfirm.payload.exam} {duplicateConfirm.payload.year}-এর ফলাফল ইতোমধ্যে বিদ্যমান!
              </span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2 border border-border text-xs space-y-1">
              <div className="flex justify-between text-muted">
                <span>পূর্ববর্তী ফলাফল:</span>
                <span className="font-bold text-text">GPA {duplicateConfirm.existing.total_gpa} ({duplicateConfirm.existing.status})</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>নতুন নম্বর অনুযায়ী ফলাফল:</span>
                <span className="font-bold text-primary">GPA {duplicateConfirm.payload.total_gpa} ({duplicateConfirm.payload.status})</span>
              </div>
            </div>
            <p className="text-xs text-muted">
              আপনি কি বিদ্যমান ফলাফলটি নতুন নম্বর দিয়ে আপডেট করতে চান?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDuplicateConfirm(null)}>
                বাতিল
              </Button>
              <Button variant="primary" size="sm" onClick={() => executeSaveResult(duplicateConfirm.payload)}>
                হ্যাঁ, ফলাফল আপডেট করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* D26: Marksheet View & Print Modal */}
      {selectedResult && (
        <Modal
          isOpen={!!selectedResult}
          onClose={() => setSelectedResult(null)}
          title="একাডেমিক মার্কশিট ও রেজাল্ট ট্রান্সক্রিপ্ট"
          subtitle={`${school.name_bn} · অফিশিয়াল শিক্ষাবোর্ড গ্রেডিং`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            {/* Printable Marksheet Container */}
            <div className="printable-marksheet-sheet printable-document page-fit-single p-6 rounded-xl bg-white text-black border border-slate-300 space-y-4">
              {/* Header Letterhead with Dynamic School Logo */}
              <div className="flex items-center justify-center gap-3 pb-3 border-b-2 border-black">
                {school.logo_url || school.logo ? (
                  <img src={school.logo_url || school.logo} alt="School Logo" className="w-12 h-12 object-contain rounded-lg border border-slate-300 p-0.5 bg-white shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-emerald-700 text-white font-bold text-xl flex items-center justify-center shrink-0">
                    {school.name_bn[0]}
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-heading font-extrabold text-slate-900 leading-tight">{school.name_bn}</h3>
                  <p className="text-[11px] text-slate-700">
                    EIIN: {school.eiin} • শিক্ষাবোর্ড: {school.board} • স্কুল কোড: {school.school_code}
                  </p>
                  <span className="inline-block px-2.5 py-0.5 mt-1 rounded bg-slate-100 text-slate-900 border border-slate-300 font-bold text-[11px]">
                    একাডেমিক ট্রান্সক্রিপ্ট — {selectedResult.exam} {toBengaliNumber(selectedResult.year)}
                  </span>
                </div>
              </div>

              {/* Student Info Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-600 block text-[10px]">শিক্ষার্থীর নাম:</span>
                  <strong className="text-slate-900 block truncate">{selectedResult.student_name_bn || '—'}</strong>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">শ্রেণি:</span>
                  <span className="font-semibold text-slate-900">{toBengaliOrdinal(selectedResult.class)}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">রোল নম্বর:</span>
                  <span className="font-mono font-bold text-slate-900">{toBengaliNumber(selectedResult.roll)}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">বিভাগ:</span>
                  <span className="font-semibold text-slate-900">{selectedResult.group || 'General'}</span>
                </div>
              </div>

              {/* Subject Table */}
              <GridTable
                columns={[
                  { key: 'code', label: 'কোড', width: '70px', fontMono: true },
                  { key: 'name', label: 'বিষয়ের নাম', width: '2fr' },
                  { key: 'marks', label: 'পূর্ণমান / প্রাপ্ত', width: '100px', align: 'center', fontMono: true, render: (val) => `১০০ / ${toBengaliNumber(val)}` },
                  { key: 'grade', label: 'গ্রেড', width: '70px', align: 'center', fontMono: true, render: (val) => <span className="font-bold">{val}</span> },
                  { key: 'gpa', label: 'পয়েন্ট', width: '70px', align: 'right', fontMono: true, render: (val) => toBengaliNumber(val) }
                ]}
                data={selectedResult.subjects || []}
                zebra
              />

              {/* Final Summary Card */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-300 flex items-center justify-between text-black">
                <div>
                  <span className="text-xs text-slate-600 block">চূড়ান্ত গ্রেড পয়েন্ট (GPA):</span>
                  <div className="text-2xl font-mono font-extrabold text-slate-900">
                    {selectedResult.total_gpa}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded font-bold text-xs border ${
                    selectedResult.status === 'PASSED' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-red-50 text-red-800 border-red-300'
                  }`}>
                    {selectedResult.status === 'PASSED' ? '✓ উত্তীর্ণ (PASSED)' : '✕ অনুত্তীর্ণ (FAILED)'}
                  </span>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-6 flex items-center justify-between text-xs text-slate-700 border-t border-slate-300">
                <div className="text-center">
                  <div className="w-32 border-b border-slate-400 mb-1"></div>
                  <span>শ্রেণি শিক্ষকের স্বাক্ষর</span>
                </div>
                <div className="text-center">
                  <div className="w-36 border-b border-slate-400 mb-1"></div>
                  <span className="font-bold text-slate-900">প্রধান শিক্ষকের স্বাক্ষর ও সিল</span>
                </div>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-border no-print">
              <Button variant="secondary" size="sm" onClick={() => setSelectedResult(null)}>
                বন্ধ করুন
              </Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                মার্কশিট প্রিন্ট করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Excel Bulk Marks Import Modal */}
      {excelModalOpen && (
        <Modal
          isOpen={excelModalOpen}
          onClose={() => setExcelModalOpen(false)}
          title="📊 Excel ফাইল থেকে সম্পূর্ণ শ্রেণির পরীক্ষার নম্বর (Marks) আপলোড"
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5">
            {/* Class, Exam, Year Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-2 border border-border">
              <Select
                label="শ্রেণি"
                value={excelClass}
                onChange={(e) => {
                  setExcelClass(e.target.value);
                  setExcelData([]);
                  setExcelErrors([]);
                }}
                options={[
                  { value: '6', label: '৬ষ্ঠ শ্রেণি' },
                  { value: '7', label: '৭ম শ্রেণি' },
                  { value: '8', label: '৮ম শ্রেণি' },
                  { value: '9', label: '৯ম শ্রেণি' },
                  { value: '10', label: '১০ম শ্রেণি' }
                ]}
              />

              {['9', '10'].includes(excelClass) && (
                <Select
                  label="বিভাগ (Group)"
                  value={excelGroup}
                  onChange={(e) => {
                    setExcelGroup(e.target.value);
                    setExcelData([]);
                    setExcelErrors([]);
                  }}
                  options={[
                    { value: 'Science', label: 'বিজ্ঞান (Science)' },
                    { value: 'Business Studies', label: 'ব্যবসায় শিক্ষা (Business)' },
                    { value: 'Humanities', label: 'মানবিক (Humanities)' }
                  ]}
                />
              )}

              <Select
                label="পরীক্ষার নাম"
                value={excelExam}
                onChange={(e) => setExcelExam(e.target.value)}
                options={examOptions}
              />

              <Input
                label="শিক্ষাবর্ষ"
                value={excelYear}
                onChange={(e) => setExcelYear(e.target.value)}
                placeholder="2026"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-primary-soft/30 border border-primary/20">
              <div>
                <h4 className="text-xs font-bold text-text">শ্রেণিভিত্তিক এক্সেল টেমপ্লেট</h4>
                <p className="text-[11px] text-muted">নির্বাচিত শ্রেণির বিষয়কোডসহ নমুনা শিট ডাউনলোড করে নম্বর বসান।</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={handleDownloadSampleMarksExcel}
              >
                নমুনা মার্কশিট ডাউনলোড
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text block">পূরণকৃত Excel (.xlsx) ফাইল আপলোড করুন:</label>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleExcelMarksUpload}
                className="w-full text-xs text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-on-primary hover:file:opacity-90 cursor-pointer p-2 rounded-xl bg-surface-2 border border-dashed border-border"
              />
              {excelFileName && (
                <div className="text-[11px] text-primary flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> নির্বাচিত ফাইল: {excelFileName}
                </div>
              )}
            </div>

            {/* Error List */}
            {excelErrors.length > 0 && (
              <div className="p-3.5 rounded-xl bg-danger-soft border border-danger/25 space-y-1.5 max-h-36 overflow-y-auto">
                <div className="text-xs font-bold text-danger flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {excelErrors.length}টি ত্রুটি পাওয়া গেছে:
                </div>
                <ul className="text-[11px] text-danger/90 list-disc list-inside space-y-0.5 font-mono">
                  {excelErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview of Calculated Marks & GPAs */}
            {excelData.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text">
                    যাচাইকৃত ফলাফল: <strong className="text-primary font-mono">{toBengaliNumber(excelData.length)} জন</strong> (কুমিল্লা বোর্ড গ্রেডিং হিসাবকৃত)
                  </span>
                </div>
                <div className="max-h-52 overflow-y-auto border border-border rounded-xl bg-surface">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-surface-2 border-b border-border text-[11px] text-muted uppercase font-mono">
                      <tr>
                        <th className="p-2.5">রোল</th>
                        <th className="p-2.5">শিক্ষার্থীর নাম</th>
                        <th className="p-2.5 text-center">GPA</th>
                        <th className="p-2.5 text-center">অবস্থা</th>
                        <th className="p-2.5">বিষয়ভিত্তিক নম্বর</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-[11px]">
                      {excelData.map((row, i) => (
                        <tr key={i} className="hover:bg-surface-2/50">
                          <td className="p-2.5 font-bold font-mono text-primary">{toBengaliNumber(row.roll)}</td>
                          <td className="p-2.5 font-medium text-text">{row.student_name}</td>
                          <td className="p-2.5 text-center font-bold font-mono text-text">{row.total_gpa}</td>
                          <td className="p-2.5 text-center">
                            <Badge variant={row.status === 'PASSED' ? 'success' : 'danger'}>
                              {row.status === 'PASSED' ? 'কৃতকার্য' : 'অকৃতকার্য'}
                            </Badge>
                          </td>
                          <td className="p-2.5 text-muted font-mono text-[10px]">
                            {row.subjects.map(s => `${s.name}: ${s.marks} (${s.grade})`).join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <Button variant="secondary" size="sm" onClick={() => setExcelModalOpen(false)}>
                বাতিল
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Upload}
                disabled={excelData.length === 0}
                onClick={handleConfirmExcelMarksImport}
              >
                ফলাফল পাবলিশ ও সংরক্ষণ করুন ({toBengaliNumber(excelData.length)} জন)
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* D13: Delete Result Confirmation Modal */}
      {deleteModalResult && (
        <Modal
          isOpen={!!deleteModalResult}
          onClose={() => setDeleteModalResult(null)}
          title="ফলাফল ডিলিট নিশ্চিতকরণ"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-text leading-relaxed">
              আপনি কি নিশ্চিত যে শ্রেণি {toBengaliOrdinal(deleteModalResult.class)}, রোল {deleteModalResult.roll} ({deleteModalResult.exam} {deleteModalResult.year})-এর ফলাফল মুছে ফেলতে চান?
            </p>
            <p className="text-xs text-muted">
              একবার মুছে ফেললে এটি পাবলিক রেজাল্ট সার্চ এবং শিক্ষার্থীর গ্রেডশিট থেকে অপসারিত হবে।
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeleteModalResult(null)}>
                বাতিল
              </Button>
              <Button variant="dangerSolid" size="sm" onClick={handleDelete}>
                হ্যাঁ, মুছে ফেলুন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
