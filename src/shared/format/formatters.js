/**
 * Universal Number & Date Formatting Helpers for Sohoj Pathshala
 * Guarantees Asia/Dhaka timezone, English <-> Bengali digit conversions,
 * and tabular-numeric consistency.
 */

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function formatNumber(num, isBengali = true) {
  if (num === null || num === undefined || num === '') return '';
  const str = String(num);
  if (!isBengali) return str;
  return str.replace(/[0-9]/g, (d) => BENGALI_DIGITS[parseInt(d, 10)] || d);
}

export function toEnglishDigits(str) {
  if (!str) return '';
  return String(str).replace(/[০-৯]/g, (d) => {
    const idx = BENGALI_DIGITS.indexOf(d);
    return idx !== -1 ? String(idx) : d;
  });
}

const BENGALI_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const BENGALI_MONTHS_SHORT = [
  'জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'
];

export function formatDate(dateInput, isBengali = true, options = {}) {
  if (!dateInput) return '';
  try {
    // 1. Normalize Bengali digits to English digits if input is string
    const normalizedInput = typeof dateInput === 'string' ? toEnglishDigits(dateInput.trim()) : dateInput;

    let day, month, year;
    // 2. Deterministic YYYY-MM-DD parsing (prevents timezone offset shifts)
    if (typeof normalizedInput === 'string' && /^\d{4}-\d{2}-\d{2}/.test(normalizedInput)) {
      const parts = normalizedInput.split(/[-T ]/);
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    } else {
      const date = new Date(normalizedInput);
      if (isNaN(date.getTime())) return String(dateInput);
      day = date.getDate();
      month = date.getMonth();
      year = date.getFullYear();
    }

    if (!isBengali) {
      if (options.dayOnly) return String(day).padStart(2, '0');
      if (options.monthYearOnly) {
        const shortMonthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${shortMonthsEn[month]} ${year}`;
      }
      return `${day} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month]} ${year}`;
    }

    const bnDay = formatNumber(String(day).padStart(2, '0'), true);
    const bnMonth = BENGALI_MONTHS[month] || '';
    const bnMonthShort = BENGALI_MONTHS_SHORT[month] || bnMonth;
    const bnYear = formatNumber(year, true);

    if (options.dayOnly) return bnDay;
    if (options.monthYearOnly) return options.shortMonth ? `${bnMonthShort} '${bnYear.slice(-2)}` : `${bnMonthShort} ${bnYear}`;

    return `${bnDay} ${bnMonth} ${bnYear}`;
  } catch (e) {
    return String(dateInput);
  }
}
