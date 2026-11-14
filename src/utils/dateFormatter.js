/**
 * Utilities for Bangla formatting, Numerals, Asia/Dhaka Dates and Ordinals
 */

export const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(val) {
  if (val === null || val === undefined) return '';
  return String(val).replace(/[0-9]/g, (d) => BANGLA_DIGITS[Number(d)]);
}

export function toEnglishNumber(val) {
  if (val === null || val === undefined) return '';
  return String(val).replace(/[০-৯]/g, (d) => '০১২৩৪৫৬৭৮৯'.indexOf(d));
}

export function toBengaliOrdinal(num) {
  const n = Number(toEnglishNumber(num));
  switch (n) {
    case 6: return '৬ষ্ঠ';
    case 7: return '৭ম';
    case 8: return '৮ম';
    case 9: return '৯ম';
    case 10: return '১০ম';
    default: return `${toBengaliNumber(n)} শ্রেণি`;
  }
}

export function formatDhakaDate(dateStringOrObj, includeTime = false) {
  if (!dateStringOrObj) return '';
  try {
    const d = new Date(dateStringOrObj);
    if (isNaN(d.getTime())) return String(dateStringOrObj);

    // Options for Asia/Dhaka
    const options = {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = true;
    }

    const formatted = new Intl.DateTimeFormat('bn-BD', options).format(d);
    return formatted;
  } catch {
    return String(dateStringOrObj);
  }
}

export function getTodayDhakaISO() {
  const now = new Date();
  // Offset to UTC+6 (Asia/Dhaka)
  const dhakaOffset = 6 * 60 * 60 * 1000;
  const dhakaTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + dhakaOffset);
  return dhakaTime.toISOString().split('T')[0];
}

