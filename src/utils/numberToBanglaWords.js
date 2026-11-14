/**
 * Converts numbers into Bengali words for Money Receipts & Financial Documents
 * Example: 750 -> "সাতশত পঞ্চাশ টাকা মাত্র"
 * Example: 3000 -> "তিন হাজার টাকা মাত্র"
 */

const ONES = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়'];
const TEENS = ['দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ'];
const TENS = ['', '', 'বিশ', 'ত্রিশ', 'চল্লিশ', 'পঞ্চাশ', 'ষাট', 'সত্তর', 'আশি', 'নব্বই'];

const SPECIAL = {
  21: 'একুশ', 22: 'বাইশ', 23: 'তেইশ', 24: 'চব্বিশ', 25: 'পঁচিশ', 26: 'ছাব্বিশ', 27: 'সাতাশ', 28: 'আঠাশ', 29: 'ঊনত্রিশ',
  31: 'একত্রিশ', 32: 'বত্রিশ', 33: 'তেত্রিশ', 34: 'চৌত্রিশ', 35: 'পঁয়ত্রিশ', 36: 'ছত্রিশ', 37: 'সাঁইত্রিশ', 38: 'আটত্রিশ', 39: 'ঊনচল্লিশ',
  41: 'একচল্লিশ', 42: 'বিয়াল্লিশ', 43: 'তেতাল্লিশ', 44: 'চুয়াল্লিশ', 45: 'পঁয়তাল্লিশ', 46: 'ছেচল্লিশ', 47: 'সাতচল্লিশ', 48: 'আটচল্লিশ', 49: 'ঊনপঞ্চাশ',
  51: 'একান্ন', 52: 'বায়ান্ন', 53: 'তিপ্পান্ন', 54: 'চুয়ান্ন', 55: 'পঞ্চান্ন', 56: 'ছাপ্পান্ন', 57: 'সাতান্ন', 58: 'আটান্ন', 59: 'ঊনষাট',
  61: 'একষট্টি', 62: 'বাষট্টি', 63: 'তেষট্টি', 64: 'চৌষট্টি', 65: 'পঁয়ষট্টি', 66: 'ছেষট্টি', 67: 'সাতষট্টি', 68: 'আটষট্টি', 69: 'ঊনসত্তর',
  71: 'একাত্তর', 72: 'বাহাত্তর', 73: 'তিয়াত্তর', 74: 'চুয়াত্তর', 75: 'পঁচাত্তর', 76: 'ছিয়াত্তর', 77: 'সাতাত্তর', 78: 'আটাত্তর', 79: 'ঊনআশি',
  81: 'একাশি', 82: 'বিরাশি', 83: 'তিরাশি', 84: 'চুরাশি', 85: 'পঁচাশি', 86: 'ছিয়াশি', 87: 'সাতাশি', 88: 'অষ্টআশি', 89: 'ঊননব্বই',
  91: 'একানব্বই', 92: 'বিরানব্বই', 93: 'তিরানব্বই', 94: 'চুরানব্বই', 95: 'পঁচানব্বই', 96: 'ছিয়ানব্বই', 97: 'সাতানব্বই', 98: 'আটানব্বই', 99: 'নিরানব্বই'
};

function convertTwoDigits(num) {
  if (num === 0) return '';
  if (num < 10) return ONES[num];
  if (num < 20) return TEENS[num - 10];
  if (SPECIAL[num]) return SPECIAL[num];
  const ten = Math.floor(num / 10);
  const one = num % 10;
  return `${TENS[ten]} ${ONES[one]}`.trim();
}

export function numberToBanglaWords(amount) {
  const num = Math.floor(Number(amount) || 0);
  if (num === 0) return 'শূন্য টাকা মাত্র';

  let remaining = num;
  const parts = [];

  // কোটি (Crore)
  if (remaining >= 10000000) {
    const crore = Math.floor(remaining / 10000000);
    parts.push(`${convertTwoDigits(crore)} কোটি`);
    remaining %= 10000000;
  }

  // লক্ষ (Lakh)
  if (remaining >= 100000) {
    const lakh = Math.floor(remaining / 100000);
    parts.push(`${convertTwoDigits(lakh)} লক্ষ`);
    remaining %= 100000;
  }

  // হাজার (Thousand)
  if (remaining >= 1000) {
    const thousand = Math.floor(remaining / 1000);
    parts.push(`${convertTwoDigits(thousand)} হাজার`);
    remaining %= 1000;
  }

  // শত (Hundred)
  if (remaining >= 100) {
    const hundred = Math.floor(remaining / 100);
    if (hundred === 1) parts.push('একশত');
    else if (hundred === 2) parts.push('দুইশত');
    else if (hundred === 3) parts.push('তিনশত');
    else if (hundred === 4) parts.push('চারশত');
    else if (hundred === 5) parts.push('পাঁচশত');
    else if (hundred === 6) parts.push('ছয়শত');
    else if (hundred === 7) parts.push('সাতশত');
    else if (hundred === 8) parts.push('আটশত');
    else if (hundred === 9) parts.push('নয়শত');
    remaining %= 100;
  }

  // Remaining 1-99
  if (remaining > 0) {
    parts.push(convertTwoDigits(remaining));
  }

  return `${parts.join(' ')} টাকা মাত্র`;
}
