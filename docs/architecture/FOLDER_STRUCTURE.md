# সহজ পাঠশালা — ফোল্ডার কাঠামো ও ইম্পোর্ট রুলস (Folder Structure)

## ১. সম্পূর্ণ ফোল্ডার ট্রি (Monorepo Directory Tree)

```
sohoj-pathshala/
├── docs/                                # প্রোডাক্ট স্পেসিফিকেশন ও আর্কিটেকচার নথিপত্র
│   ├── MASTER_PROMPT.md                 # সম্পূর্ণ প্রোডাক্ট ও বিজনেস রুলস স্পেসিফিকেশন
│   ├── ARCHITECTURE_PROMPT.md           # সফটওয়্যার আর্কিটেকচার নীতি ও পরিবর্তন কাঠামো
│   ├── product/                         # পর্যায় ১: প্রোডাক্ট ওভারভিউ, পারসোনা, সাইটম্যাপ ও ফ্লো
│   └── architecture/                    # পর্যায় ২: আর্কিটেকচার, ডিজাইন সিস্টেম, চেঞ্জ গাইড ও ADR
│
├── packages/                            # শেয়ার্ড প্যাকেজসমূহ (ফ্রন্ট ও ব্যাক উভয়ের জন্য)
│   ├── design-tokens/                   # ★ সকল কালার, ফন্ট, শ্যাডো ও মাপের একমাত্র উৎস
│   │   ├── src/primitives.css           #   কাঁচা রঙের প্যালেট (emerald, indigo, slate, red, gold)
│   │   ├── src/semantic.css             #   মোড × থিম অর্থবহ টোকেন (--c-bg, --c-surface, --c-primary)
│   │   ├── src/typography.css           #   ফন্ট ফ্যামিলি, সাইজ স্কেল ও লাইন-হাইট
│   │   ├── src/shape.css                #   বর্ডার রেডিয়াস, ড্রপ শ্যাডো ও স্পেসিং স্কেল
│   │   ├── src/print.css                #   প্রিন্টে সাদা ব্যাকগ্রাউন্ড ও কালো লেখার টোকেন
│   │   ├── src/tailwind-theme.css       #   Tailwind v4 @theme ইউটিলিটি কনফিগারেশন
│   │   └── scripts/check-contrast.ts    #   ৪টি থিম সমন্বয়ে স্বয়ংক্রিয় কনট্রাস্ট ভ্যালিডেশন
│   ├── i18n/                            # ★ সমস্ত UI টেক্সট ও বহুভাষিক অনুবাদ
│   │   ├── bn/                          #   বাংলা অনুবাদ (common, public, admin, owner, validation)
│   │   └── en/                          #   ইংরেজি অনুবাদ (common, public, admin, owner, validation)
│   ├── config/                          # ★ প্রোডাক্ট কনফিগ রেজিস্ট্রি
│   │   ├── modules.json                 #   অ্যাডমিন ১৭টি মডিউল রেজিস্ট্রি (route, icon, perm, plan)
│   │   ├── permissions.json             #   পারমিশন তালিকা ও রোলের ডিফল্ট ম্যাট্রিক্স
│   │   ├── plans.default.json           #   সাবস্ক্রিপশন প্ল্যানের ডিফল্ট কোটা ও সীমা
│   │   ├── public-sections.json         #   পাবলিক ১১টি সেকশন রেজিস্ট্রি (hash, label, order)
│   │   ├── themes.json                  #   অনুমোদিত থিমসমূহ (emerald, indigo)
│   │   ├── limits.json                  #   ফাইল সাইজ লিমিট, পাসওয়ার্ড রুলস ও সেশন টাইমআউট
│   │   └── formats.json                 #   আইডি, রসিদ ও ট্র্যাকিং কোড ফরম্যাটিং টেমপ্লেট
│   └── contracts/                       # OpenAPI স্কিমা থেকে অটো-জেনারেটেড TypeScript Types
│
├── apps/web/src/                        # ফ্রন্টএন্ড ওয়েব অ্যাপ্লিকেশন (React 19 + Vite + TS)
│   ├── app/                             # অ্যাপ্লিকেশন রুট, প্রোভাইডার, গ্লোবাল রাউটার ও এরর বাউন্ডারি
│   ├── design/                          # ডিজাইন সিস্টেমের রিঅ্যাক্ট ইমপ্লিমেন্টেশন
│   │   ├── recipes/                     #   cva রেসিপি (button, card, input, badge, table, dialog)
│   │   ├── primitives/                  #   বেসিক কম্পোনেন্ট (Button, Input, Select, Card, Badge...)
│   │   ├── patterns/                    #   কম্পোজিট প্যাটার্ন (DataTable, FormField, FileUpload...)
│   │   ├── icons.ts                     #   অর্থভিত্তিক আইকন ম্যাপিং (notice ➔ Bell, etc.)
│   │   └── theme/                       #   ThemeProvider, useTheme, ModeToggle, ThemeToggle
│   ├── shared/                          # ফিচার-নিরপেক্ষ ইউটিলিটি (API client, Auth, Tenancy, Formatters)
│   ├── surfaces/                        # ৪টি সারফেস শেল
│   │   ├── platform/                    #   ল্যান্ডিং পেজ শেল
│   │   ├── school-public/               #   স্কুল পাবলিক ওয়েবসাইট শেল (Header, Ticker, Footer, BottomNav)
│   │   ├── school-admin/                #   স্কুল অ্যাডমিন পোর্টাল শেল (TopBar, Sidebar, ModuleGuard)
│   │   └── owner/                       #   প্ল্যাটফর্ম ওনার প্যানেল শেল
│   ├── features/                        # ★ ফিচার-স্লাইসড মডিউলসমূহ (একই অভ্যন্তরীণ গঠন)
│   │   ├── notices/                     #   নোটিশ ফিচার (public/, admin/, api.ts, model.ts, schema.ts, index.ts)
│   │   ├── admissions/                  #   ভর্তি আবেদন ফিচার
│   │   ├── results/                     #   রেজাল্ট ও মার্কশিট ফিচার
│   │   ├── fees/                        #   ফি ও রসিদ ফিচার
│   │   ├── students/                    #   শিক্ষার্থী ডিরেক্টরি ফিচার
│   │   ├── teachers/                    #   শিক্ষক ও কর্মচারী পরিষদ ফিচার
│   │   ├── committee/                   #   পরিচালনা পর্ষদ ফিচার
│   │   ├── routines/                    #   রুটিন ও সিলেবাস ফিচার
│   │   ├── gallery/                     #   ফটো ও ভিডিও গ্যালারি ফিচার
│   │   ├── cms/                         #   সিএমএস সেটিংস ফিচার
│   │   └── ...                          #   অন্যান্য মডিউলসমূহ
│   └── print/                           # প্রিন্ট লেআউট, লেটারহেড ও অফিসিয়াল প্রিন্ট টেমপ্লেট
│
└── apps/api/app/                        # ব্যাকএন্ড এপিআই (Flask + SQLAlchemy 2 + Pydantic v2)
    ├── core/                            # কনফিগ, ডিবি সেশন, JWT অথ, গ্লোবাল এরর হ্যান্ডলার ও অডিট
    ├── tenancy/                         # ★ স্লাগ/টোকেন সমাধানকারী ও PostgreSQL RLS সেশন সেট
    ├── access/                          # পারমিশন ডেকোরেটর ও প্ল্যান গার্ড (@require_perm, @require_plan)
    ├── domain/                          # ★ বিশুদ্ধ ব্যবসায়িক হিসাব (grading.py, ids.py, dues.py)
    ├── modules/                         # ব্যাকএন্ড মডিউলসমূহ (routes, schemas, service, repo, models)
    │   ├── notices/                     #   নোটিশ ব্যাকএন্ড
    │   ├── admissions/                  #   ভর্তি ব্যাকএন্ড
    │   ├── results/                     #   রেজাল্ট ব্যাকএন্ড
    │   ├── fees/                        #   ফি ব্যাকএন্ড
    │   └── ...
    ├── jobs/                            # ব্যাকগ্রাউন্ড শিডিউলার জব (মেয়াদ পর্যবেক্ষণ, অটো-লক)
    ├── integrations/                    # থার্ড-পার্টি অ্যাডাপ্টার (sms/, storage/, email/)
    ├── seed/                            # ডিফল্ট স্কুল ও বিডিএইচএস ডেমো সিড ডেটা
    └── tests/                           # ডোমেন ইউনিট টেস্ট, টেন্যান্সি টেস্ট ও কন্ট্রাক্ট টেস্ট
```

