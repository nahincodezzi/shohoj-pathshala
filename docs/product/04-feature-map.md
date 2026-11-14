# সহজ পাঠশালা — মডিউল ও ফিচার ম্যাপিং ম্যাট্রিক্স (Feature Map)

## ১. মডিউল × ফিচার ম্যাট্রিক্স

| ফিচার Key | মডিউল নাম | সর্বনিম্ন প্ল্যান | পারমিশন Key | সারফেস | ব্যবহৃত Entity | বিবরণ |
|---|---|:---:|---|---|---|---|
| `cms.branding` | ওয়েবসাইট সিএমএস | Basic | `cms.edit` | Admin, Public | `School`, `SchoolSettings` | স্কুলের লোগো, মনোগ্রাম, থিম (Emerald/Indigo), ট্যাগলাইন ও মূলমন্ত্র সম্পাদনা |
| `cms.sliders` | সিএমএস স্লাইডার | Basic | `cms.edit` | Admin, Public | `HeroSlide` | হোমপেজের হিরো ব্যানার স্লাইড ও ব্যানার ছবি আপলোড |
| `cms.speeches` | বাণী ব্যবস্থাপনা | Basic | `cms.edit` | Admin, Public | `SchoolSettings` | প্রধান শিক্ষক ও সভাপতির ছবি, নাম, পদবী ও বাণী কনফিগারেশন |
| `cms.uniform` | পোশাক নীতিমালা | Basic | `cms.edit` | Admin, Public | `UniformPolicy` | ছাত্র ও ছাত্রীদের নির্ধারিত ড্রেসকোড গাইডলাইন |
| `cms.about` | ইতিহাস ও ভিশন | Basic | `cms.edit` | Admin, Public | `SchoolSettings` | ইতিহাস, পটভূমি, ভিশন ও মিশন টেক্সট |
| `cms.contact` | যোগাযোগ তথ্য | Basic | `cms.edit` | Admin, Public | `SchoolSettings` | অফিসিয়াল ফোন, ইমেইল, অফিস আওয়ার্স ও গুগল ম্যাপ এমবেড |
| `notices.publish` | নোটিশ বোর্ড | Basic | `notices.manage` | Admin, Public | `Notice`, `FileAttachment` | একাডেমিক ও সাধারণ নোটিশ প্রকাশ, ফাইল/পিডিএফ সংযুক্তি ও টিকার ফ্ল্যাগ |
| `notices.read` | নোটিশ রিডার | Basic | — (পাবলিক) | Public | `Notice` | মডালে নোটিশের পূর্ণাঙ্গ বিবরণ ও অ্যাটাচমেন্ট ডাউনলোড |
| `admissions.apply` | ভর্তি আবেদন | Basic | — (পাবলিক) | Public | `AdmissionApplication` | ৬ষ্ঠ-৯ম শ্রেণির ৩-ধাপের ভর্তি ফরম পূরণ, পাসপোর্ট ছবি আপলোড |
| `admissions.admit_card` | প্রবেশপত্র প্রিন্ট | Basic | — (পাবলিক) | Public | `AdmissionApplication` | ট্র্যাকিং কোড ভিত্তিক ছবিযুক্ত অফিশিয়াল অ্যাডমিট কার্ড জেনারেশন |
| `admissions.review` | ভর্তি অনুমোদন | Basic | `admissions.manage` | Admin | `AdmissionApplication`, `Student` | আবেদন পর্যালোচনা, রোল বরাদ্দ ও এক ক্লিকে নিয়মিত শিক্ষার্থী বানানো |
| `students.directory` | শিক্ষার্থী ডিরেক্টরি | Basic | `students.view` | Admin | `Student` | শ্রেণি ও রোল অনুযায়ী ফিল্টারিং, প্রোফাইল ভিউ ও সিএসভি এক্সপোর্ট |
| `students.create` | নতুন শিক্ষার্থী এন্ট্রি | Basic | `students.manage` | Admin | `Student` | ম্যানুয়ালি শিক্ষার্থী তৈরি ও ক্লাস রোল অ্যাসাইনমেন্ট |
| `results.entry` | নম্বর এন্ট্রি | Basic | `results.entry` | Admin | `ExamResult`, `GradeScale` | সাবজেক্ট ভিত্তিক সৃজনশীল, বহুনির্বাচনী ও ব্যবহারিক নম্বর ইনপুট |
| `results.publish` | রেজাল্ট প্রকাশ | Basic | `results.publish` | Admin | `ExamResult` | প্রধান শিক্ষকের ফাইনাল অ্যাপ্রুভাল ও গ্রেড পয়েন্ট গণনা |
| `results.search` | মার্কশিট অনুসন্ধান | Basic | — (পাবলিক) | Public | `ExamResult`, `Student` | পাবলিকলি রোল ও শ্রেণি দিয়ে ডিজিটাল মার্কশিট সার্চ ও প্রিন্ট |
| `results.tabulation` | পূর্ণাঙ্গ ট্যাবুলেশন শিট | Standard | `results.tabulation` | Admin | `ExamResult` | ক্লাসের সকল শিক্ষার্থীর সম্মিলিত মার্কশিট ও মেধা তালিকা (Merit List) |
| `fees.collect` | ফি গ্রহণ ও রসিদ | Standard | `fees.collect` | Admin | `FeePayment`, `FeeHead` | বেতন, ভর্তি ফি বা সেশন ফি আদায় এবং ডিজিটাল রসিদ ইস্যু |
| `fees.cancel` | রসিদ বাতিলকরণ | Standard | `fees.cancel` | Admin | `FeePayment` | ভুল রসিদ বাতিল ও অডিট লগ সংরক্ষণ |
| `fees.ledger` | বকেয়া লেজার | Premium | `fees.reports` | Admin | `FeePayment`, `StudentDues` | শিক্ষার্থীভিত্তিক মাসিক বকেয়া তালিকা ও রিকভারি ট্র্যাকিং |
| `teachers.directory` | শিক্ষক পরিষদ তালিকা | Basic | — (পাবলিক) | Public | `TeacherStaff` | ক্যানোনিকাল ক্রমানুসারে (১৬ জন) শিক্ষক ও কর্মচারীদের তথ্য ও ফোন প্রদর্শন |
| `teachers.manage` | শিক্ষক প্রোফাইল কন্ট্রোল | Basic | `teachers.manage` | Admin | `TeacherStaff` | পদবী, শিক্ষাগত যোগ্যতা, সিরিয়াল ও ইমেইল হালনাগাদ |
| `committee.view` | পরিচালনা পর্ষদ | Basic | — (পাবলিক) | Public | `CommitteeMember` | সভাপতি ও সদস্যবৃন্দের কার্যকাল ও তথ্য প্রদর্শন |
| `routines.download` | রুটিন ও সিলেবাস | Basic | — (পাবলিক) | Public | `AcademicRoutine` | ক্লাস রুটিন ও সিলেবাসের PDF ডাউনলোড |
| `gallery.photos` | ফটো অ্যালবাম | Standard | `gallery.manage` | Admin, Public | `GalleryItem` | ইভেন্টভিত্তিক ছবি আপলোড ও ক্যাটাগরাইজড অ্যালবাম ভিউ |
| `gallery.videos` | ভিডিও কর্নার | Standard | `gallery.manage` | Admin, Public | `VideoItem` | ইউটিউব লিঙ্ক বা সরাসরি ভিডিও ক্লিপ আপলোড এবং প্লেয়ার মডাল |
| `users.rbac` | ব্যবহারকারী ও ভূমিকা | Standard | `users.manage` | Admin | `UserAccount`, `Permission` | অ্যাডমিন রোল নির্ধারণ (Basic: ৩, Standard: ৮, Premium: ১৫) |
| `sms.broadcast` | এসএমএস নোটিফিকেশন | Premium | `sms.send` | Admin | `SmsLog`, `Student` | অভিভাবক ও শিক্ষকের মোবাইলে নোটিশ ও রেজাল্ট অ্যালার্ট প্রেরণ |
| `audit.log` | অ্যাক্টিভিটি হিস্ট্রি | Premium | `audit.view` | Admin, Owner | `AuditLog` | আর্থিক লেনদেন, নম্বর পরিবর্তন ও রিসেটের টাইমস্ট্যাম্পড অডিট রেকর্ড |
| `owner.tenants` | টেন্যান্ট ব্যবস্থাপনা | Enterprise | `owner.access` | Owner | `School`, `Subscription` | স্কুলের স্ট্যাটাস নিয়ন্ত্রণ (Active/Grace/Suspended) ও মেয়াদ বৃদ্ধি |
| `owner.support_mode` | সাপোর্ট মোড | Enterprise | `owner.access` | Owner, Admin | `TenantContext` | রিড-অনলি মোডে যেকোনো স্কুলের পোর্টালে ঢুকে ট্রাবলশুটিং |
