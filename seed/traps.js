/**
 * Sohoj Pathshala — Cross-Tenant Traps & Isolation Verifier
 * Section 7: Traps designed to surface tenant boundary leaks across public & admin modules.
 */

export const CROSS_TENANT_TRAPS = [
  {
    id: 'TRAP-01',
    name: 'Identical Student Collision Trap',
    description: 'Same name "মোঃ আব্দুল করিম" exists in both BDHS and BAHS, but with different school_id, upazila, and roll.',
    schools: ['sch_bdhs', 'sch_bahs'],
    verify(tables) {
      const students = tables.students || [];
      const bdhsStd = students.find(s => s.school_id === 'sch_bdhs' && s.name_bn === 'মোঃ আব্দুল করিম');
      const bahsStd = students.find(s => s.school_id === 'sch_bahs' && s.name_bn === 'মোঃ আব্দুল করিম');

      if (!bdhsStd || !bahsStd) {
        return { pass: false, error: 'Trap students not seeded properly in both schools' };
      }
      if (bdhsStd.id === bahsStd.id || bdhsStd.student_id === bahsStd.student_id) {
        return { pass: false, error: 'Student ID collision across tenants detected!' };
      }
      return { pass: true, message: 'Students strictly isolated under distinct school_id and prefixes.' };
    }
  },
  {
    id: 'TRAP-02',
    name: 'Hidden Slug Tag in Notice Trap',
    description: 'Notice seeded in BAHS contains tag [BAHS-CONFIDENTIAL-TRAP]. It must NEVER be queryable or visible under BDHS.',
    schools: ['sch_bahs'],
    verify(tables) {
      const notices = tables.notices || [];
      const leaked = notices.find(n => n.school_id === 'sch_bdhs' && (n.title?.includes('BAHS-CONFIDENTIAL-TRAP') || n.description?.includes('BAHS-CONFIDENTIAL-TRAP')));
      if (leaked) {
        return { pass: false, error: 'Notice from BAHS leaked into BDHS tenant scope!' };
      }
      return { pass: true, message: 'Notice tag strictly confined to BAHS tenant.' };
    }
  },
  {
    id: 'TRAP-03',
    name: 'Receipt Sequence Suffix Collision Trap',
    description: 'Receipts in BDHS and BAHS sharing sequence number 9901.',
    schools: ['sch_bdhs', 'sch_bahs'],
    verify(tables) {
      const receipts = tables.receipts || [];
      const bdhsRec = receipts.find(r => r.school_id === 'sch_bdhs' && r.receipt_no?.includes('9901'));
      const bahsRec = receipts.find(r => r.school_id === 'sch_bahs' && r.receipt_no?.includes('9901'));
      if (bdhsRec && bahsRec && bdhsRec.receipt_no === bahsRec.receipt_no) {
        return { pass: false, error: 'Identical receipt numbers across different tenants!' };
      }
      return { pass: true, message: 'Receipt numbers use distinct school prefixes.' };
    }
  },
  {
    id: 'TRAP-04',
    name: 'Foreign Foreign-Key Isolation Trap',
    description: 'Ensure no table row references a foreign school_id that does not exist in schools table.',
    verify(tables) {
      const schoolIds = new Set((tables.schools || []).map(s => s.id));
      const orphaned = [];

      Object.entries(tables).forEach(([tableName, rows]) => {
        if (tableName === 'schools' || tableName === 'users' || tableName === 'audit_logs') return;
        if (Array.isArray(rows)) {
          rows.forEach(row => {
            if (row.school_id && !schoolIds.has(row.school_id)) {
              orphaned.push(`${tableName} (id: ${row.id}, school_id: ${row.school_id})`);
            }
          });
        }
      });

      if (orphaned.length > 0) {
        return { pass: false, error: `Orphaned tenant rows detected: ${orphaned.join(', ')}` };
      }
      return { pass: true, message: 'All tenant records reference valid schools.' };
    }
  }
];

export function getTrapRecords(batchId) {
  return {
    students: [
      {
        id: `std_trap_bdhs_${batchId}`,
        school_id: 'sch_bdhs',
        student_id: 'BDHS-2026-TRAP1',
        name_bn: 'মোঃ আব্দুল করিম',
        name_en: 'Md. Abdul Karim',
        father_name: 'মোঃ শামসুল হক',
        mother_name: 'আমেনা খাতুন',
        class: '9',
        group: 'Science',
        roll: 88,
        mobile: '01811998811',
        dob: '2011-03-12',
        address: 'আনন্দপুর, ফুলগাজী, ফেনী',
        is_demo: true,
        seed_batch: batchId,
        trap_id: 'TRAP-01'
      },
      {
        id: `std_trap_bahs_${batchId}`,
        school_id: 'sch_bahs',
        student_id: 'BAHS-2026-TRAP1',
        name_bn: 'মোঃ আব্দুল করিম',
        name_en: 'Md. Abdul Karim',
        father_name: 'আব্দুর রশিদ ভূঁইয়া',
        mother_name: 'শাহেদা বেগম',
        class: '9',
        group: 'Science',
        roll: 42,
        mobile: '01712887722',
        dob: '2011-08-25',
        address: 'পয়াত, বরুড়া, কুমিল্লা',
        is_demo: true,
        seed_batch: batchId,
        trap_id: 'TRAP-01'
      }
    ],
    notices: [
      {
        id: `not_trap_bahs_${batchId}`,
        school_id: 'sch_bahs',
        title: '[BAHS-CONFIDENTIAL-TRAP] বরুড়া অভ্যন্তরীণ প্রশাসনিক সভা',
        description: 'এটি বরুড়া আদর্শ উচ্চ বিদ্যালয়ের অভ্যন্তরীণ ট্র্যাপ নোটিশ। অন্য কোনো স্কুলে দেখা যাওয়া টেন্যান্ট লিক নির্দেশ করবে।',
        category: 'administrative',
        is_urgent: false,
        date: '২০২৬-১১-১৬',
        published: true,
        is_demo: true,
        seed_batch: batchId,
        trap_id: 'TRAP-02'
      }
    ],
    receipts: [
      {
        id: `rec_trap_bdhs_${batchId}`,
        school_id: 'sch_bdhs',
        receipt_no: 'REC-BDHS-2026-1116-9901',
        student_id: 'BDHS-2026-TRAP1',
        student_name: 'মোঃ আব্দুল করিম',
        class: '9',
        roll: 88,
        category: 'মাসিক বেতন',
        amount: 300,
        payment_method: 'নগদ',
        status: 'paid',
        created_by: 'অফিস সহকারী',
        created_at: '2026-11-16 11:00 AM',
        is_demo: true,
        seed_batch: batchId,
        trap_id: 'TRAP-03'
      },
      {
        id: `rec_trap_bahs_${batchId}`,
        school_id: 'sch_bahs',
        receipt_no: 'REC-BAHS-2026-1116-9901',
        student_id: 'BAHS-2026-TRAP1',
        student_name: 'মোঃ আব্দুল করিম',
        class: '9',
        roll: 42,
        category: 'মাসিক বেতন',
        amount: 300,
        payment_method: 'বিকাশ',
        status: 'paid',
        created_by: 'হিসাব সহকারী',
        created_at: '2026-11-16 11:30 AM',
        is_demo: true,
        seed_batch: batchId,
        trap_id: 'TRAP-03'
      }
    ]
  };
}
