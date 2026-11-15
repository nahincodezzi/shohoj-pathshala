import React, { useState, useMemo, useCallback } from 'react';
import { useThemeTransition } from '../theme/useThemeTransition';
import { TenantRepository } from '../services/tenantStorage';
import { landingTranslations } from '../i18n/landing';
import Modal from '../components/ui/Modal';
import { Phone, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

// Platform Modular Sections
import Header from '../features/platform/sections/Header';
import Hero from '../features/platform/sections/Hero';
import SchoolMarquee from '../features/platform/sections/SchoolMarquee';
import ModulesBento from '../features/platform/sections/ModulesBento';
import OnboardingSteps from '../features/platform/sections/OnboardingSteps';
import Security from '../features/platform/sections/Security';
import Schools from '../features/platform/sections/Schools';
import Pricing from '../features/platform/sections/Pricing';
import Testimonial from '../features/platform/sections/Testimonial';
import Faq from '../features/platform/sections/Faq';
import FinalCta from '../features/platform/sections/FinalCta';
import Footer from '../features/platform/sections/Footer';

export default function LandingPage() {
  const { mode, toggleMode } = useThemeTransition();
  const [lang, setLang] = useState(() => localStorage.getItem('sp_lang') || 'bn');
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);

  // Dynamic Data from TenantRepository (CMS + Tenancy)
  const schools = TenantRepository.getSchools();
  const landingSettings = TenantRepository.getLandingSettings();

  // Language toggle handler with persistent storage
  const handleToggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'bn' ? 'en' : 'bn';
      try {
        localStorage.setItem('sp_lang', next);
      } catch (err) {
        // Safe fallback in restricted environments
      }
      return next;
    });
  }, []);

  // Universal Translation accessor (supporting dot-notation, direct object access, and snake_case)
  const t = useMemo(() => {
    const dict = landingTranslations[lang] || landingTranslations.bn;
    const fn = (key, fallback = '') => {
      if (typeof key !== 'string') return fallback;
      if (dict[key] !== undefined) return dict[key];

      // Dot notation resolution
      const parts = key.split('.');
      let curr = dict;
      for (const part of parts) {
        if (curr && typeof curr === 'object' && part in curr) {
          curr = curr[part];
        } else {
          curr = undefined;
          break;
        }
      }
      if (curr !== undefined) return curr;

      // Snake_case alternative
      const snakeKey = key.replace(/\./g, '_');
      if (dict[snakeKey] !== undefined) return dict[snakeKey];

      return fallback;
    };

    return new Proxy(fn, {
      get(target, prop) {
        if (prop in target) return target[prop];
        if (typeof prop === 'string') {
          return target(prop, dict[prop] || '');
        }
        return undefined;
      }
    });
  }, [lang]);

  // Derived CMS modules with localized fallbacks
  const modules = useMemo(() => {
    if (landingSettings.modules && landingSettings.modules.length > 0) {
      return landingSettings.modules;
    }
    return null;
  }, [landingSettings.modules]);

  // Derived CMS onboarding steps
  const onboardingSteps = useMemo(() => {
    if (landingSettings.onboarding_steps && landingSettings.onboarding_steps.length > 0) {
      return landingSettings.onboarding_steps;
    }
    return null;
  }, [landingSettings.onboarding_steps]);

  // Derived CMS pricing plans
  const pricingPlans = useMemo(() => {
    if (landingSettings.pricing_plans && landingSettings.pricing_plans.length > 0) {
      return landingSettings.pricing_plans;
    }
    return null;
  }, [landingSettings.pricing_plans]);

  // Derived CMS testimonials
  const testimonials = useMemo(() => {
    if (landingSettings.testimonials && landingSettings.testimonials.length > 0) {
      return landingSettings.testimonials;
    }
    if (landingSettings.testimonial) {
      return [
        {
          quote: landingSettings.testimonial.quote,
          author: landingSettings.testimonial.author,
          role: landingSettings.testimonial.designation || 'প্রধান শিক্ষক',
          school: landingSettings.testimonial.meta || 'BDHS'
        }
      ];
    }
    return null;
  }, [landingSettings.testimonials, landingSettings.testimonial]);

  // Derived CMS FAQs
  const faqs = useMemo(() => {
    if (landingSettings.faqs && landingSettings.faqs.length > 0) {
      return landingSettings.faqs.map(f => ({
        q: f.q || f.question,
        a: f.a || f.answer
      }));
    }
    return null;
  }, [landingSettings.faqs]);

  // Open Onboarding contact modal
  const handleOpenOnboard = useCallback(() => {
    setOnboardModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col font-sans transition-colors duration-300 relative selection:bg-[var(--primary)] selection:text-[var(--on-primary)]">
      {/* 1. Sticky Glass Header */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        t={t}
        mode={mode}
        onToggleTheme={toggleMode}
      />

      {/* Main Sections */}
      <main className="flex-1 w-full">
        {/* 2. Hero Section with dynamic count-up & mockup */}
        <Hero
          t={t}
          lang={lang}
          landing={landingSettings}
          onOpenOnboard={handleOpenOnboard}
        />

        {/* 3. Infinite Streaming School Marquee */}
        <SchoolMarquee
          t={t}
          schools={schools}
        />

        {/* 4. Modules Bento Grid */}
        <ModulesBento
          t={t}
          landing={landingSettings}
          modules={modules}
        />

        {/* 5. 4-Step Onboarding Workflow with glowing pulse line */}
        <OnboardingSteps
          t={t}
          landing={landingSettings}
          steps={onboardingSteps}
        />

        {/* 6. Security & Multi-tenant Data Isolation with dual-ring orbit */}
        <Security
          t={t}
        />

        {/* 7. Connected Schools Directory with Live Search */}
        <Schools
          t={t}
          lang={lang}
          schools={schools}
        />

        {/* 8. Clear & Transparent Pricing Tiers */}
        <Pricing
          t={t}
          pricingPlans={pricingPlans}
        />

        {/* 9. Expressive Testimonials with carousel controls */}
        <Testimonial
          t={t}
          testimonials={testimonials}
        />

        {/* 10. Frequently Asked Questions Accordion */}
        <Faq
          t={t}
          faqs={faqs}
        />

        {/* 11. Final Conversion CTA with Ambient Glow */}
        <FinalCta
          t={t}
          onOpenOnboard={handleOpenOnboard}
        />
      </main>

      {/* 12. Complete Modern Footer */}
      <Footer
        t={t}
      />

      {/* Verified School Onboarding & Contact Modal */}
      {onboardModalOpen && (
        <Modal
          isOpen={onboardModalOpen}
          onClose={() => setOnboardModalOpen(false)}
          title={lang === 'bn' ? 'নতুন স্কুল অনবোর্ডিং যোগাযোগ' : 'New School Onboarding & Contact'}
          subtitle={lang === 'bn' ? 'সরাসরি অনুমোদনে মাত্র ১০ মিনিটে স্কুল লাইভ করুন' : 'Go live in 10 minutes with verified institutional setup'}
          maxWidth="max-w-lg"
        >
          <div className="space-y-5 text-sm">
            <p className="text-[var(--muted)] leading-relaxed font-body">
              {lang === 'bn'
                ? 'সহজ পাঠশালা প্ল্যাটফর্মে আপনার স্কুল যুক্ত করতে আমাদের প্রতিনিধি দলের সাথে যোগাযোগ করুন। আপনার প্রতিষ্ঠানের EIIN ও তথ্য দিয়ে মাত্র ২৪ ঘণ্টার মধ্যে পূর্ণাঙ্গ সিস্টেম প্রস্তুত করে দেওয়া হবে।'
                : 'Connect with our team to onboard your school to the Sohoj Pathshala ecosystem. With your EIIN and basic setup details, your complete portal will be activated within 24 hours.'}
            </p>

            {/* Helpline details card */}
            <div className="p-5 rounded-2xl bg-[var(--bg-alt)] border border-[var(--border)] space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--muted)] block font-semibold uppercase tracking-wider">
                    {lang === 'bn' ? 'সরাসরি কল করুন (হটলাইন)' : 'Direct Helpline'}
                  </span>
                  <a
                    href={`tel:${landingSettings.helpline_phone || '01812345678'}`}
                    className="text-base font-bold font-mono text-[var(--primary-text)] hover:underline"
                  >
                    {landingSettings.helpline_phone || '০১৮১২-৩৪৫৬৭৮'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[var(--indigo)]/15 text-[var(--indigo)] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--muted)] block font-semibold uppercase tracking-wider">
                    {lang === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Official Email'}
                  </span>
                  <a
                    href={`mailto:${landingSettings.helpline_email || 'onboard@sohojpathshala.app'}`}
                    className="text-base font-bold font-mono text-[var(--indigo)] hover:underline"
                  >
                    {landingSettings.helpline_email || 'onboard@sohojpathshala.app'}
                  </a>
                </div>
              </div>
            </div>

            {/* Verified Step Guidelines */}
            <div className="space-y-2 pt-1 font-body">
              <span className="font-bold text-[var(--text)] text-xs uppercase tracking-wide block">
                {lang === 'bn' ? 'অনবোর্ডিং প্রক্রিয়া:' : 'Onboarding Requirements:'}
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-[var(--muted)]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                  <span>{lang === 'bn' ? 'প্রতিষ্ঠানের EIIN, প্রধান শিক্ষকের নাম ও রেজুলেশন কপি প্রদান' : 'Institution EIIN, Headmaster credentials and committee resolution'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                  <span>{lang === 'bn' ? 'নিরাপদ স্কুল অ্যাডমিন ক্রেডেনশিয়াল ও ডোমেইন সক্রিয়করণ' : 'Dedicated school admin credentials and subdomain allocation'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                  <span>{lang === 'bn' ? 'শিক্ষক ও স্টাফদের জন্য সম্পূর্ণ অনলাইন ভিডিও ও লাইভ প্রশিক্ষণ' : 'Comprehensive hands-on training for staff and faculty'}</span>
                </li>
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setOnboardModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[var(--bg-alt)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold transition-all"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
              <a
                href={`tel:${landingSettings.helpline_phone || '01812345678'}`}
                className="btn-primary-action inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold hover:brightness-110 shadow-sm transition-all"
              >
                <span>{lang === 'bn' ? 'এখনই কল দিন' : 'Call Now'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
