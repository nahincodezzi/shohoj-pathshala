import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { TenantRepository } from '../../../services/tenantStorage';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import GridTable from '../../../components/ui/GridTable';
import { toBengaliNumber } from '../../../utils/dateFormatter';
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  DollarSign, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  Wallet,
  Sparkles,
  BarChart3
} from 'lucide-react';

export default function DashboardOverview() {
  const { school, currentUser, supportMode } = useOutletContext();

  const students = TenantRepository.getStudents(school.id);
  const admissions = TenantRepository.getAdmissions(school.id);
  const receipts = TenantRepository.getReceipts(school.id);
  const auditLogs = TenantRepository.getAuditLogs(school.id);

  const pendingAdmissions = admissions.filter(a => a.status === 'pending');
  const paidReceipts = receipts.filter(r => r.status === 'paid');
  const totalFees = paidReceipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  // Class-wise student distribution
  const classesList = ['6', '7', '8', '9', '10'];
  const classStats = classesList.map(c => {
    const count = students.filter(s => String(s.class) === c).length;
    return {
      className: `${toBengaliNumber(c)}ম শ্রেণি`,
      count,
      pct: students.length > 0 ? Math.round((count / students.length) * 100) : 0
    };
  });

  // Fee collection methods breakdown
  const methodStats = {
    cash: paidReceipts.filter(r => r.method === 'cash').reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    bkash: paidReceipts.filter(r => r.method === 'bkash').reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    nagad: paidReceipts.filter(r => r.method === 'nagad').reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
  };

  const isTeacher = currentUser?.role === 'teacher';

  return (
    <div className="space-y-8">
      {/* ================= TODAY'S ACTION ITEMS ================= */}
      {!isTeacher && pendingAdmissions.length > 0 && (
        <div className="bg-warning-soft border border-warning-line rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/20 text-warning flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text">
                {toBengaliNumber(pendingAdmissions.length)} টি নতুন ভর্তি আবেদন অপেক্ষমাণ রয়েছে
              </h4>
              <p className="text-xs text-muted mt-0.5">
                শিক্ষার্থীদের রোল ও শ্রেণি বরাদ্দের জন্য অবিলম্বে আবেদনগুলো পর্যালোচনা করুন।
              </p>
            </div>
          </div>
          <Link to={`/${school.slug}/admin/admissions`} className="shrink-0">
            <Button variant="primary" size="sm" iconRight={ArrowRight}>
              আবেদনগুলো দেখুন
            </Button>
          </Link>
        </div>
      )}

      {/* ================= 4 STAT CARDS (Section 7.6) ================= */}
      {!isTeacher ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Students */}
          <Card surface="surface" className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-muted block mb-1">মোট শিক্ষার্থী</span>
              <p className="text-2xl sm:text-3xl font-mono font-extrabold text-primary">
                {students.length.toLocaleString('bn-BD')}
              </p>
              <span className="text-[11px] text-muted">নিবন্ধিত সক্রিয় শিক্ষার্থী</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </Card>

          {/* Pending Admissions */}
          <Card surface="surface" className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-muted block mb-1">অপেক্ষমাণ ভর্তি</span>
              <p className="text-2xl sm:text-3xl font-mono font-extrabold text-warning">
                {pendingAdmissions.length.toLocaleString('bn-BD')}
              </p>
              <span className="text-[11px] text-muted">যাচাই ও অনুমোদনের অপেক্ষায়</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning-soft text-warning flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
          </Card>

          {/* Today's Fee Collection */}
          <Card surface="surface" className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-muted block mb-1">মোট ফি আদায়</span>
              <p className="text-2xl sm:text-3xl font-mono font-extrabold text-info">
                ৳{totalFees.toLocaleString('bn-BD')}
              </p>
              <span className="text-[11px] text-muted">{paidReceipts.length} টি সফল রসিদ</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-info-soft text-info flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
          </Card>

          {/* Monthly Collection Metric */}
          <Card surface="surface" className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-muted block mb-1">প্ল্যান ও ক্যাপাসিটি</span>
              <p className="text-2xl sm:text-3xl font-mono font-extrabold text-indigo">
                {Math.round((students.length / school.max_students) * 100)}%
              </p>
              <span className="text-[11px] text-muted">সীমা: {school.max_students} জন</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-soft text-indigo flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
          </Card>
        </div>
      ) : (
        <Card surface="surface" className="p-6">
          <h3 className="text-lg font-heading font-bold text-text mb-1">শিক্ষক পোর্টালে স্বাগতম, {currentUser?.name}</h3>
          <p className="text-xs text-muted">আপনার জন্য নির্ধারিত শ্রেণির ফলাফল এন্ট্রি ও একাডেমিক নোটিশ প্রদানের অপশনগুলো বাম মেনুতে উপলব্ধ।</p>
        </Card>
      )}

      {/* ================= VISUAL ANALYTICS (Class distribution & Payment methods) ================= */}
      {!isTeacher && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Class-wise Student Distribution */}
          <Card surface="surface" className="lg:col-span-7 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-bold text-text">শ্রেণিভিত্তিক শিক্ষার্থী বণ্টন</h4>
              </div>
              <span className="text-xs text-muted font-mono">মোট {toBengaliNumber(students.length)} জন</span>
            </div>
            <div className="space-y-3 pt-1">
              {classStats.map(stat => (
                <div key={stat.className} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text">{stat.className}</span>
                    <span className="text-muted font-mono">{toBengaliNumber(stat.count)} জন ({toBengaliNumber(stat.pct)}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden border border-border">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${Math.max(stat.pct, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Payment Method Breakdown */}
          <Card surface="surface" className="lg:col-span-5 p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-4 h-4 text-info" />
                <h4 className="text-sm font-bold text-text">ফি আদায় মাধ্যম বিশ্লেষণ</h4>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-surface-2 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-xs font-semibold text-text">ক্যাশ (Cash)</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-text">৳{methodStats.cash.toLocaleString('bn-BD')}</span>
                </div>

                <div className="p-3 rounded-xl bg-surface-2 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink-500" />
                    <span className="text-xs font-semibold text-text">বিকাশ (bKash)</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-text">৳{methodStats.bkash.toLocaleString('bn-BD')}</span>
                </div>

                <div className="p-3 rounded-xl bg-surface-2 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-xs font-semibold text-text">নগদ (Nagad)</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-text">৳{methodStats.nagad.toLocaleString('bn-BD')}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted font-medium">মোট সংগৃহীত ফি</span>
              <span className="text-primary font-bold font-mono text-sm">৳{totalFees.toLocaleString('bn-BD')}</span>
            </div>
          </Card>
        </div>
      )}

      {/* ================= QUICK ACTIONS ================= */}
      <div className="flex flex-wrap items-center gap-3">
        {!isTeacher && (
          <Link to={`/${school.slug}/admin/fees`}>
            <Button variant="primary" size="md" icon={Plus}>
              নতুন রসিদ তৈরি
            </Button>
          </Link>
        )}
        <Link to={`/${school.slug}/admin/admissions`}>
          <Button variant="secondary" size="md">
            ভর্তি আবেদন দেখুন
          </Button>
        </Link>
        <Link to={`/${school.slug}/admin/notices`}>
          <Button variant="secondary" size="md">
            নোটিশ দিন
          </Button>
        </Link>
      </div>

      {/* ================= TWO COLUMNS SECTION (Section 7.6) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Admission Requests */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-heading font-bold text-text">
              সাম্প্রতিক ভর্তির আবেদন
            </h3>
            <Link to={`/${school.slug}/admin/admissions`} className="text-xs font-bold text-primary hover:underline">
              সব দেখুন →
            </Link>
          </div>

          <GridTable
            columns={[
              { key: 'tracking_id', label: 'ট্র্যাকিং কোড', width: '130px', fontMono: true },
              { key: 'name_bn', label: 'আবেদনকারী', width: '1.5fr' },
              { key: 'applied_class', label: 'শ্রেণি', width: '70px', render: (val) => `${val}ম` },
              { 
                key: 'status', 
                label: 'অবস্থা', 
                width: '100px',
                render: (val, row) => (
                  <Badge variant={val === 'approved' ? 'success' : val === 'rejected' ? 'danger' : 'warning'}>
                    {val === 'approved' ? `রোল ${row.assigned_roll}` : val === 'rejected' ? 'বাতিল' : 'অপেক্ষমাণ'}
                  </Badge>
                )
              }
            ]}
            data={admissions.slice(0, 5)}
            minWidth="460px"
          />
        </div>

        {/* Right Column: Recent Activity (Audit Log) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-heading font-bold text-text">
              সাম্প্রতিক কাজ (Audit Log)
            </h3>
            <span className="text-xs text-muted font-mono">লাইভ ট্র্যাকিং</span>
          </div>

          <Card surface="surface" className="space-y-4 p-4">
            {auditLogs.slice(0, 5).map((log) => {
              const dotColor = log.action.includes('লগইন')
                ? 'bg-primary'
                : log.action.includes('বাতিল') || log.action.includes('Void')
                ? 'bg-danger'
                : log.action.includes('অনুমোদন')
                ? 'bg-success'
                : 'bg-info';

              return (
                <div key={log.id} className="flex items-start gap-3 text-xs pb-3 border-b border-border/70 last:border-0 last:pb-0">
                  <span className={`w-2.5 h-2.5 rounded-full ${dotColor} mt-1 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-text truncate">{log.action}</span>
                      <span className="text-[10px] text-muted font-mono shrink-0">{log.created_at.split(' ')[1] || log.created_at}</span>
                    </div>
                    <p className="text-muted text-[11px] mt-0.5 truncate">{log.details}</p>
                    <span className="text-[10px] text-subtle font-mono">{log.username} ({log.role})</span>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}

