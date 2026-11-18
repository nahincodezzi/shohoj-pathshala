import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { TenantRepository } from '../services/tenantStorage';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ThemeToggle from '../components/common/ThemeToggle';
import { useToast } from '../components/ui/ToastContext';
import { toBengaliNumber } from '../utils/dateFormatter';
import { 
  CreditCard, 
  Search, 
  CheckCircle2, 
  ArrowLeft, 
  Printer, 
  ShieldCheck, 
  QrCode, 
  Building2, 
  Calendar, 
  User, 
  Phone, 
  Sparkles, 
  AlertCircle,
  FileText,
  Lock,
  ChevronRight,
  ExternalLink,
  Receipt
} from 'lucide-react';

// Number to Bengali Words helper for money receipt
function numberToBengaliWords(num) {
  const n = Number(num);
  if (isNaN(n) || n <= 0) return 'শূন্য টাকা মাত্র';
  const units = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়'];
  const teens = ['দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ'];
  const tens = ['', '', 'বিশ', 'ত্রিশ', 'চল্লিশ', 'পঞ্চাশ', 'ষাট', 'সত্তর', 'আশি', 'নব্বই'];

  function convertTwoDigits(val) {
    if (val < 10) return units[val];
    if (val < 20) return teens[val - 10];
    const t = Math.floor(val / 10);
    const u = val % 10;
    return tens[t] + (u ? ' ' + units[u] : '');
  }

  let words = '';
  const thousand = Math.floor(n / 1000);
  const remainderAfterThousand = n % 1000;
  const hundred = Math.floor(remainderAfterThousand / 100);
  const remainder = remainderAfterThousand % 100;

  if (thousand > 0) {
    words += (thousand === 1 ? 'এক হাজার ' : convertTwoDigits(thousand) + ' হাজার ');
  }
  if (hundred > 0) {
    words += units[hundred] + ' শত ';
  }
  if (remainder > 0) {
    words += convertTwoDigits(remainder) + ' ';
  }

  return (words.trim() || 'শূন্য') + ' টাকা মাত্র';
}

