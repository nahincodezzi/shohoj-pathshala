import React from 'react';
import { Check, Sparkles, HelpCircle } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { Stagger, StaggerItem } from '../motion/Stagger';

export default function Pricing({ t, pricingPlans = [] }) {
  const defaultPlans = [
    {
      id: 'basic',
      name: t('pricing.plans.basic.name') || 'বেসিক',
      tagline: t('pricing.plans.basic.tagline') || 'ছোট ও প্রাথমিক বিদ্যালয়ের জন্য আদর্শ',
      price: t('pricing.plans.basic.price') || '৩,৯৯৯',
      period: t('pricing.plans.basic.period') || '/ বছর',
      popular: false,
      features: [
        t('pricing.plans.basic.f1') || '২০০ জন শিক্ষার্থী পর্যন্ত',
        t('pricing.plans.basic.f2') || 'ভর্তি ও শিক্ষার্থী ব্যবস্থাপনা',
        t('pricing.plans.basic.f3') || 'ডিজিটাল হাজিরা ট্র্যাকিং',
        t('pricing.plans.basic.f4') || 'পরীক্ষার রেজাল্ট ও মার্কশিট প্রিন্ট',
        t('pricing.plans.basic.f5') || 'সাধারণ ইমেইল সাপোর্ট'
      ],
      buttonText: t('pricing.plans.basic.button') || 'বেসিক বেছে নিন',
      buttonVariant: 'secondary'
    },
    {
      id: 'standard',
      name: t('pricing.plans.standard.name') || 'স্ট্যান্ডার্ড',
      tagline: t('pricing.plans.standard.tagline') || 'মাঝারি ও উচ্চ বিদ্যালয়ের জন্য সবচেয়ে জনপ্রিয়',
      price: t('pricing.plans.standard.price') || '৭,৯৯৯',
      period: t('pricing.plans.standard.period') || '/ বছর',
      popular: true,
      features: [
        t('pricing.plans.standard.f1') || '১,০০০ জন শিক্ষার্থী পর্যন্ত',
        t('pricing.plans.standard.f2') || 'সম্পূর্ণ ফি ও ক্যাশ রসিদ ব্যবস্থাপনা',
        t('pricing.plans.standard.f3') || 'অটোমেটিক এসএমএস নোটিফিকেশন',
        t('pricing.plans.standard.f4') || 'অনলাইন অ্যাডমিট ও আইডি কার্ড জেনারেটর',
        t('pricing.plans.standard.f5') || 'কমিটি, শিক্ষক ও নোটিশ বোর্ড মডিউল',
        t('pricing.plans.standard.f6') || 'অগ্রাধিকার ফোন ও হোয়াটসঅ্যাপ সাপোর্ট'
      ],
      buttonText: t('pricing.plans.standard.button') || 'স্ট্যান্ডার্ড শুরু করুন',
      buttonVariant: 'primary'
    },
    {
      id: 'premium',
      name: t('pricing.plans.premium.name') || 'প্রিমিয়াম',
      tagline: t('pricing.plans.premium.tagline') || 'বড় কলেজ ও একাধিক শাখার প্রতিষ্ঠানের জন্য',
      price: t('pricing.plans.premium.price') || '১৪,৯৯৯',
      period: t('pricing.plans.premium.period') || '/ বছর',
      popular: false,
      features: [
        t('pricing.plans.premium.f1') || 'অসীম শিক্ষার্থী ও শিক্ষক রেকর্ড',
        t('pricing.plans.premium.f2') || 'কাস্টম ডোমেইন সংযোগ ও ব্র্যান্ডিং',
        t('pricing.plans.premium.f3') || 'স্মার্ট গেট ও বায়োমেট্রিক ইন্টিগ্রেশন',
        t('pricing.plans.premium.f4') || 'সম্পূর্ণ ডাইনামিক CMS ও গ্যালারি',
        t('pricing.plans.premium.f5') || 'ডেডিকেটেড ২৪/৭ অ্যাকাউন্ট ম্যানেজার',
        t('pricing.plans.premium.f6') || 'অটোমেটেড ডেইলি ক্লাউড ব্যাকআপ'
      ],
      buttonText: t('pricing.plans.premium.button') || 'প্রিমিয়াম বেছে নিন',
      buttonVariant: 'secondary'
    }
  ];

  const plans = (pricingPlans && pricingPlans.length > 0) ? pricingPlans : defaultPlans;

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        <Reveal>
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-xs font-semibold text-[var(--primary-text)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('pricing.badge') || 'স্বচ্ছ ও সাশ্রয়ী প্যাকেজ'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text)] tracking-tight font-heading">
              {t('pricing.title') || 'আপনার স্কুলের জন্য সঠিক'}{' '}
              <span className="text-shimmer">{t('pricing.titleHighlight') || 'পরিকল্পনা'}</span>
            </h2>

            <p className="text-[var(--muted)] text-base sm:text-lg font-body">
              {t('pricing.subtitle') || 'কোনো গোপন চার্জ নেই। বিনামূল্যে ১৪ দিনের ট্রায়াল সহ যেকোনো সময় আপগ্রেড বা বাতিল করুন।'}
            </p>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isPopular = Boolean(plan.popular || plan.isPopular);
            const displayPrice = plan.price ? String(plan.price).replace(/^[৳$]/, '') : '';
            const displayPeriod = plan.period || plan.subtext || t('pricing.per_year') || '/ বছর';
            const displayButtonText = plan.buttonText || plan.cta || (isPopular ? (t('pricing.popular_cta') || 'স্ট্যান্ডার্ড শুরু করুন') : (t('pricing.default_cta') || 'প্ল্যান বেছে নিন'));

            return (
              <StaggerItem key={plan.id} className="h-full">
                <div
                  className={`h-full flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 relative ${
                    isPopular
                      ? 'bg-[var(--surface)] ring-2 ring-[var(--primary)] shadow-[0_0_40px_var(--glow)] lg:-translate-y-3'
                      : 'bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)]/50 hover:shadow-xl'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--primary)] text-[var(--on-primary)] text-xs font-extrabold tracking-wide uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t('pricing.popularBadge') || 'সবচেয়ে জনপ্রিয়'}</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Header: Name & Tagline */}
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--text)] font-heading">
                        {plan.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--muted)] mt-1 font-body">
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-1 py-2">
                      <span className="text-2xl font-bold text-[var(--text)]">৳</span>
                      <span className={`text-5xl font-extrabold tracking-tight font-heading ${isPopular ? 'text-shimmer' : 'text-[var(--text)]'}`}>
                        {displayPrice}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-[var(--muted)] ml-1">
                        {displayPeriod}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[var(--border)] w-full" />

                    {/* Features list */}
                    <ul className="space-y-3.5 pt-2">
                      {(plan.features || []).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-[var(--text)] font-body">
                          <div className="w-5 h-5 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="pt-8 mt-6">
                    <a
                      href="#contact"
                      className={`w-full inline-flex items-center justify-center py-3.5 px-6 rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm ${
                        isPopular
                          ? 'bg-[var(--primary)] text-[var(--on-primary)] hover:brightness-110 shadow-[0_4px_20px_var(--glow)]'
                          : 'bg-[var(--bg-alt)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]'
                      }`}
                    >
                      {displayButtonText}
                    </a>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
