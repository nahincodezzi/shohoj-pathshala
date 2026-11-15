import React from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { Reveal } from '../../../shared/motion';

/**
 * ContactMap Section (Section 6.13)
 * 2-column layout:
 * Left: Solid Primary panel with school contact information
 * Right: Lazy-loaded Map iframe with floating gold pin
 */
export default function ContactMap({ school, lang = 'bn', onOpenContactModal }) {
  if (!school) return null;

  const t = {
    badge: lang === 'bn' ? 'যোগাযোগ' : 'Contact Us',
    title: lang === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : 'Get in Touch with Us',
    subtitle: lang === 'bn' 
      ? 'যেকোনো অনুসন্ধান, ভর্তি সংক্রান্ত তথ্য অথবা দাপ্তরিক প্রয়োজনে সরাসরি আসুন বা কল করুন।' 
      : 'For any inquiries, admissions or administrative needs, visit us or call directly.',
    addressTitle: lang === 'bn' ? 'ঠিকানা' : 'Address',
    phoneTitle: lang === 'bn' ? 'ফোন নম্বর' : 'Phone',
    emailTitle: lang === 'bn' ? 'ইমেইল' : 'Email',
    hoursTitle: lang === 'bn' ? 'অফিস সময়' : 'Office Hours',
    hoursVal: lang === 'bn' ? 'রবি – বৃহস্পতি: সকাল ৯:০০ – বিকাল ৪:০০' : 'Sun – Thu: 9:00 AM – 4:00 PM',
    sendMsg: lang === 'bn' ? 'সরাসরি কল দিন' : 'Call Directly',
    mapTitle: lang === 'bn' ? 'গুগল ম্যাপে আমাদের অবস্থান' : 'Find Us on Google Maps',
    directions: lang === 'bn' ? 'দিকনির্দেশনা পান' : 'Get Directions'
  };

  // Google Maps Search Embed URL
  const query = encodeURIComponent(`${school.name} ${school.district || ''}`);
  const mapEmbedUrl = school.mapEmbedUrl || `https://www.google.com/maps?q=${query}&output=embed`;
  const mapDirectUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[var(--bg)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Reveal>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-soft)] border border-[var(--primary)]/30 text-xs font-bold text-[var(--primary-text)] font-mono mb-4">
              <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>{t.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--text)] tracking-tight font-heading">
              {t.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--muted)] leading-relaxed">
              {t.subtitle}
            </p>
          </Reveal>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Contact Info Panel (Solid Primary) */}
          <div className="lg:col-span-5">
            <Reveal direction="left" className="h-full">
              <div className="h-full p-8 sm:p-10 rounded-3xl bg-[var(--primary)] text-[var(--on-primary)] shadow-2xl flex flex-col justify-between relative overflow-hidden">
                {/* Background soft glow rings */}
                <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-black/10 blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div>
                    <h3 className="text-2xl font-black font-heading tracking-tight text-inherit">
                      {school.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-inherit opacity-90 mt-1">
                      {school.slogan || (lang === 'bn' ? 'জ্ঞানই আলো · সুশিক্ষা দেশ গড়ার মূল ভিত্তি' : 'Excellence in Education')}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Address */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-5 h-5 text-inherit" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
                          {t.addressTitle}
                        </div>
                        <div className="text-sm font-medium mt-0.5 leading-snug">
                          {school.address || (lang === 'bn' ? 'স্কুল রোড, সদর' : 'School Road')}, {school.district || ''}
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Phone className="w-5 h-5 text-inherit" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
                          {t.phoneTitle}
                        </div>
                        <a 
                          href={`tel:${school.phone || '01812345678'}`}
                          className="text-sm font-mono font-bold mt-0.5 inline-block hover:underline"
                        >
                          {school.phone || '০১৮১২-৩৪৫৬৭৮'}
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Mail className="w-5 h-5 text-inherit" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
                          {t.emailTitle}
                        </div>
                        <a 
                          href={`mailto:${school.email || 'info@school.edu.bd'}`}
                          className="text-sm font-medium mt-0.5 inline-block hover:underline break-all"
                        >
                          {school.email || `info@${school.slug || 'school'}.edu.bd`}
                        </a>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-5 h-5 text-inherit" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
                          {t.hoursTitle}
                        </div>
                        <div className="text-sm font-medium mt-0.5">
                          {t.hoursVal}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="relative z-10 pt-8 mt-6 border-t border-white/20">
                  <a
                    href={`tel:${school.phone || '01812345678'}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[var(--primary)] hover:bg-neutral-100 text-sm font-black shadow-lg transition-transform active:scale-[0.98]"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t.sendMsg}</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Map Display */}
          <div className="lg:col-span-7">
            <Reveal direction="right" className="h-full">
              <div className="h-full min-h-[420px] rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-3 shadow-lg relative overflow-hidden flex flex-col">
                <div className="relative flex-1 w-full h-full min-h-[350px] rounded-2xl overflow-hidden bg-[var(--bg-alt)] border border-[var(--border)]">
                  <iframe
                    title={t.mapTitle}
                    src={mapEmbedUrl}
                    className="w-full h-full border-0 absolute inset-0 grayscale-[20%] contrast-[1.05]"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                  {/* Floating Gold Pin Overlay */}
                  <div className="absolute top-4 left-4 z-10 bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-[var(--accent)] animate-ping" />
                    <span className="text-xs font-bold text-[var(--text)]">
                      {school.name}
                    </span>
                  </div>

                  {/* External Directions Link */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <a
                      href={mapDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)]/95 hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] text-xs font-bold shadow-md hover:border-[var(--primary)] transition-all"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>{t.directions}</span>
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
