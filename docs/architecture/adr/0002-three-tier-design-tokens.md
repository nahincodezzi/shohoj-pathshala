# ADR 0002: Three-Tier Design Token Architecture

## প্রেক্ষাপট (Context)
সফটওয়্যারে বিভিন্ন থিম (Emerald, Indigo), মোড (Dark, Light) এবং প্রিন্ট সংস্করণের জন্য শত শত রঙের প্রয়োজন হয়। যদি কম্পোনেন্ট বা ফিচারের কোডে সরাসরি হেক্স কোড বা Tailwind ক্লাস (যেমন `bg-emerald-600`) হার্ডকোড করা থাকে, তবে পরবর্তীতে ব্র্যান্ডিং বদলাতে গেলে শত শত ফাইলে পরিবর্তন করতে হয়, যা প্রচুর রিগ্রেশনের জন্ম দেয়।

## সিদ্ধান্ত (Decision)
আমরা **Three-Tier CSS Token** আর্কিটেকচার চূড়ান্ত করেছি:
1. **Tier 1 (Primitives):** `packages/design-tokens/src/primitives.css` — কাঁচা প্যালেট (e.g. `--emerald-500: #10b981`).
2. **Tier 2 (Semantics):** `packages/design-tokens/src/semantic.css` — মোড ও থিম অনুযায়ী অর্থবহ টোকেন (e.g. `--c-primary: var(--emerald-500)`).
3. **Tier 3 (Tailwind Theme):** `packages/design-tokens/src/tailwind-theme.css` — Tailwind v4 `@theme` দিয়ে ইউটিলিটি ক্লাস ম্যাপিং (`bg-primary`, `text-on-primary`, `bg-surface`).

কোনো ফিচার বা কম্পোনেন্ট কখনো Tier 1 বা সরাসরি কাঁচা রঙ ব্যবহার করতে পারবে না।

## বিকল্প বিবেচনা (Alternatives Considered)
1. **Hardcoded Tailwind classes:** `bg-green-600 dark:bg-green-500` কোডে সরাসরি লেখা। (বাতিল: থিম সুইচ বা রি-ব্র্যান্ডিং অসম্ভব হয়ে পড়ে)।
2. **CSS-in-JS (Styled Components / Emotion):** রানটাইম পারফরম্যান্স স্লো এবং বান্ডল সাইজ বড় হয়। (বাতিল: আধুনিক জিরো-রানটাইম CSS ভ্যারিয়েবল শতভাগ দ্রুত ও আদর্শ)।

## ফলাফল ও প্রভাব (Consequences)
- **ইতিবাচক:** ঠিক ১টি ফাইলে (`semantic.css`) মাত্র ১ লাইন পরিবর্তন করে পুরো প্ল্যাটফর্মের ব্র্যান্ড রং বা সারফেস পরিবর্তন সম্ভব।
- **নেতিবাচক:** প্রাথমিক পর্যায়ে ডেভেলপারদের টোকেন নিয়ম মেনে কাজ করার কঠোর ডিসিপ্লিন রাখতে হবে (লিন্ট দিয়ে এনফোর্স করা হয়েছে)।

