# সহজ পাঠশালা — ডেটা ও ডোমেন মডেল স্পেসিফিকেশন (Domain Model)

## ১. প্ল্যাটফর্ম ও টেন্যান্ট সম্পর্ক (Entity-Relationship Diagram)

```mermaid
erDiagram
  PlatformUser ||--o{ PlatformAuditLog : logs
  Plan ||--o{ School : subscribes
  School ||--|| SchoolSettings : configures
  School ||--o{ SchoolUser : employs
  School ||--o{ Student : enrolls
  School ||--o{ AdmissionApplication : receives
  School ||--o{ TeacherStaff : lists
  School ||--o{ CommitteeMember : governs
  School ||--o{ Notice : publishes
  School ||--o{ HeroSlide : displays
  School ||--o{ AcademicRoutine : schedules
  School ||--o{ GalleryItem : showcases
  School ||--o{ VideoItem : streams
  School ||--o{ FeePayment : collects
  School ||--o{ ExamResult : records
  School ||--o{ AuditLog : audits

  Student ||--o{ FeePayment : pays
  Student ||--o{ ExamResult : achieves
  Notice ||--o{ FileAttachment : attaches

  School {
    string id PK "sch_xxxx"
    string slug UK "e.g. bdhs"
    string name_bn "বাংলা নাম"
    string name_en "English Name"
    string eiin UK "e.g. 106644"
    string mpo_code "e.g. 0905171301"
    string school_code "e.g. 4320"
    string board "e.g. কুমিল্লা"
    string plan_id FK "basic | standard | premium"
    string status "active | grace | suspended"
    date expires_at "সাবস্ক্রিপশন মেয়াদ"
    string theme "emerald | indigo"
    string logo "লোগো URL / base64"
  }

  SchoolSettings {
    string school_id PK,FK
    string tagline_bn "ট্যাগলাইন"
    string motto_bn "মূলমন্ত্র"
    string phone "প্রাতিষ্ঠানিক ফোন"
    string email "অফিসিয়াল ইমেইল"
    string address_bn "ঠিকানা"
    string headmaster_name "প্রধান শিক্ষকের নাম"
    string headmaster_photo "প্রধান শিক্ষকের ছবি"
    string headmaster_message "বাণী"
    string chairman_name "সভাপতির নাম"
    string chairman_photo "সভাপতির ছবি"
    string chairman_message "বাণী"
    string history_bn "ইতিহাস"
    string vision_bn "ভিশন"
    string mission_bn "মিশন"
    string map_embed_url "গুগল ম্যাপ লিঙ্ক"
  }

  Student {
    string id PK "std_xxxx"
    string school_id FK
    string student_id UK "e.g. BDHS-STD-1001"
    string name_bn "শিক্ষার্থীর নাম"
    string name_en "English Name"
    string class "6 | 7 | 8 | 9 | 10"
    string group "General | Science | Business | Humanities"
    int roll "ক্লাস রোল"
    string father_name "পিতার নাম"
    string mother_name "মাতার নাম"
    string mobile "অভিভাবকের মোবাইল"
    string photo "পাসপোর্ট ছবি"
    string status "active | alumni | transferred"
  }

  AdmissionApplication {
    string id PK "adm_xxxx"
    string school_id FK
    string tracking_id UK "e.g. BDHS-ADM-2027-1042"
    string name_bn "নাম"
    string name_en "English Name"
    string applied_class "6 | 7 | 8 | 9"
    string group "বিভাগ"
    string father_name "পিতার নাম"
    string mother_name "মাতার নাম"
    string mobile "মোবাইল"
    string photo "পাসপোর্ট ছবি"
    string status "pending | approved | rejected"
    int assigned_roll "বরাদ্দকৃত রোল"
    timestamp applied_at "আবেদনের সময়"
  }

  ExamResult {
    string id PK "res_xxxx"
    string school_id FK
    string student_id FK
    string class "শ্রেণি"
    int roll "রোল"
    string exam_name "Annual | Half-Yearly | Test"
    string year "2026"
    decimal total_gpa "e.g. 5.00"
    string status "PASSED | FAILED"
    json subjects "সাবজেক্ট নম্বর ও গ্রেড অ্যারে"
    boolean published "প্রকাশের স্থিতি"
  }

  FeePayment {
    string id PK "fee_xxxx"
    string school_id FK
    string receipt_no UK "e.g. BDHS-REC-2026-0042"
    string student_id FK
    string student_name "নাম"
    string class "শ্রেণি"
    int roll "রোল"
    decimal amount "টাকার পরিমাণ"
    string fee_head "Tuition | Admission | Exam"
    string month "নভেম্বর ২০২৬"
    timestamp date "প্রদানের তারিখ"
    string collected_by "আদায়কারীর নাম"
    string status "paid | cancelled"
  }

  Notice {
    string id PK "not_xxxx"
    string school_id FK
    string title "শিরোনাম"
    string description "বিস্তারিত"
    string category "exam | admission | academic | general"
    boolean is_urgent "টিকার জরুরি ফ্ল্যাগ"
    boolean published "প্রকাশ স্থিতি"
    date date "তারিখ"
    json attachment "ফাইলের মেটাডেটা ও লিংক"
  }
```

---

## ২. আইসোলেশন ও কনস্ট্রেইন্ট নীতি (Isolation & Integrity Rules)

1. **টেন্যান্ট আইসোলেশন বাউন্ডারি:**
   - ডেটাবেসের প্রতিটি টেন্যান্ট-টেবিলে প্রথম কলাম বাধ্যতামূলকভাবে `school_id`।
   - ইউনিক কনস্ট্রেইন্ট কখনই গ্লোবাল হবে না; এটি কম্পোজিট হবে:
     - `UNIQUE(school_id, student_id)`
     - `UNIQUE(school_id, class, roll)` — একই স্কুলে একই ক্লাসে দুইজনের একই রোল হতে পারবে না।
     - `UNIQUE(school_id, receipt_no)`
2. **আইডি ফরম্যাটিং (Deterministic Identifiers):**
   - স্কুল স্লাগ প্রিফিক্স ভিত্তিক অটো-ফরম্যাট:
     - শিক্ষার্থী: `{SLUG_UPPER}-STD-{YEAR}-{SERIAL4}` (e.g. `BDHS-STD-2026-0001`)
     - ভর্তি ট্র্যাকিং: `{SLUG_UPPER}-ADM-{YEAR}-{SERIAL4}` (e.g. `BDHS-ADM-2027-0104`)
     - রসিদ নম্বর: `{SLUG_UPPER}-REC-{YEAR}-{SERIAL5}` (e.g. `BDHS-REC-2026-00042`)
3. **Aggregate Roots:**
   - `School` হলো রুট টেন্যান্ট অ্যাগ্রিগেট।
   - `Student` হলো একাডেমিক ও আর্থিক ট্রানজেকশনের অ্যাগ্রিগেট।
   - কোনো চাইল্ড রেকর্ড (রসিদ, রেজাল্ট, হাজিরা) সরাসরি প্যারেন্ট ছাড়া তৈরি বা ডিলিট হতে পারবে না।

