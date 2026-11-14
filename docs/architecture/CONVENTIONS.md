# সহজ পাঠশালা — কোডিং কনভেনশন ও স্ট্যান্ডার্ডস (Coding Conventions)

## ১. ফাইল ও কোড নামকরণ রীতি (Naming Conventions)

| উপাদান | কনভেনশন | উদাহরণ |
|---|---|---|
| **React Components** | `PascalCase` | `Button.tsx`, `NoticeModal.tsx`, `StudentCard.tsx` |
| **Hooks** | `camelCase` (prefix `use`) | `useTheme.ts`, `usePermissions.ts`, `useTenant.ts` |
| **Utilities & Services** | `camelCase` | `formatMoney.ts`, `tenantStorage.ts`, `httpClient.ts` |
| **CSS & Config Files** | `kebab-case` | `primitives.css`, `public-sections.json`, `theme.css` |
| **Directories** | `kebab-case` | `design-tokens/`, `school-public/`, `academic-setup/` |
| **Backend Python Files** | `snake_case` | `grading.py`, `roll_allocation.py`, `routes.py` |
| **Database Tables & Cols**| `snake_case` (lowercase) | `school_settings`, `admission_applications`, `total_gpa` |
| **TypeScript Types/Interfaces**| `PascalCase` | `StudentRecord`, `ExamResultPayload`, `FeeHead` |

---

## ২. ফাইলের আকার ও জটিলতা সীমা (File Size Limits)
- **React Components:** সাধারণত **≤ ২৫০ লাইন**। কোনো কম্পোনেন্ট ৪০০ লাইনের বেশি হলে স্বয়ংক্রিয় লিন্টার সতর্কতা দেবে এবং সাব-কম্পোনেন্টে ভাগ করতে হবে।
- **Functions & Hooks:** সাধারণত **≤ ৫০ লাইন**। একক ফাংশন যেন একাধিক কাজ না করে (Single Responsibility Principle)।
- **Backend Routes/Controllers:** শুধুমাত্র রিকোয়েস্ট পার্সিং ও রেসপন্স ফরম্যাটিং করবে — ব্যবসায়িক লজিক থাকবে সার্ভিস ও ডোমেনে।

---

## ৩. বহুভাষিক অনুবাদ কী নিয়ম (i18n Key Conventions)

সমস্ত UI টেক্সট `packages/i18n/` ফোল্ডারের JSON ফাইলের কী-র মাধ্যমে ব্যবহৃত হবে:
- **ফরম্যাট:** `{surface}.{feature}.{element}`
  - উদাহরণ:
    - `public.notices.title` ➔ "প্রাতিষ্ঠানিক নোটিশ বোর্ড"
    - `admin.fees.collect_button` ➔ "ফি আদায় করুন"
    - `owner.schools.status_active` ➔ "সক্রিয়"
- **ভ্যালিডেশন এরর বার্তা:** `validation.{field}_{rule}`
  - উদাহরণ:
    - `validation.mobile_invalid` ➔ "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন"
    - `validation.required` ➔ "এই তথ্যটি পূরণ করা আবশ্যক"
- **নিষেধাজ্ঞা:** JSX ফাইলে সরাসরি কোনো হার্ডকোডেড বাংলা বা ইংরেজি স্ট্রিং লেখা সম্পূর্ণ নিষিদ্ধ।

---

## ৪. এপিআই আর্কিটেকচার ও ডেটা কন্ট্রাক্ট (API Standards)
- **রুট স্ট্রাকচার:** `/api/v1/{resource}` (e.g. `/api/v1/students`, `/api/v1/notices`)
- **HTTP Methods:**
  - `GET` — ডেটা অনুসন্ধান ও পড়া
  - `POST` — নতুন রিসোর্স তৈরি
  - `PUT` / `PATCH` — বিদ্যমান রিসোর্স আপডেট
  - `DELETE` — রিসোর্স মুছে ফেলা
- **রেসপন্স প্যাটার্ন:**
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "সফলভাবে সংরক্ষিত হয়েছে"
  }
  ```
- **এরর প্যাটার্ন:**
  ```json
  {
    "success": false,
    "error": {
      "code": "PLAN_LIMIT_EXCEEDED",
      "message": "আপনার বর্তমান প্ল্যানে সর্বোচ্চ ৩০০ জন শিক্ষার্থীর সীমা পূর্ণ হয়েছে।",
      "details": { "current": 300, "limit": 300 }
    }
  }
  ```

---

## ৫. গিট কমিট স্ট্যান্ডার্ড (Conventional Commits)
প্রতিটি কমিট মেসেজ নিচের ফরম্যাট অনুসরণ করবে:
- `feat(...)`: নতুন কোনো ফিচার যোগ (e.g. `feat(admissions): add passport photo uploader in step 1`)
- `fix(...)`: বাগ ফিক্স (e.g. `fix(tenancy): enforce composite unique roll per school class`)
- `design(...)`: টোকেন বা রেসিপি পরিবর্তন (e.g. `design(tokens): adjust emerald primary contrast`)
- `refactor(...)`: কোড ক্লিনআপ বা রিফ্যাক্টরিং (e.g. `refactor(fees): extract receipt layout to print registry`)
- `docs(...)`: ডকুমেন্টেশন আপডেট (e.g. `docs(architecture): complete change guide table`)
- `test(...)`: টেস্ট কেস ও স্ক্রিনশট যোগ (e.g. `test(e2e): add admissions flow playwright suite`)

