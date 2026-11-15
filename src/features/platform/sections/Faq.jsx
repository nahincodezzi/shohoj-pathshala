import React, { useState } from 'react';
import { Plus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reveal } from '../motion/Reveal';

export default function Faq({ t, faqs = [] }) {
  const defaultFaqs = [
    {
      q: t('faq.items.q1') || 'সহজ পাঠশালা চালু করতে কতক্ষণ সময় লাগে?',
      a: t('faq.items.a1') || 'মাত্র ১০ মিনিটে আপনার স্কুলের মৌলিক তথ্য দিয়ে স্কুল পোর্টাল লাইভ করা সম্ভব। শিক্ষার্থী ও শিক্ষকদের তালিকা এক্সেল শিট আপলোডের মাধ্যমে নিমেষেই ডেটাবেজে যুক্ত করা যায়।'
    },
    {
      q: t('faq.items.q2') || 'আমাদের ইন্টারনেটের গতি কম থাকলে কি এটি কাজ করবে?',
      a: t('faq.items.a2') || 'হ্যাঁ, সহজ পাঠশালা অত্যন্ত লাইটওয়েট এবং ২G/৩G স্পিডেও মসৃণভাবে লোড হওয়ার জন্য অপ্টিমাইজ করা হয়েছে। অফলাইন ক্যাশিং সুবিধাও রয়েছে।'
    },
    {
      q: t('faq.items.q3') || 'মার্কশিট, অ্যাডমিট কার্ড বা মানি রসিদ কি এক পাতায় প্রিন্ট হবে?',
      a: t('faq.items.a3') || 'অবশ্যই! আমাদের সিস্টেমে রয়েছে ডেডিকেটেড ইউনিভার্সাল প্রিন্ট ইঞ্জিন। এমনকি ডার্ক মোডে থাকলেও প্রিন্ট কমান্ড দিলে স্বয়ংক্রিয়ভাবে ১০০% সাদা A4 কাগজে স্কুলের লেটারহেড সহ নির্ভুল ১ পাতায় প্রিন্ট হয়।'
    },
    {
      q: t('faq.items.q4') || 'আমাদের স্কুলের জন্য কি নিজস্ব ডোমেইন বা নাম ব্যবহার করা যাবে?',
      a: t('faq.items.a4') || 'হ্যাঁ, প্রতিটি স্কুলের জন্য নিজস্ব সাবডোমেইন (যেমন: bdhs.sohojpathshala.app) স্বয়ংক্রিয়ভাবে তৈরি হয় এবং যেকোনো কাস্টম ডোমেইন (যেমন: myschool.edu.bd) খুব সহজেই ম্যাপ করা যায়।'
    },
    {
      q: t('faq.items.q5') || 'শিক্ষক বা কর্মীদের কি প্রশিক্ষণের ব্যবস্থা আছে?',
      a: t('faq.items.a5') || 'হ্যাঁ! সহজ ও সাবলীল বাংলা ইন্টারফেসের পাশাপাশি আমরা ভিডিও টিউটোরিয়াল, ব্যবহারকারী গাইড এবং জুম/হোয়াটসঅ্যাপের মাধ্যমে ডেডিকেটেড প্রশিক্ষণ প্রদান করি।'
    }
  ];

  const list = (faqs && faqs.length > 0) ? faqs : defaultFaqs;
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto space-y-12">
        <Reveal>
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-xs font-semibold text-[var(--primary-text)]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t('faq.badge') || 'সাধারণ প্রশ্নোত্তর'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text)] tracking-tight font-heading">
              {t('faq.title') || 'সচরাচর জানতে চাওয়া'}{' '}
              <span className="text-shimmer">{t('faq.titleHighlight') || 'প্রশ্নসমূহ'}</span>
            </h2>

            <p className="text-[var(--muted)] text-base sm:text-lg font-body">
              {t('faq.subtitle') || 'সহজ পাঠশালা সম্পর্কে আপনার মনের জিজ্ঞাসাগুলোর সহজ সমাধান।'}
            </p>
          </div>
        </Reveal>

        <div className="space-y-4">
          {list.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <Reveal key={idx}>
                <div
                  className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                    isOpen
                      ? 'bg-[var(--surface)] border-[var(--primary)]/70 shadow-lg'
                      : 'bg-[var(--surface)]/70 border-[var(--border)] hover:border-[var(--primary)]/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    aria-expanded={isOpen}
                    className="w-full py-5 px-6 sm:px-8 text-left flex items-center justify-between gap-4 select-none"
                  >
                    <span className="font-bold text-[var(--text)] text-base sm:text-lg font-heading">
                      {item.q || item.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'rotate-45 bg-[var(--primary)] text-[var(--on-primary)]'
                          : 'bg-[var(--bg-alt)] text-[var(--muted)]'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 sm:px-8 pb-6 text-[var(--muted)] text-sm sm:text-base leading-relaxed border-t border-[var(--border)] pt-4 font-body">
                          {item.a || item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
