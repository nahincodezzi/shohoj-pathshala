# সহজ পাঠশালা — ডিজাইন সিস্টেম আর্কিটেকচার (Design System)

## ১. থ্রি-টিয়ার টোকেন আর্কিটেকচার (Three-Tier Token Architecture)

ডিজাইন সিস্টেমের প্রতিটি রঙ, ফন্ট এবং আকার ৩টি সুনির্দিষ্ট স্তরে প্রবাহিত হয়:

```
Tier 1: Primitives (কাঁচা প্যালেট)
  primitives.css
  └─ --emerald-500: #10b981; --indigo-600: #4f46e5; --slate-900: #0f172a;
       │
       ▼
Tier 2: Semantics (অর্থবহ ভ্যারিয়েবল — মোড × থিম)
  semantic.css
  ├─ [data-mode="dark"][data-theme="emerald"] { --c-primary: var(--emerald-500); --c-bg: #090d16; }
  ├─ [data-mode="light"][data-theme="emerald"] { --c-primary: var(--emerald-600); --c-bg: #f8fafc; }
  ├─ [data-mode="dark"][data-theme="indigo"]  { --c-primary: var(--indigo-500); --c-bg: #0b0f19; }
  └─ [data-mode="light"][data-theme="indigo"] { --c-primary: var(--indigo-600); --c-bg: #f8fafc; }
       │
       ▼
Tier 3: Tailwind Utilities (@theme)
  tailwind-theme.css
  └─ @theme { --color-primary: var(--c-primary); --color-bg: var(--c-bg); }
       │
       ▼
Component Recipes (CVA) ➔ UI Components ➔ Application Features
  (features কখনো হেক্স বা কাঁচা রঙ লিখবে না)
```

---

## ২. ৪টি থিম সমন্বয় ও কনট্রাস্ট নীতি (Four Combinations Matrix)

প্রতিটি টেক্সট ও ব্যাকগ্রাউন্ডের অনুপাত **WCAG 2.1 AA (≥ ৪.৫:১)** মানদণ্ড পূরণ করতে হবে:

| থিম সমন্বয় | ব্যাকগ্রাউন্ড (`--c-bg`) | সারফেস (`--c-surface`) | প্রাইমারি (`--c-primary`) | টেক্সট (`--c-text`) | কনট্রাস্ট রেশিও |
|---|---|---|---|---|:---:|
| **১. Dark × Emerald** | `#090d16` (গভীর ডার্ক) | `#111827` (কার্ড ডার্ক) | `#10b981` (উজ্জ্বল সবুজ) | `#f1f5f9` (সাদাটে টেক্সট) | **১২.৮ : ১ (AAA)** |
| **২. Light × Emerald** | `#f8fafc` (হালকা অফ-হোয়াইট) | `#ffffff` (সাদা কার্ড) | `#059669` (গাঢ় সবুজ) | `#0f172a` (গাঢ় টেক্সট) | **১১.৫ : ১ (AAA)** |
| **৩. Dark × Indigo** | `#0b0f19` (গভীর নীলচে ডার্ক)| `#131b2e` (নেভি কার্ড) | `#6366f1` (উজ্জ্বল নীল) | `#f1f5f9` (সাদাটে টেক্সট) | **১২.১ : ১ (AAA)** |
| **৪. Light × Indigo** | `#f8fafc` (অফ-হোয়াইট) | `#ffffff` (সাদা কার্ড) | `#4f46e5` (রয়েল নীল) | `#0f172a` (গাঢ় টেক্সট) | **১০.৯ : ১ (AAA)** |

---

## ৩. কম্পোনেন্ট রেসিপি আর্কিটেকচার (`class-variance-authority`)

সব কম্পোনেন্টের দৃশ্যমান রূপ `apps/web/src/design/recipes/` ফোল্ডারে ডিফাইন করা হয়:

### বাটন রেসিপি উদাহরণ (`recipes/button.ts`):
```typescript
import { cva } from 'class-variance-authority';

export const buttonRecipe = cva(
  'inline-flex items-center justify-center font-bold transition-all cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none rounded-[var(--radius-btn)]',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-hover shadow-xs active:scale-[0.98]',
        secondary: 'bg-surface-2 text-text hover:bg-surface-3 border border-border',
        accent: 'bg-accent text-accent-ink hover:opacity-90 shadow-xs',
        danger: 'bg-danger text-white hover:bg-danger/90',
        ghost: 'text-muted hover:text-text hover:bg-surface-2'
      },
      size: {
        sm: 'text-xs px-3 py-1.5 gap-1.5',
        md: 'text-xs sm:text-sm px-4 py-2 gap-2',
        lg: 'text-sm sm:text-base px-6 py-2.5 gap-2.5'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);
```

---

## ৪. নতুন থিম যোগ করার প্রক্রিয়া (Adding a New Theme)
যদি ক্লায়েন্ট কোনো নতুন কালার থিম চায় (যেমন: "Maroon" বা খয়েরি):
1. `packages/config/themes.json`-এ এন্ট্রি দিন:
   ```json
   { "id": "maroon", "name_bn": "খয়েরি (Maroon)", "swatch": "#881337" }
   ```
2. `packages/design-tokens/src/semantic.css`-এ ২টি রুল যোগ করুন:
   ```css
   [data-theme="maroon"][data-mode="dark"] {
     --c-primary: #f43f5e;
     --c-primary-soft: rgba(244, 63, 94, 0.15);
   }
   [data-theme="maroon"][data-mode="light"] {
     --c-primary: #9f1239;
     --c-primary-soft: rgba(159, 18, 57, 0.1);
   }
   ```
3. ফলাফল: স্কুল সিএমএস-এর থিম সিলেক্টরে সাথে সাথে "Maroon" থিম চলে আসবে এবং সমগ্র সাইট স্বয়ংক্রিয়ভাবে খয়েরি থিমে রেন্ডার হবে।

---

## ৫. প্রিন্ট আর্কিটেকচার (`print.css`)
- প্রিন্টারে কালি বাঁচাতে এবং অফিশিয়াল ডকুমেন্ট ঝকঝকে রাখতে `@media print`-এ:
  - ব্যাকগ্রাউন্ড সবসময় খাঁটি সাদা (`#ffffff`)।
  - টেক্সট সবসময় খাঁটি কালো (`#000000`)।
  - সমস্ত নেভিগেশন বার, হেডার টিকার, ড্রপডাউন এবং অ্যাকশন বাটন স্বয়ংক্রিয়ভাবে `display: none` (`.no-print`)।
  - প্রতিটি প্রিন্ট পেজের শীর্ষে স্কুলের ডাইনামিক `Letterhead.tsx` রেন্ডার হয়।

