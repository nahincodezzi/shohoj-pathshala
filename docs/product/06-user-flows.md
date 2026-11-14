# সহজ পাঠশালা — ব্যবহারকারী ফ্লো স্পেসিফিকেশন (User Flows)

## ১. স্কুল অনবোর্ডিং ও রেজিস্ট্রেশন ফ্লো

```mermaid
sequenceDiagram
  autonumber
  actor Owner as প্ল্যাটফর্ম ওনার (/owner)
  participant App as ওনার প্যানেল
  participant Repo as Tenant Repository
  participant DB as PostgreSQL (RLS)

  Owner->>App: নতুন স্কুল তৈরি ফরম পূরণ (নাম, slug, EIIN, প্ল্যান, পাসওয়ার্ড)
  App->>Repo: createSchool(data)
  Repo->>DB: INSERT into schools (slug, eiin, status='active')
  Repo->>DB: INSERT into school_settings (ডিফল্ট টেমপ্লেট ও বাণী)
  Repo->>DB: INSERT into school_users (school_superadmin রোল)
  Repo->>DB: SEED modules (রুটিন, নোটিশ, স্লাইডার, ইউনিফর্ম)
  App-->>Owner: সাকসেস মেসেজ + স্কুলের সাইট ও লগইন ইউআরএল
```

---

## ২. অনলাইন ভর্তি আবেদন ➔ রোল বরাদ্দ ➔ শিক্ষার্থী অনুমোদন

```mermaid
flowchart TD
  Start([শিক্ষার্থী / অভিভাবক]) --> Form["ভর্তি ফরম পূরণ (ধাপ ১-৩) + ছবি আপলোড"]
  Form --> Submit["আবেদন জমা দেওয়া"]
  Submit --> GenTrack["ইউনিক ট্র্যাকিং আইডি ও ডিজিটাল প্রবেশপত্র তৈরি"]
  GenTrack --> PrintSlip["শিক্ষার্থীর প্রবেশপত্র (Admit Slip) প্রিন্ট"]

  GenTrack --> Pending["স্কুল অ্যাডমিন পোর্টালে 'অপেক্ষমাণ' তালিকা"]
  Pending --> Review{"প্রধান শিক্ষক পর্যালোচনা"}
  Review -->|বাতিল| Rejected["স্ট্যাটাস: Rejected (বাতিল)"]
  Review -->|অনুমোদন| Approve["স্বয়ংক্রিয় রোল বরাদ্দ (Max Roll + 1)"]
  Approve --> CreateStudent["সরাসরি Student টেবিলে শিক্ষার্থী তৈরি"]
  CreateStudent --> Done["স্ট্যাটাস: Approved (অনুমোদিত)"]
  Done --> PublicNotify["পাবলিক ট্র্যাকিং সার্চে রোল ও অনুমোদিত স্ট্যাটাস প্রদর্শন"]
```

---

## ৩. পরীক্ষার ফলাফল এন্ট্রি ➔ প্রধান শিক্ষকের অনুমোদন ➔ পাবলিক মার্কশিট অনুসন্ধান

```mermaid
sequenceDiagram
  autonumber
  actor Teacher as বিষয় শিক্ষক (Teacher)
  actor Head as প্রধান শিক্ষক (Headmaster)
  actor Student as শিক্ষার্থী / অভিভাবক
  participant API as Results Service
  participant DB as রেজাল্ট ডেটাবেস

  Teacher->>API: শ্রেণি ও বিষয় অনুযায়ী নম্বর এন্ট্রি (CQ + MCQ + Practical)
  API->>DB: খসড়া মার্কস সংরক্ষণ (published=false)
  Head->>API: পরীক্ষার ফলাফল ও ট্যাবুলেশন শিট রিভিউ
  Head->>API: "অনুমোদন ও প্রকাশ করুন" বাটনে ক্লিক
  API->>DB: জিপিএ ও গ্রেড গণনা + published=true
  Student->>API: শ্রেণি ও রোল দিয়ে সার্চ (Results Search Form)
  API->>Student: অফিশিয়াল ডিজিটাল ট্রান্সক্রিপ্ট ও মার্কশিট রিটার্ন
  Student->>Student: মার্কশিট প্রিন্ট / PDF সংরক্ষণ
```