export default function StudentFeePaymentPage() {
  const { slug } = useParams();
  const { showToast } = useToast();

  const [school, setSchool] = useState(null);
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState('pay'); // 'pay' | 'lookup'

  // Student Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [student, setStudent] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Fee Selection State
  const [selectedMonths, setSelectedMonths] = useState(['নভেম্বর']);
  const [feeCategories, setFeeCategories] = useState({
    monthlyTuition: true,
    examFee: false,
    sessionFee: false,
    digitalFee: false
  });
  const [monthlyRate, setMonthlyRate] = useState(300);
  const [examFeeAmount, setExamFeeAmount] = useState(500);
  const [sessionFeeAmount, setSessionFeeAmount] = useState(800);
  const [digitalFeeAmount, setDigitalFeeAmount] = useState(100);

  const [payerPhone, setPayerPhone] = useState('01812345678');

  // Checkout Modal States
  const [bkashModalOpen, setBkashModalOpen] = useState(false);
  const [bkashStep, setBkashStep] = useState(1); // 1: phone, 2: otp, 3: pin, 4: processing
  const [bkashPhone, setBkashPhone] = useState('01812345678');
  const [bkashOtp, setBkashOtp] = useState('123456');
  const [bkashPin, setBkashPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [nagadModalOpen, setNagadModalOpen] = useState(false);
  const [nagadStep, setNagadStep] = useState(1);
  const [nagadPhone, setNagadPhone] = useState('01712345678');
  const [nagadOtp, setNagadOtp] = useState('654321');
  const [nagadPin, setNagadPin] = useState('');

  // Success & Receipt State
  const [paidReceipt, setPaidReceipt] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Receipt Lookup State
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupReceipts, setLookupReceipts] = useState([]);
  const [lookupSearched, setLookupSearched] = useState(false);

  useEffect(() => {
    if (slug) {
      const s = TenantRepository.getSchoolBySlug(slug);
      if (s) {
        setSchool(s);
        const setts = TenantRepository.getSettings(s.id);
        setSettings(setts);
      }
    }
  }, [slug]);

  // Generate QR Code when a receipt is generated
  useEffect(() => {
    if (paidReceipt && school) {
      const verifyUrl = `${window.location.origin}/${school.slug}/fees?receipt=${paidReceipt.receipt_no}`;
      QRCode.toDataURL(verifyUrl, {
        width: 120,
        margin: 1,
        color: { dark: '#064E3B', light: '#FFFFFF' }
      })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('QR Gen error:', err));
    }
  }, [paidReceipt, school]);

  // Search Student
  const handleStudentSearch = (e) => {
    if (e) e.preventDefault();
    setSearchError('');
    setStudent(null);
    setPaidReceipt(null);

    if (!searchQuery.trim()) {
      setSearchError('অনুগ্রহ করে শিক্ষার্থীর আইডি বা রোল নম্বর লিখুন');
      return;
    }

    if (!school) return;
    const allStudents = TenantRepository.getStudents(school.id);
    const q = searchQuery.trim().toLowerCase();

    const match = allStudents.find(s => 
      s.student_id?.toLowerCase() === q ||
      String(s.roll) === q ||
      s.name_bn?.toLowerCase().includes(q) ||
      s.name_en?.toLowerCase().includes(q)
    );

    if (match) {
      setStudent(match);
      if (match.guardian_phone || match.phone) {
        setPayerPhone(match.guardian_phone || match.phone);
        setBkashPhone(match.guardian_phone || match.phone);
        setNagadPhone(match.guardian_phone || match.phone);
      }
    } else {
      setSearchError(`'${searchQuery}' আইডির কোনো শিক্ষার্থী খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক আইডি দিন।`);
    }
  };

  // Quick Demo Student Fill
  const handleDemoStudentFill = (demoId = 'BDHS-2026-1001') => {
    setSearchQuery(demoId);
    if (!school) return;
    const allStudents = TenantRepository.getStudents(school.id);
    const match = allStudents.find(s => s.student_id === demoId) || allStudents[0];
    if (match) {
      setStudent(match);
      setSearchError('');
      setPaidReceipt(null);
    }
  };

  // Toggle Month
  const toggleMonth = (month) => {
    if (selectedMonths.includes(month)) {
      if (selectedMonths.length === 1) {
        showToast('কমপক্ষে একটি মাস নির্বাচন করতে হবে', 'warning');
        return;
      }
      setSelectedMonths(selectedMonths.filter(m => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  // Calculate Total
  const calculateTotal = () => {
    let sum = 0;
    if (feeCategories.monthlyTuition) {
      sum += selectedMonths.length * monthlyRate;
    }
    if (feeCategories.examFee) {
      sum += examFeeAmount;
    }
    if (feeCategories.sessionFee) {
      sum += sessionFeeAmount;
    }
    if (feeCategories.digitalFee) {
      sum += digitalFeeAmount;
    }
    return sum;
  };

  const totalAmount = calculateTotal();

  // Complete Payment and Create Official Receipt
  const executePayment = (method, txnId) => {
    setIsProcessing(true);
    setTimeout(() => {
      try {
        let catDesc = [];
        if (feeCategories.monthlyTuition) {
          catDesc.push(`মাসিক বেতন (${selectedMonths.join(', ')})`);
        }
        if (feeCategories.examFee) catDesc.push('পরীক্ষার ফি');
        if (feeCategories.sessionFee) catDesc.push('সেশন ও উন্নয়ন তহবিল');
        if (feeCategories.digitalFee) catDesc.push('ডিজিটাল সেবা ফি');

        const newReceipt = TenantRepository.createReceipt(
          school.id,
          {
            student_id: student.student_id,
            student_name: student.name_bn,
            class: student.class,
            roll: student.roll,
            category: catDesc.join(' + ') || 'সাধারণ শিক্ষাদান ফি',
            amount: totalAmount,
            method: method, // 'bkash' or 'nagad'
            transaction_id: txnId,
            payer_phone: payerPhone,
            payment_source: 'পাবলিক অনলাইন সেলফ-সার্ভিস'
          },
          'অনলাইন পেমেন্ট গেটওয়ে'
        );

        setPaidReceipt(newReceipt);
        setIsProcessing(false);
        setBkashModalOpen(false);
        setNagadModalOpen(false);
        showToast('ফি সফলভাবে পরিশোধিত হয়েছে! ডিজিটাল মানি রিসিট প্রস্তুত।');
      } catch (err) {
        setIsProcessing(false);
        showToast(err.message || 'পেমেন্ট সম্পন্ন হতে ব্যর্থ হয়েছে', 'error');
      }
    }, 1500);
  };

  // Handle bKash Flow
  const handleBkashNext = (e) => {
    e.preventDefault();
    if (bkashStep === 1) {
      if (!bkashPhone || bkashPhone.length < 11) {
        showToast('১১ ডিজিটের সঠিক বিকাশ নম্বর দিন', 'error');
        return;
      }
      setBkashStep(2);
    } else if (bkashStep === 2) {
      if (!bkashOtp || bkashOtp.length < 4) {
        showToast('ভেরিফিকেশন ওটিপি কোড দিন', 'error');
        return;
      }
      setBkashStep(3);
    } else if (bkashStep === 3) {
      if (!bkashPin || bkashPin.length < 4) {
        showToast('বিকাশ পিন নম্বর লিখুন', 'error');
        return;
      }
      const fakeTxn = `BK${Math.random().toString(36).substring(2, 8).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
      executePayment('bkash', fakeTxn);
    }
  };

  // Handle Nagad Flow
  const handleNagadNext = (e) => {
    e.preventDefault();
    if (nagadStep === 1) {
      if (!nagadPhone || nagadPhone.length < 11) {
        showToast('১১ ডিজিটের সঠিক নগদ নম্বর দিন', 'error');
        return;
      }
      setNagadStep(2);
    } else if (nagadStep === 2) {
      if (!nagadOtp || nagadOtp.length < 4) {
        showToast('ওটিপি কোড দিন', 'error');
        return;
      }
      setNagadStep(3);
    } else if (nagadStep === 3) {
      if (!nagadPin || nagadPin.length < 4) {
        showToast('নগদ পিন নম্বর লিখুন', 'error');
        return;
      }
      const fakeTxn = `NG${Math.random().toString(36).substring(2, 8).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
      executePayment('nagad', fakeTxn);
    }
  };

  // Handle Receipt Lookup
  const handleLookup = (e) => {
    if (e) e.preventDefault();
    if (!school) return;
    const allReceipts = TenantRepository.getReceipts(school.id);
    const q = lookupQuery.trim().toLowerCase();
    setLookupSearched(true);

    if (!q) {
      setLookupReceipts(allReceipts.slice(0, 5));
      return;
    }

    const matches = allReceipts.filter(r => 
      r.receipt_no?.toLowerCase().includes(q) ||
      r.student_id?.toLowerCase().includes(q) ||
      String(r.roll) === q ||
      r.student_name?.toLowerCase().includes(q) ||
      r.transaction_id?.toLowerCase().includes(q)
    );
    setLookupReceipts(matches);
  };

  if (!school) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Building2 className="w-12 h-12 text-primary mx-auto animate-bounce" />
          <p className="text-sm text-muted">স্কুল তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const allMonths = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 
    'মে', 'জুন', 'জুলাই', 'আগস্ট', 
    'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-on-primary">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to={`/${school.slug}`} className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
            <img
              src={school.logo || school.logo_url || '/favicon.svg'}
              alt={school.name_bn}
              className="w-9 h-9 rounded-full object-contain border border-border p-0.5"
            />
            <div>
              <span className="text-sm font-bold font-heading text-text block leading-tight">
                {school.name_bn}
              </span>
              <span className="text-[10px] text-muted font-mono block">
                অনলাইন ফি প্রদান পোর্টাল (Digital Fee Counter)
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle slug={school.slug} />
            <Link to={`/${school.slug}`}>
              <Button variant="secondary" size="xs" icon={ArrowLeft}>
                মূল ওয়েবসাইটে ফিরুন
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-3 no-print">
          <button
            type="button"
            onClick={() => {
              setActiveTab('pay');
              setPaidReceipt(null);
            }}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'pay'
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 scale-105'
                : 'bg-surface-2 text-muted hover:text-text border border-border'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>ফি পরিশোধ করুন (Pay Online)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('lookup');
              handleLookup();
            }}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'lookup'
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 scale-105'
                : 'bg-surface-2 text-muted hover:text-text border border-border'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>রসিদ অনুসন্ধান ও ডাউনলোড</span>
          </button>
        </div>

        {/* ================= TAB 1: PAY FEES ONLINE ================= */}
        {activeTab === 'pay' && !paidReceipt && (
          <div className="space-y-6 animate-fade-in">
            {/* Step 1: Student Lookup */}
            <Card surface="surface" className="p-6 sm:p-8 space-y-6 border border-border shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-bold text-xs">
                    ১
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-heading text-text">শিক্ষার্থী তথ্য যাচাই করুন</h3>
                    <p className="text-[11px] text-muted">শিক্ষার্থীর আইডি অথবা রোল নম্বর দিয়ে তথ্য বের করুন</p>
                  </div>
                </div>

                {/* Quick Demo Pill */}
                <button
                  type="button"
                  onClick={() => handleDemoStudentFill('BDHS-2026-1001')}
                  className="text-[11px] font-mono text-primary bg-primary-soft hover:bg-primary-soft/80 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                >
                  ডেমো আইডি ট্রাই করুন ⚡
                </button>
              </div>

              <form onSubmit={handleStudentSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. BDHS-2026-1001 অথবা ১ (রোল নম্বর)"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-border bg-surface-2 text-text font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <Button variant="primary" size="md" icon={Search} type="submit">
                  অনুসন্ধান
                </Button>
              </form>

              {searchError && (
                <div className="p-3 rounded-xl bg-danger-soft text-danger text-xs flex items-center gap-2 border border-danger/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}

              {/* Student Verified Card */}
              {student && (
                <div className="p-4 sm:p-5 rounded-2xl bg-primary-soft/30 border border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                      {student.name_bn.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-text font-heading">
                          {student.name_bn}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-success text-on-primary font-bold">
                          সক্রিয় শিক্ষার্থী
                        </span>
                      </div>
                      <div className="text-xs text-muted font-mono mt-0.5">
                        আইডি: <strong className="text-primary">{student.student_id}</strong> • শ্রেণি: {toBengaliNumber(student.class)}ম (রোল: {toBengaliNumber(student.roll)}) {student.section ? `• শাখা: ${student.section}` : ''}
                      </div>
                      <div className="text-[11px] text-muted mt-0.5">
                        পিতা: {student.father_name_bn || student.guardian_name || '—'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
                      ভর্তি শিক্ষাবর্ষ
                    </span>
                    <span className="text-xs font-bold font-mono text-text">
                      {student.session || '২০২৬'}
                    </span>
                  </div>
                </div>
              )}
            </Card>

            {/* Step 2: Fee Selection (Only if Student is Found) */}
            {student && (
              <Card surface="surface" className="p-6 sm:p-8 space-y-6 border border-border shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-bold text-xs">
                    ২
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-heading text-text">ফি বিবরণ ও মাস নির্বাচন</h3>
                    <p className="text-[11px] text-muted">যে যে খাতের ফি প্রদান করতে চান তা সিলেক্ট করুন</p>
                  </div>
                </div>

                {/* Monthly Tuition Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={feeCategories.monthlyTuition}
                        onChange={(e) => setFeeCategories({ ...feeCategories, monthlyTuition: e.target.checked })}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-bold text-text">মাসিক বেতন (মাস নির্বাচন করুন)</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-primary">
                      ৳{monthlyRate}/মাস
                    </span>
                  </div>

                  {feeCategories.monthlyTuition && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                      {allMonths.map((m) => {
                        const isSelected = selectedMonths.includes(m);
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => toggleMonth(m)}
                            className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-on-primary shadow-xs font-bold border border-primary'
                                : 'bg-surface-2 text-muted hover:border-border border border-transparent'
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Other Fee Checkboxes */}
                <div className="space-y-2.5 pt-3 border-t border-border">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={feeCategories.examFee}
                        onChange={(e) => setFeeCategories({ ...feeCategories, examFee: e.target.checked })}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-semibold text-text">বার্ষিক / অর্ধবার্ষিক পরীক্ষার ফি</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-text">৳{examFeeAmount}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={feeCategories.sessionFee}
                        onChange={(e) => setFeeCategories({ ...feeCategories, sessionFee: e.target.checked })}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-semibold text-text">সেশন চার্জ ও উন্নয়ন তহবিল</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-text">৳{sessionFeeAmount}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={feeCategories.digitalFee}
                        onChange={(e) => setFeeCategories({ ...feeCategories, digitalFee: e.target.checked })}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-semibold text-text">স্মার্ট আইডি ও ডিজিটাল সফটওয়্যার ফি</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-text">৳{digitalFeeAmount}</span>
                  </div>
                </div>

                {/* Payer Mobile */}
                <div className="pt-2">
                  <Input
                    label="অভিভাবক / পেয়ার মোবাইল নম্বর (SMS কনফার্মেশনের জন্য) *"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>

                {/* Total Summary Breakdown */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-2 border border-border space-y-2">
                  <div className="flex justify-between text-xs text-muted">
                    <span>নির্বাচিত খাতের মোট ফি:</span>
                    <span className="font-mono font-bold text-text">৳{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted">
                    <span>অনলাইন গেটওয়ে চার্জ:</span>
                    <span className="font-mono font-bold text-success">৳০ (ফ্রি / প্রতিষ্ঠান বহন করছে)</span>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between items-center text-sm font-bold">
                    <span className="text-text">সর্বমোট পরিশোধযোগ্য:</span>
                    <span className="text-xl sm:text-2xl font-mono font-black text-primary">
                      ৳{totalAmount.toLocaleString('bn-BD')}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted text-right font-serif">
                    কথায়: {numberToBengaliWords(totalAmount)}
                  </div>
                </div>

                {/* Step 3: Payment Buttons (bKash & Nagad) */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-text block">
                    ৩. পেমেন্ট মাধ্যম নির্বাচন করুন (১-ক্লিক অনলাইন চেকআউট):
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* bKash Checkout Button */}
                    <button
                      type="button"
                      disabled={totalAmount <= 0}
                      onClick={() => {
                        setBkashStep(1);
                        setBkashPin('');
                        setBkashModalOpen(true);
                      }}
                      className="p-4 rounded-2xl border-2 border-[#D12053]/40 bg-[#D12053]/10 hover:bg-[#D12053]/20 text-[#D12053] font-bold transition-all shadow-md flex items-center justify-between cursor-pointer disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#D12053] text-white flex items-center justify-center font-black text-sm shrink-0">
                          bK
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold">বিকাশ (bKash)</div>
                          <div className="text-[11px] opacity-80">ইনস্ট্যান্ট পেমেন্ট গেটওয়ে</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold bg-[#D12053] text-white px-3 py-1 rounded-full">
                        ৳{totalAmount}
                      </span>
                    </button>

                    {/* Nagad Checkout Button */}
                    <button
                      type="button"
                      disabled={totalAmount <= 0}
                      onClick={() => {
                        setNagadStep(1);
                        setNagadPin('');
                        setNagadModalOpen(true);
                      }}
                      className="p-4 rounded-2xl border-2 border-[#E31A22]/40 bg-[#E31A22]/10 hover:bg-[#E31A22]/20 text-[#E31A22] font-bold transition-all shadow-md flex items-center justify-between cursor-pointer disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E31A22] text-white flex items-center justify-center font-black text-sm shrink-0">
                          নগদ
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold">নগদ (Nagad)</div>
                          <div className="text-[11px] opacity-80">ডাক বিভাগ ডিজিটাল ওয়ালেট</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold bg-[#E31A22] text-white px-3 py-1 rounded-full">
                        ৳{totalAmount}
                      </span>
                    </button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ================= PAYMENT SUCCESS & 2-PART OFFICIAL RECEIPT ================= */}
        {paidReceipt && (
          <div className="space-y-6 animate-fade-in">
            {/* Success Announcement Banner */}
            <div className="p-6 rounded-3xl bg-success-soft border border-success/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left no-print">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-success text-on-primary flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-text">
                    পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!
                  </h3>
                  <p className="text-xs text-muted">
                    ট্রানজেকশন আইডি: <code className="font-mono font-bold text-success">{paidReceipt.transaction_id}</code> • রসিদ নং: <span className="font-mono text-text font-bold">{paidReceipt.receipt_no}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="md"
                  icon={Printer}
                  onClick={() => window.print()}
                >
                  মানি রিসিট প্রিন্ট করুন
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setPaidReceipt(null);
                    setStudent(null);
                    setSearchQuery('');
                  }}
                >
                  নতুন ফি দিন
                </Button>
              </div>
            </div>

            {/* ================= 2-PART PRINTABLE MONEY RECEIPT (1-A4 STRICT FORMAT) ================= */}
            <div className="printable-sheet bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-2xl border-2 border-emerald-900/30 max-w-[850px] mx-auto min-h-[500px] flex flex-col justify-between font-serif">
              {/* Dual Copy: Left = Office Copy, Right = Student Copy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y-2 md:divide-y-0 md:divide-x-2 divide-dashed divide-emerald-900/40">
                {/* 1. Office Copy (অফিস কপি) */}
                <div className="space-y-4 pr-0 md:pr-4">
                  <div className="text-center pb-2 border-b border-slate-300">
                    <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded uppercase">
                      অফিস কপি (Office Copy)
                    </span>
                    <h3 className="text-base font-bold text-emerald-950 font-heading mt-1">
                      {school.name_bn}
                    </h3>
                    <p className="text-[9px] text-slate-500 font-sans">
                      EIIN: {school.eiin} • {school.district} • অনলাইন মানি রিসিট
                    </p>
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-600 pb-1 border-b border-slate-200">
                    <span>রসিদ: <strong>{paidReceipt.receipt_no}</strong></span>
                    <span>তারিখ: {new Date().toLocaleDateString('bn-BD')}</span>
                  </div>

                  <div className="text-xs space-y-1 font-sans">
                    <div className="flex justify-between">
                      <span className="text-slate-500">শিক্ষার্থী:</span>
                      <strong className="text-slate-900">{paidReceipt.student_name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">আইডি ও রোল:</span>
                      <span className="font-mono">{paidReceipt.student_id} • রোল: {toBengaliNumber(paidReceipt.roll)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">শ্রেণি:</span>
                      <span>{toBengaliNumber(paidReceipt.class)}ম শ্রেণি</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">পেমেন্ট মাধ্যম:</span>
                      <span className="font-bold text-emerald-800 uppercase">{paidReceipt.method} (Online)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ট্রানজেকশন ID:</span>
                      <span className="font-mono font-bold text-slate-800">{paidReceipt.transaction_id}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs font-sans">
                    <div className="text-slate-600 text-[11px]">{paidReceipt.category}</div>
                    <div className="flex justify-between font-bold text-sm text-emerald-950 pt-1 border-t border-slate-200 font-mono">
                      <span>পরিশোধিত টাকা:</span>
                      <span>৳{paidReceipt.amount.toLocaleString('bn-BD')}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-600 font-serif">
                    কথায়: {numberToBengaliWords(paidReceipt.amount)}
                  </div>

                  <div className="pt-6 flex items-end justify-between text-[10px] text-slate-500 font-sans">
                    <div className="flex items-center gap-1.5">
                      {qrCodeUrl && <img src={qrCodeUrl} alt="QR" className="w-14 h-14 border border-slate-200 p-0.5" />}
                      <span className="text-[8px] leading-tight text-slate-400">ডিজিটাল ভেরিফাইড রসিদ</span>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-slate-800 w-24 mb-1"></div>
                      <span>হিসাবরক্ষক স্বাক্ষর</span>
                    </div>
                  </div>
                </div>

                {/* 2. Student Copy (শিক্ষার্থী কপি) */}
                <div className="space-y-4 pt-6 md:pt-0 pl-0 md:pl-4">
                  <div className="text-center pb-2 border-b border-slate-300">
                    <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded uppercase">
                      শিক্ষার্থী কপি (Student Copy)
                    </span>
                    <h3 className="text-base font-bold text-emerald-950 font-heading mt-1">
                      {school.name_bn}
                    </h3>
                    <p className="text-[9px] text-slate-500 font-sans">
                      EIIN: {school.eiin} • {school.district} • অনলাইন মানি রিসিট
                    </p>
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-600 pb-1 border-b border-slate-200">
                    <span>রসিদ: <strong>{paidReceipt.receipt_no}</strong></span>
                    <span>তারিখ: {new Date().toLocaleDateString('bn-BD')}</span>
                  </div>

                  <div className="text-xs space-y-1 font-sans">
                    <div className="flex justify-between">
                      <span className="text-slate-500">শিক্ষার্থী:</span>
                      <strong className="text-slate-900">{paidReceipt.student_name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">আইডি ও রোল:</span>
                      <span className="font-mono">{paidReceipt.student_id} • রোল: {toBengaliNumber(paidReceipt.roll)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">শ্রেণি:</span>
                      <span>{toBengaliNumber(paidReceipt.class)}ম শ্রেণি</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">পেমেন্ট মাধ্যম:</span>
                      <span className="font-bold text-emerald-800 uppercase">{paidReceipt.method} (Online)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ট্রানজেকশন ID:</span>
                      <span className="font-mono font-bold text-slate-800">{paidReceipt.transaction_id}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200/60 space-y-1 text-xs font-sans">
                    <div className="text-slate-600 text-[11px]">{paidReceipt.category}</div>
                    <div className="flex justify-between font-bold text-sm text-emerald-950 pt-1 border-t border-emerald-200 font-mono">
                      <span>পরিশোধিত টাকা:</span>
                      <span>৳{paidReceipt.amount.toLocaleString('bn-BD')}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-600 font-serif">
                    কথায়: {numberToBengaliWords(paidReceipt.amount)}
                  </div>

                  <div className="pt-6 flex items-end justify-between text-[10px] text-slate-500 font-sans">
                    <div className="flex items-center gap-1.5">
                      {qrCodeUrl && <img src={qrCodeUrl} alt="QR" className="w-14 h-14 border border-slate-200 p-0.5" />}
                      <span className="text-[8px] leading-tight text-slate-400">সহজ পাঠশালা পে গেটওয়ে</span>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-slate-800 w-24 mb-1"></div>
                      <span>কর্তৃপক্ষ অনুমোদন</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: RECEIPT LOOKUP & VERIFY ================= */}
        {activeTab === 'lookup' && (
          <div className="space-y-6 animate-fade-in">
            <Card surface="surface" className="p-6 sm:p-8 space-y-6 border border-border shadow-lg">
              <div>
                <h3 className="text-base font-bold font-heading text-text">মানি রিসিট অনুসন্ধান ও ডাউনলোড</h3>
                <p className="text-xs text-muted mt-0.5">
                  পূর্বে পরিশোধিত ফি-এর রসিদ নম্বর বা শিক্ষার্থী আইডি দিয়ে রসিদ খুঁজুন
                </p>
              </div>

              <form onSubmit={handleLookup} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="e.g. REC-BDHS-2026-1101-9821 অথবা BDHS-2026-1001"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-border bg-surface-2 text-text font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <Button variant="primary" size="md" icon={Search} type="submit">
                  খুঁজুন
                </Button>
              </form>

              {/* Lookup Results */}
              <div className="space-y-3 pt-2">
                {lookupReceipts.length === 0 ? (
                  <div className="text-center py-8 text-muted text-xs">
                    কোনো রসিদ খুঁজে পাওয়া যায়নি।
                  </div>
                ) : (
                  lookupReceipts.map((rcpt) => (
                    <div
                      key={rcpt.id}
                      className="p-4 rounded-xl bg-surface-2 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-text">{rcpt.receipt_no}</span>
                          <Badge variant={rcpt.status === 'paid' ? 'success' : 'danger'}>
                            {rcpt.status === 'paid' ? 'পরিশোধিত' : 'বাতিল'}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted">
                          শিক্ষার্থী: <strong className="text-text">{rcpt.student_name}</strong> ({rcpt.student_id}) • {toBengaliNumber(rcpt.class)}ম শ্রেণি
                        </div>
                        <div className="text-[11px] text-muted">
                          খাত: {rcpt.category} • মাধ্যম: <strong className="uppercase">{rcpt.method}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:text-right shrink-0">
                        <div>
                          <div className="text-base font-mono font-extrabold text-primary">
                            ৳{rcpt.amount.toLocaleString('bn-BD')}
                          </div>
                          <div className="text-[10px] text-muted font-mono">{rcpt.created_at}</div>
                        </div>

                        <Button
                          variant="secondary"
                          size="xs"
                          icon={Printer}
                          onClick={() => {
                            setPaidReceipt(rcpt);
                            setActiveTab('pay');
                          }}
                        >
                          রসিদ দেখুন
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* ================= BKASH PAYMENT MODAL ================= */}
      <Modal
        isOpen={bkashModalOpen}
        onClose={() => !isProcessing && setBkashModalOpen(false)}
        maxWidth="max-w-md"
        className="!p-0 overflow-hidden"
      >
        <div className="bg-[#D12053] text-white p-5 text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#D12053] flex items-center justify-center font-black text-xl mx-auto mb-2 shadow-md">
            bK
          </div>
          <h3 className="text-base font-bold">bKash Payment Gateway</h3>
          <p className="text-xs text-white/90 mt-0.5">Merchant: {school.name_bn}</p>
          <div className="mt-3 inline-block px-4 py-1 rounded-full bg-white/20 font-mono font-bold text-lg">
            ৳{totalAmount.toLocaleString('bn-BD')}
          </div>
        </div>

        <div className="p-6 bg-surface space-y-4">
          {bkashStep === 1 && (
            <form onSubmit={handleBkashNext} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">আপনার বিকাশ অ্যাকাউন্ট নম্বর:</label>
                <Input
                  value={bkashPhone}
                  onChange={(e) => setBkashPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="font-mono text-sm"
                  required
                />
                <p className="text-[10px] text-muted">পরবর্তী ধাপে এই নম্বরে একটি ওটিপি কোড পাঠানো হবে।</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setBkashModalOpen(false)}>
                  বাতিল
                </Button>
                <Button variant="primary" type="submit" className="!bg-[#D12053] !border-[#D12053] !text-white hover:opacity-90">
                  পরবর্তী ধাপ ›
                </Button>
              </div>
            </form>
          )}

          {bkashStep === 2 && (
            <form onSubmit={handleBkashNext} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">৬-ডিজিটের ভেরিফিকেশন ওটিপি (OTP):</label>
                <Input
                  value={bkashOtp}
                  onChange={(e) => setBkashOtp(e.target.value)}
                  placeholder="123456"
                  className="font-mono text-center tracking-widest text-lg font-bold"
                  required
                />
                <p className="text-[10px] text-success text-center">ডেমো ওটিপি '123456' স্বয়ংক্রিয়ভাবে প্রদান করা আছে।</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setBkashStep(1)}>
                  পূর্ববর্তী
                </Button>
                <Button variant="primary" type="submit" className="!bg-[#D12053] !border-[#D12053] !text-white hover:opacity-90">
                  যাচাই করুন ›
                </Button>
              </div>
            </form>
          )}

          {bkashStep === 3 && (
            <form onSubmit={handleBkashNext} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">বিকাশ পিন নম্বর (PIN):</label>
                <Input
                  type="password"
                  value={bkashPin}
                  onChange={(e) => setBkashPin(e.target.value)}
                  placeholder="••••"
                  maxLength={5}
                  className="font-mono text-center tracking-widest text-xl font-bold"
                  required
                />
                <p className="text-[10px] text-muted text-center flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-success" />
                  নিরাপদ ও এনক্রিপ্টেড পেমেন্ট প্রসেসিং
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setBkashStep(2)}>
                  পূর্ববর্তী
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={isProcessing}
                  className="!bg-[#D12053] !border-[#D12053] !text-white hover:opacity-90"
                >
                  {isProcessing ? 'পেমেন্ট হচ্ছে...' : `৳${totalAmount} পরিশোধ করুন`}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* ================= NAGAD PAYMENT MODAL ================= */}
      <Modal
        isOpen={nagadModalOpen}
        onClose={() => !isProcessing && setNagadModalOpen(false)}
        maxWidth="max-w-md"
        className="!p-0 overflow-hidden"
      >
        <div className="bg-[#E31A22] text-white p-5 text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#E31A22] flex items-center justify-center font-black text-sm mx-auto mb-2 shadow-md">
            নগদ
          </div>
          <h3 className="text-base font-bold">নগদ ডিজিটাল পেমেন্ট</h3>
          <p className="text-xs text-white/90 mt-0.5">মার্চেন্ট: {school.name_bn}</p>
          <div className="mt-3 inline-block px-4 py-1 rounded-full bg-white/20 font-mono font-bold text-lg">
            ৳{totalAmount.toLocaleString('bn-BD')}
          </div>
        </div>

        <div className="p-6 bg-surface space-y-4">
          {nagadStep === 1 && (
            <form onSubmit={handleNagadNext} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">আপনার নগদ অ্যাকাউন্ট নম্বর:</label>
                <Input
                  value={nagadPhone}
                  onChange={(e) => setNagadPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="font-mono text-sm"
                  required
                />
                <p className="text-[10px] text-muted">পরবর্তী ধাপে সিকিউরিটি ওটিপি পাঠানো হবে।</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setNagadModalOpen(false)}>
                  বাতিল
                </Button>
                <Button variant="primary" type="submit" className="!bg-[#E31A22] !border-[#E31A22] !text-white hover:opacity-90">
                  পরবর্তী ধাপ ›
                </Button>
              </div>
            </form>
          )}

          {nagadStep === 2 && (
            <form onSubmit={handleNagadNext} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">৪ বা ৬ ডিজিট নগদ ওটিপি (OTP):</label>
                <Input
                  value={nagadOtp}
                  onChange={(e) => setNagadOtp(e.target.value)}
                  placeholder="654321"
                  className="font-mono text-center tracking-widest text-lg font-bold"
                  required
                />
                <p className="text-[10px] text-success text-center">ডেমো ওটিপি '654321' প্রস্তুত আছে।</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setNagadStep(1)}>
                  পূর্ববর্তী
                </Button>
                <Button variant="primary" type="submit" className="!bg-[#E31A22] !border-[#E31A22] !text-white hover:opacity-90">
                  যাচাই করুন ›
                </Button>
              </div>
            </form>
          )}

          {nagadStep === 3 && (
            <form onSubmit={handleNagadNext} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">নগদ পিন কোড (PIN):</label>
                <Input
                  type="password"
                  value={nagadPin}
                  onChange={(e) => setNagadPin(e.target.value)}
                  placeholder="••••"
                  maxLength={5}
                  className="font-mono text-center tracking-widest text-xl font-bold"
                  required
                />
                <p className="text-[10px] text-muted text-center flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-success" />
                  ডাক বিভাগ নিরাপত্তা নিশ্চিতকৃত
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setNagadStep(2)}>
                  পূর্ববর্তী
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={isProcessing}
                  className="!bg-[#E31A22] !border-[#E31A22] !text-white hover:opacity-90"
                >
                  {isProcessing ? 'পেমেন্ট হচ্ছে...' : `৳${totalAmount} নিশ্চিত করুন`}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center text-xs text-muted font-mono no-print">
        সহজ পাঠশালা ডিজিটাল এডুকেশন নেটওয়ার্ক • নিরাপদ অনলাইন ফি পরিশোধ ও রসিদ ব্যবস্থাপনা
      </footer>
    </div>
  );
}
