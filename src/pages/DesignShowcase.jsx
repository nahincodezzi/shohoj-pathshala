import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Checkbox from '../components/ui/Checkbox';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import FilterChip from '../components/ui/FilterChip';
import GridTable from '../components/ui/GridTable';
import Alert from '../components/ui/Alert';
import Banner from '../components/ui/Banner';
import Stepper from '../components/ui/Stepper';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/ToastContext';
import { 
  Sparkles, 
  Search, 
  Lock, 
  User, 
  GraduationCap, 
  ArrowRight, 
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';

export default function DesignShowcase() {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeChip, setActiveChip] = useState('all');

  const sampleTableData = [
    { id: 1, roll: '১০১', name: 'আব্দুর রহমান', class: '১০ম', gpa: '৫.০০', status: '✓ PASSED' },
    { id: 2, roll: '১০২', name: 'ফাতিমা আক্তার', class: '১০ম', gpa: '৪.৭৫', status: '✓ PASSED' },
    { id: 3, roll: '১০৩', name: 'মোঃ নাঈম ইসলাম', class: '১০ম', gpa: '০.০০', status: '✕ FAILED' },
  ];

  const tableColumns = [
    { key: 'roll', label: 'রোল', width: '80px', fontMono: true },
    { key: 'name', label: 'শিক্ষার্থীর নাম', width: '1.5fr' },
    { key: 'class', label: 'শ্রেণি', width: '80px' },
    { key: 'gpa', label: 'GPA', width: '90px', fontMono: true },
    { 
      key: 'status', 
      label: 'ফলাফল', 
      width: '120px',
      render: (val) => (
        <Badge variant={val.includes('PASSED') ? 'success' : 'danger'}>
          {val}
        </Badge>
      )
    },
    { key: 'actions', label: 'কাজ', width: '60px', align: 'center' }
  ];

  return (
    <div className="min-h-screen bg-bg text-text py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-3 border border-primary/25">
            <Sparkles className="w-3.5 h-3.5" />
            ডিজাইন সিস্টেম ভিজ্যুয়াল শোকেস (/design)
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text">
            কম্পোনেন্ট লাইব্রেরি — ডার্ক ও লাইট মোড পাশাপাশি
          </h1>
          <p className="text-sm text-muted mt-2 max-w-xl mx-auto">
            নিচে প্রতিটি কম্পোনেন্ট বাম পাশে ডার্ক মোডে এবং ডান পাশে লাইট মোডে সরাসরি লাইভ রেন্ডার হচ্ছে।
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <Button size="sm" onClick={() => setModalOpen(true)}>
              মডাল টেস্ট করুন
            </Button>
            <Button size="sm" variant="secondary" onClick={() => showToast('সফলভাবে সংরক্ষিত হয়েছে!', 'success')}>
              টোস্ট টেস্ট করুন
            </Button>
          </div>
        </div>

        {/* Side by Side Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* ==================== LEFT: DARK MODE CONTAINER ==================== */}
          <div className="mode-dark bg-bg text-text p-6 sm:p-8 rounded-3xl border border-border shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
              <span className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                ডার্ক মোড (Dark Mode — Default)
              </span>
              <Badge variant="primary">mode-dark</Badge>
            </div>

            <div className="flex flex-col gap-8">
              {/* Buttons Section */}
              <div>
                <h4 className="text-xs font-mono uppercase text-muted mb-3">Buttons</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">সংরক্ষণ করুন</Button>
                  <Button variant="secondary">বাতিল</Button>
                  <Button variant="danger">মুছে ফেলুন</Button>
                  <Button variant="ghost">মেনু</Button>
                  <Button variant="primary" loading>অপেক্ষা...</Button>
                </div>
              </div>

              {/* Form Inputs & Select */}
              <div>
                <h4 className="text-xs font-mono uppercase text-muted mb-3">Inputs & Select</h4>
                <div className="space-y-4">
                  <Input 
                    label="শিক্ষার্থীর পুরো নাম" 
                    placeholder="যেমন: আব্দুর রহমান" 
                    icon={User} 
                  />
                  <Input 
                    label="মোবাইল নম্বর (ভুল ইনপুট টেস্ট)" 
                    value="017123" 
                    onChange={() => {}}
                    error="মোবাইল নম্বর ১১ ডিজিট হতে হবে" 
                  />
                  <Input 
                    label="পাসওয়ার্ড" 
                    type="password" 
                    value="Secret123" 
                    onChange={() => {}}
                    icon={Lock} 
                  />
                  <Select 
                    label="শ্রেণি নির্বাচন" 
                    options={['৬ষ্ঠ শ্রেণি', '৭ম শ্রেণি', '৮ম শ্রেণি', '৯ম শ্রেণি', '১০ম শ্রেণি']} 
                  />
                  <Checkbox 
                    label="এই ডিভাইসে মনে রাখুন" 
                    description="পরবর্তী ৩০ দিনের জন্য অটো-লগইন বজায় থাকবে।" 
                    defaultChecked 
                  />
                </div>
              </div>

              {/* Badges & Chips */}
              <div>
                <h4 className="text-xs font-mono uppercase text-muted mb-3">Badges & Chips</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="success" symbol="✓">অনুমোদিত</Badge>
                  <Badge variant="warning" symbol="●">অপেক্ষমাণ</Badge>
                  <Badge variant="danger" symbol="✕">বাতিল</Badge>
                  <Badge variant="info">পরীক্ষা</Badge>
                  <Badge variant="accent">জরুরি</Badge>
                  <Badge variant="indigo">প্ল্যাটফর্ম</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FilterChip selected={activeChip === 'all'} onClick={() => setActiveChip('all')} count={12}>
                    সকল
                  </FilterChip>
                  <FilterChip selected={activeChip === 'active'} onClick={() => setActiveChip('active')} count={8}>
                    চালু
                  </FilterChip>
                  <FilterChip selected={activeChip === 'pending'} onClick={() => setActiveChip('pending')} count={3}>
                    অপেক্ষমাণ
                  </FilterChip>
                </div>
              </div>

              {/* Stepper & Banner */}
              <div>
                <h4 className="text-xs font-mono uppercase text-muted mb-3">Stepper & Banner</h4>
                <div className="space-y-4">
                  <Stepper currentStep={2} />
                  <Banner 
                    variant="warning" 
                    actionLabel="নবায়ন করুন" 
                    onAction={() => alert('নবায়ন ক্লিক')}
                  >
                    প্ল্যানের মেয়াদ শেষ হতে ৫ দিন বাকি
                  </Banner>
                  <Alert variant="danger">
                    পাসওয়ার্ড ভুল। আর ২ বার ভুল হলে অ্যাকাউন্ট ১৫ মিনিটের জন্য লক হবে।
                  </Alert>
                </div>
              </div>

              {/* Grid Table */}
              <div>
                <h4 className="text-xs font-mono uppercase text-muted mb-3">Accessible Grid Table</h4>
                <GridTable 
                  columns={tableColumns} 
                  data={sampleTableData} 
                  zebra 
                />
              </div>

              {/* Skeleton & Empty */}
              <div>
                <h4 className="text-xs font-mono uppercase text-muted mb-3">Skeleton & Empty State</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton circle width="40px" height="40px" />
                    <div className="space-y-2 flex-1">
                      <Skeleton height="14px" width="60%" />
                      <Skeleton height="12px" width="40%" />
                    </div>
                  </div>
                  <EmptyState 
                    title="কোনো নোটিশ নেই" 
                    description="বর্তমানে এই শ্রেণিতে কোনো অফিশিয়াল নোটিশ পোস্ট করা হয়নি।" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT: LIGHT MODE CONTAINER ==================== */}
          <div className="mode-light bg-bg text-text p-6 sm:p-8 rounded-3xl border border-border shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
              <span className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                লাইট মোড (Light Mode)
              </span>
              <Badge variant="primary">mode-light</Badge>
            </div>

            <div className="flex flex-col gap-8">
              {/* Buttons Section */}
              <div>
                <h4 className="text-xs font-mono uppercase text-muted mb-3">Buttons</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">সংরক্ষণ করুন</Button>
                  <Button variant="secondary">বাতিল</Button>
                  <Button variant="danger">মুছে ফেলুন</Button>
                  <Button variant="ghost">মেনু</Button>
                  <Button variant="primary" loading>অপেক্ষা...</Button>
                </div>
              </div>

              {/* Form Inputs & Select */}
              <div>
                <h4 className="text-xs font-mono uppercase text-muted mb-3">Inputs & Select</h4>
                <div className="space-y-4">
                  <Input 
                    label="শিক্ষার্থীর পুরো নাম" 
                    placeholder="যেমন: আব্দুর রহমান" 
                    icon={User} 
                  />
                  <Input 
                    label="মোবাইল নম্বর (ভুল ইনপুট টেস্ট)" 
                    value="017123" 
                    onChange={() => {}}
                    error="মোবাইল নম্বর ১১ ডিজিট হতে হবে" 
                  />
                  <Input 
                    label="পাসওয়ার্ড" 
                    type="password" 
                    value="Secret123" 
                    onChange={() => {}}
                    icon={Lock} 
                  />
                  <Select 
                    label="শ্রেণি নির্বাচন" 
                    options={['৬ষ্ঠ শ্রেণি', '৭ম শ্রেণি', '৮ম শ্রেণি', '৯ম শ্রেণি', '১০ম শ্রেণি']} 
                  />
                  <Checkbox 
                    label="এই ডিভাইসে মনে রাখুন" 
                    description="পরবর্তী ৩০ দিনের জন্য অটো-লগইন বজায় থাকবে।" 
                    defaultChecked 
                  />
                </div>
              </div>

              {/* Badges & Chips */}
              <div>
                <h4 className="text-xs font-mono uppercase text-muted mb-3">Badges & Chips</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="success" symbol="✓">অনুমোদিত</Badge>
                  <Badge variant="warning" symbol="●">অপেক্ষমাণ</Badge>
                  <Badge variant="danger" symbol="✕">বাতিল</Badge>
                  <Badge variant="info">পরীক্ষা</Badge>
                  <Badge variant="accent">জরুরি</Badge>
                  <Badge variant="indigo">প্ল্যাটফর্ম</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FilterChip selected={activeChip === 'all'} onClick={() => setActiveChip('all')} count={12}>
                    সকল
                  </FilterChip>
                  <FilterChip selected={activeChip === 'active'} onClick={() => setActiveChip('active')} count={8}>
                    চালু
                  </FilterChip>
                  <FilterChip selected={activeChip === 'pending'} onClick={() => setActiveChip('pending')} count={3}>
                    অপেক্ষমাণ
                  </FilterChip>
                </div>
              </div>

              {/* Stepper & Banner */}
              <div>
                <h4 className="text-xs font-mono uppercase text-muted mb-3">Stepper & Banner</h4>
                <div className="space-y-4">
                  <Stepper currentStep={2} />
                  <Banner 
                    variant="warning" 
                    actionLabel="নবায়ন করুন" 
                    onAction={() => alert('নবায়ন ক্লিক')}
                  >
                    প্ল্যানের মেয়াদ শেষ হতে ৫ দিন বাকি
                  </Banner>
                  <Alert variant="danger">
                    পাসওয়ার্ড ভুল। আর ২ বার ভুল হলে অ্যাকাউন্ট ১৫ মিনিটের জন্য লক হবে।
                  </Alert>
                </div>
              </div>

              {/* Grid Table */}
              <div>
                <h4 className="text-xs font-mono uppercase text-muted mb-3">Accessible Grid Table</h4>
                <GridTable 
                  columns={tableColumns} 
                  data={sampleTableData} 
                  zebra 
                />
              </div>

              {/* Skeleton & Empty */}
              <div>
                <h4 className="text-xs font-mono uppercase text-muted mb-3">Skeleton & Empty State</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton circle width="40px" height="40px" />
                    <div className="space-y-2 flex-1">
                      <Skeleton height="14px" width="60%" />
                      <Skeleton height="12px" width="40%" />
                    </div>
                  </div>
                  <EmptyState 
                    title="কোনো নোটিশ নেই" 
                    description="বর্তমানে এই শ্রেণিতে কোনো অফিশিয়াল নোটিশ পোস্ট করা হয়নি।" 
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Accessible Test Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="টেস্ট কনফার্মেশন মডাল" 
        subtitle="সহজ পাঠশালা ডিজাইন সিস্টেম যাচাই"
      >
        <div className="py-2 space-y-4">
          <p className="text-sm text-muted">
            মডাল ডায়ালগটি ব্যাকড্রপ ব্লার, এস্কেপ কীবোর্ড লিসেনার এবং অটো-ফোকাস বজায় রেখে নিখুঁতভাবে ওপেন হয়েছে।
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              বন্ধ করুন
            </Button>
            <Button variant="primary" onClick={() => {
              setModalOpen(false);
              showToast('মডাল কনফার্মেশন সফল হয়েছে!');
            }}>
              কনফার্ম করুন
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