---

## ৪. ফি আদায় ➔ ডিজিটাল রসিদ ➔ বাতিলকরণ (Audit Invalidation)

```mermaid
sequenceDiagram
  autonumber
  actor Cashier as হিসাবরক্ষক (Accountant)
  actor Super as সুপার অ্যাডমিন
  participant FeeService as ফি সার্ভিস
  participant Audit as অডিট সার্ভিস

  Cashier->>FeeService: শিক্ষার্থী নির্বাচন + ফি খাত (Tuition Fee) + টাকা গ্রহণ
  FeeService->>FeeService: ইউনিক রসিদ নম্বর জেনারেশন (e.g. BDHS-REC-2026-0042)
  FeeService-->>Cashier: ডিজিটাল মানি রিসিট (প্রিন্ট কপি)
  
  Note over Cashier,Super: ভুলবশত ভুল অঙ্কের রসিদ কাটা হলে
  Cashier->>Super: রসিদ বাতিলের অনুরোধ
  Super->>FeeService: রসিদ বাতিল (status='cancelled', কারণ সহ)
  FeeService->>Audit: অডিট লগ এন্ট্রি (কে, কখন, কেন বাতিল করেছে)
  FeeService-->>Super: রসিদ স্ট্রাইকথ্রু বাতিল এবং লেজার রিভার্সাল
```

---

## ৫. সাবস্ক্রিপশন লাইফসাইকেল (Active ➔ Grace ➔ Suspended ➔ Renewal)

```mermaid
stateDiagram-v2
  [*] --> Active : সাবস্ক্রিপশন পেমেন্ট সম্পন্ন
  Active --> Grace : মেয়াদ উত্তীর্ণ (0 দিন বাকি)
  note right of Grace
    ১৫ দিনের গ্রেস পিরিয়ড।
    অ্যাডমিন প্যানেলে লাল সতর্কতা ব্যানার।
    পাবলিক সাইট চালু থাকবে।
  end note
  Grace --> Suspended : গ্রেস পিরিয়ড শেষ (১৫ দিন অতিক্রান্ত)
  note right of Suspended
    অ্যাডমিন ও পাবলিক সাইট লকড।
    "Service Suspended" ব্যানার প্রদর্শিত হবে।
  end note
  Grace --> Active : বকেয়া পরিশোধ ও রিনিউ
  Suspended --> Active : ওনার প্যানেল থেকে মেয়াদ বৃদ্ধি
```

---

## ৬. সাপোর্ট মোড ফ্লো (Impersonation by Platform Owner)

```mermaid
sequenceDiagram
  autonumber
  actor Owner as প্ল্যাটফর্ম ওনার (/owner)
  participant Guard as Tenancy & Auth Guard
  participant SchoolAdmin as স্কুলের অ্যাডমিন প্যানেল

  Owner->>Guard: "সাপোর্ট মোডে প্রবেশ" (স্কুল: bdhs)
  Guard->>Guard: স্পেশাল টোকেন ইস্যু (role='support_mode', read_only=true)
  Guard->>SchoolAdmin: রিডাইরেক্ট /{slug}/admin
  SchoolAdmin->>SchoolAdmin: টপবারে জ্বলজ্বলে হলুদ "সাপোর্ট মোড (Read-Only)" ব্যানার প্রদর্শন
  SchoolAdmin->>SchoolAdmin: সকল Add/Edit/Delete/Reset বাটন স্বয়ংক্রিয়ভাবে ডিজেবল
  Owner->>SchoolAdmin: কোনো কনফিগারেশন সমস্যা বা ডেটা মিসম্যাচ পর্যবেক্ষণ
  Owner->>SchoolAdmin: "সাপোর্ট মোড ত্যাগ করুন" বাটনে ক্লিক
  SchoolAdmin-->>Owner: নিরাপদভাবে ওনার প্যানেলে ফেরত
```

