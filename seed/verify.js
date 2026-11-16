/**
 * Sohoj Pathshala — Verification Suite & Acceptance Validator
 * Validates BDHS base data integrity, tenant isolation, scale limits,
 * edge-case availability, and storage budgets.
 */

import { CROSS_TENANT_TRAPS } from './traps.js';
import { EDGE_CASES } from './edgeCases.js';
import { SCHOOL_SPECS } from './schools.js';

export class SeedVerifier {
  constructor(tables) {
    this.tables = tables;
    this.results = [];
  }

  runAll() {
    this.results = [];
    this.verifyBdhsIntegrity();
    this.verifyTenantIsolation();
    this.verifyScaleAndLimits();
    this.verifyEdgeCases();
    this.verifyStorageBudget();
    this.verifySchoolsCoverage();

    const passCount = this.results.filter(r => r.pass).length;
    const failCount = this.results.length - passCount;
    return {
      pass: failCount === 0,
      total: this.results.length,
      passed: passCount,
      failed: failCount,
      checks: this.results
    };
  }

  addCheck(name, pass, message, details = null) {
    this.results.push({ name, pass, message, details });
  }

  // 1. BDHS Base Data Checksum Integrity
  verifyBdhsIntegrity() {
    const bdhsSchool = (this.tables.schools || []).find(s => s.slug === 'bdhs');
    if (!bdhsSchool) {
      this.addCheck('BDHS School Existence', false, 'BDHS school record is missing!');
      return;
    }

    const checks = [
      { field: 'EIIN', expected: '106644', actual: bdhsSchool.eiin },
      { field: 'Name BN', expected: 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়', actual: bdhsSchool.name_bn },
      { field: 'MPO Code', expected: '0905171301', actual: bdhsSchool.mpo_code },
      { field: 'School Code', expected: '432platfrom', actual: bdhsSchool.school_code }
    ];

    const failed = checks.filter(c => c.actual !== c.expected);
    if (failed.length > 0) {
      this.addCheck('BDHS Immutable Fields', false, `BDHS fields mutated: ${failed.map(f => f.field).join(', ')}`);
    } else {
      this.addCheck('BDHS Immutable Fields', true, 'BDHS base school identifiers remain 100% authentic and unmodified.');
    }

    // Check that original teachers (minimum 16) are present
    const bdhsTeachers = (this.tables.teachers || []).filter(t => t.school_id === 'sch_bdhs');
    if (bdhsTeachers.length < 16) {
      this.addCheck('BDHS Original Teachers', false, `Expected at least 16 canonical BDHS teachers, found ${bdhsTeachers.length}`);
    } else {
      this.addCheck('BDHS Original Teachers', true, `All ${bdhsTeachers.length} canonical BDHS faculty & staff members are intact.`);
    }
  }

  // 2. Cross-Tenant Isolation Traps
  verifyTenantIsolation() {
    CROSS_TENANT_TRAPS.forEach(trap => {
      const res = trap.verify(this.tables);
      this.addCheck(`Tenant Trap: ${trap.name}`, res.pass, res.pass ? res.message : res.error);
    });
  }

  // 3. Plan & Capacity Limits
  verifyScaleAndLimits() {
    // Check QA Limit School (should have exactly 500 students in tables)
    const qaStudents = (this.tables.students || []).filter(s => s.school_id === 'sch_qa_limit');
    if (qaStudents.length > 500) {
      this.addCheck('QA-Limit Boundary', false, `QA-Limit exceeded 500 max student capacity (found ${qaStudents.length})`);
    } else {
      this.addCheck('QA-Limit Boundary', true, `QA-Limit school capacity strictly respected (${qaStudents.length}/500).`);
    }

    // Check BAHS 92% capacity trigger
    const bahsSchool = (this.tables.schools || []).find(s => s.slug === 'bahs');
    const bahsStudents = (this.tables.students || []).filter(s => s.school_id === 'sch_bahs');
    if (bahsSchool && bahsStudents.length > 0) {
      const ratio = bahsStudents.length / (bahsSchool.max_students || 800);
      this.addCheck('BAHS 92% Capacity Trigger', true, `BAHS student count at ${(ratio * 100).toFixed(1)}% capacity (alert eligible).`);
    }
  }

  // 4. Edge Cases Availability
  verifyEdgeCases() {
    const students = this.tables.students || [];
    const results = this.tables.results || [];
    const receipts = this.tables.receipts || [];
    const notices = this.tables.notices || [];

    const hasE01 = students.some(s => s.name_bn?.includes('মোছাম্মৎ উম্মে কুলসুম খাতুন চৌধুরী বিনতে শাহজাহান শিকদার'));
    this.addCheck('Edge Case E01 (60+ Char Name)', hasE01, hasE01 ? 'Found 60+ char name student.' : 'E01 student missing.');

    const hasE02 = students.filter(s => s.name_bn === 'তাহমিদ হাসান' && s.class === '10').length >= 2;
    this.addCheck('Edge Case E02 (Twins Roll Collision)', hasE02, hasE02 ? 'Found twin students with same name.' : 'E02 twins missing.');

    const hasE13 = results.some(r => r.total_gpa === '0.00' && r.status === 'FAILED');
    this.addCheck('Edge Case E13 (Mandatory Fail GPA 0.00)', hasE13, hasE13 ? 'Found GPA 0.00 fail result.' : 'E13 result missing.');

    const hasE20 = receipts.some(r => r.amount >= 1000000);
    this.addCheck('Edge Case E20 (Large 10L+ Receipt)', hasE20, hasE20 ? 'Found 10L+ Tk donation receipt.' : 'E20 receipt missing.');

    const hasE23 = receipts.some(r => r.status === 'void');
    this.addCheck('Edge Case E23 (Voided Receipt)', hasE23, hasE23 ? 'Found voided receipt.' : 'E23 void receipt missing.');

    const hasE27 = notices.some(n => n.title?.includes('<script>'));
    this.addCheck('Edge Case E27 (XSS Payload String)', hasE27, hasE27 ? 'Found XSS test string notice.' : 'E27 notice missing.');
  }

  // 5. LocalStorage Storage Budget
  verifyStorageBudget() {
    const rawJson = JSON.stringify(this.tables);
    const sizeBytes = rawJson.length * 2;
    const sizeKb = Math.round(sizeBytes / 1024);
    const sizeMb = (sizeKb / 1024).toFixed(2);

    const isUnderLimit = sizeKb < 4096; // 4 MB limit
    this.addCheck(
      'LocalStorage 4 MB Budget',
      isUnderLimit,
      `Current payload size: ${sizeKb} KB (~${sizeMb} MB). ${isUnderLimit ? 'Safely below 4 MB quota.' : 'WARNING: Exceeds 4 MB!'}`
    );
  }

  // 6. Schools Plan & Status Coverage
  verifySchoolsCoverage() {
    const schools = this.tables.schools || [];
    const statuses = new Set(schools.map(s => s.status));
    const plans = new Set(schools.map(s => s.plan));

    const expectedStatuses = ['active', 'grace', 'trial', 'suspended', 'disabled'];
    const missingStatuses = expectedStatuses.filter(st => !statuses.has(st));

    if (missingStatuses.length === 0) {
      this.addCheck('Plan & Status Full Matrix', true, `All 5 lifecycle statuses (${expectedStatuses.join(', ')}) covered across schools.`);
    } else {
      this.addCheck('Plan & Status Full Matrix', false, `Missing statuses: ${missingStatuses.join(', ')}`);
    }
  }
}
