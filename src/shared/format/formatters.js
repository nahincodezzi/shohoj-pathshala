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

export function formatDate(dateInput, isBengali = true, options = {}) {
  if (!dateInput) return '';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    if (!isBengali) {
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: options.shortMonth ? 'short' : 'long',
        year: 'numeric',
        timeZone: 'Asia/Dhaka'
      });
    }

    const bnDay = formatNumber(day, true);
    const bnMonth = BENGALI_MONTHS[month];
    const bnYear = formatNumber(year, true);

    if (options.dayOnly) return bnDay;
    if (options.monthYearOnly) return `${bnMonth} ${bnYear}`;

    return `${bnDay} ${bnMonth} ${bnYear}`;
  } catch (e) {
    return String(dateInput);
  }
}