---

## ২. ইম্পোর্ট ও ডিপেনডেন্সি রুলস (Dependency Boundaries)

প্রজেক্টের আর্কিটেকচারাল শৃঙ্খলা বজায় রাখতে `dependency-cruiser` দ্বারা নিচের নিয়মগুলো বাধ্যতামূলকভাবে যাচাই করা হবে:

1. **ফিচার বাউন্ডারি (Feature Isolation):**
   - কোনো ফিচার (e.g. `features/fees/`) অন্য কোনো ফিচারের অভ্যন্তরীণ ফাইল (e.g. `features/students/internal/xyz.ts`) সরাসরি ইম্পোর্ট করতে পারবে না।
   - অন্য ফিচারের প্রয়োজন হলে শুধুমাত্র তার পাবলিক ব্যারেল `index.ts` থেকে ইম্পোর্ট করা যাবে।

2. **ডিজাইন সিস্টেম বাউন্ডারি (Design Purity):**
   - `design/*` শুধুমাত্র `packages/design-tokens` এবং `packages/i18n` ইম্পোর্ট করতে পারবে।
   - `design/*` কখনো কোনো ব্যবসায়িক `features/*` ইম্পোর্ট করতে পারবে না।

3. **সারফেস বাউন্ডারি (Surface Composition):**
   - `surfaces/*` কোনো ফিচারের অভ্যন্তরীণ ফাইল ছোঁবে না; শুধু ফিচারের `index.ts` এবং `packages/config` রেজিস্ট্রি ইম্পোর্ট করবে।

4. **ব্যাকএন্ডের ইউনিডাইরেকশনাল ফ্লো (Layered Architecture):**
   - `routes` ➔ `service` ➔ `repository` ➔ `models`।
   - উল্টো দিকে ইম্পোর্ট নিষিদ্ধ (যেমন: রিপোজিটরি কখনো রাউট বা সার্ভিস ইম্পোর্ট করবে না)।
   - `domain/` হলো সম্পূর্ণ খাঁটি ও স্বাবলম্বী — এটি ডেটাবেস, ফ্রেমওয়ার্ক বা সার্ভিস কাউকে ইম্পোর্ট করবে না; ফলে ডেটাবেস ছাড়াই এটি ইউনিট টেস্ট করা যায়।
