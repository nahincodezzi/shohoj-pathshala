/**
 * Sohoj Pathshala — Media & SVG Asset Generator
 * Creates lightweight, high-fidelity SVGs for logos, official seals, signatures,
 * hero banners, and campus/facility/gallery graphics.
 */

import fs from 'fs';
import path from 'path';
import { SCHOOL_SPECS } from '../schools.js';

export function generateSchoolSvgAssets() {
  const publicDir = path.resolve('public', 'seed-media');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const manifest = [];

  SCHOOL_SPECS.forEach(school => {
    const slug = school.slug;
    const schoolDir = path.join(publicDir, slug);
    if (!fs.existsSync(schoolDir)) {
      fs.mkdirSync(schoolDir, { recursive: true });
    }

    const isEmerald = school.theme === 'emerald';
    const primaryColor = isEmerald ? '#059669' : '#4f46e5';
    const darkColor = isEmerald ? '#064e3b' : '#312e81';
    const accentColor = '#f59e0b';

    // 1. Monogram Logo SVG
    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="grad_${slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="${darkColor}"/>
    </linearGradient>
    <filter id="shadow_${slug}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.25"/>
    </filter>
  </defs>
  <circle cx="100" cy="100" r="92" fill="url(#grad_${slug})" filter="url(#shadow_${slug})"/>
  <circle cx="100" cy="100" r="82" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="6,4"/>
  <circle cx="100" cy="100" r="72" fill="#ffffff" opacity="0.08"/>
  
  <!-- Central Emblem: Open Book & Rising Sun Motif -->
  <g transform="translate(100, 95) scale(0.9)">
    <!-- Sun Rays -->
    <path d="M-40 -20 Q0 -50 40 -20 Q0 -35 -40 -20" fill="${accentColor}" opacity="0.9"/>
    <circle cx="0" cy="-25" r="16" fill="${accentColor}"/>
    <!-- Open Book -->
    <path d="M0 10 C-15 -5 -40 -5 -50 5 L-50 25 C-40 15 -15 15 0 28 C15 15 40 15 50 25 L50 5 C40 -5 15 -5 0 10 Z" fill="#ffffff"/>
    <line x1="0" y1="12" x2="0" y2="30" stroke="${darkColor}" stroke-width="2"/>
    <!-- Torch flame / pen tip -->
    <path d="M-4 -12 Q0 -30 4 -12 Q0 -2 -4 -12" fill="#ef4444"/>
  </g>
  
  <!-- Est Year & School Prefix -->
  <text x="100" y="160" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-weight="700" font-size="13" fill="#ffffff" text-anchor="middle" letter-spacing="1">
    স্থাপিত: ${school.established}
  </text>
  <text x="100" y="42" font-family="sans-serif" font-weight="800" font-size="14" fill="${accentColor}" text-anchor="middle" letter-spacing="2">
    ${school.code_prefix}
  </text>
</svg>`;
    fs.writeFileSync(path.join(schoolDir, 'logo.svg'), logoSvg.trim());

    // 2. Official Seal / Stamp SVG
    const sealSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" width="220" height="220">
  <defs>
    <path id="circlePath_${slug}" d="M 110, 110 m -78, 0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"/>
  </defs>
  <circle cx="110" cy="110" r="95" fill="none" stroke="${primaryColor}" stroke-width="4"/>
  <circle cx="110" cy="110" r="88" fill="none" stroke="${primaryColor}" stroke-width="1.5" stroke-dasharray="4,3"/>
  <circle cx="110" cy="110" r="62" fill="none" stroke="${primaryColor}" stroke-width="2"/>
  
  <text fill="${primaryColor}" font-family="'Hind Siliguri', sans-serif" font-size="11" font-weight="700">
    <textPath href="#circlePath_${slug}" startOffset="50%" text-anchor="middle">
      ${school.name_bn} • EIIN: ${school.eiin} •
    </textPath>
  </text>
  
  <g transform="translate(110, 105)" text-anchor="middle">
    <text y="-8" fill="${primaryColor}" font-family="'Hind Siliguri', sans-serif" font-size="14" font-weight="800">অনুমোদিত</text>
    <text y="12" fill="${accentColor}" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1.5">OFFICIAL SEAL</text>
    <rect x="-35" y="18" width="70" height="15" rx="3" fill="#ef4444" opacity="0.9"/>
    <text y="29" fill="#ffffff" font-family="sans-serif" font-size="9" font-weight="bold">DEMO SEAL</text>
  </g>
</svg>`;
    fs.writeFileSync(path.join(schoolDir, 'seal.svg'), sealSvg.trim());

    // 3. Head Teacher Signature SVG
    const sigSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="240" height="80">
  <path d="M 20 50 Q 50 15 70 45 T 110 35 T 150 55 Q 180 20 200 45" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 40 55 Q 90 65 180 50" fill="none" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round"/>
  <text x="120" y="70" font-family="'Hind Siliguri', sans-serif" font-size="11" fill="#64748b" text-anchor="middle">
    প্রধান শিক্ষক / ভারপ্রাপ্ত প্রধান শিক্ষক (DEMO)
  </text>
</svg>`;
    fs.writeFileSync(path.join(schoolDir, 'signature.svg'), sigSvg.trim());

    // 4. Hero Banner Illustrations (3 distinct banners per school)
    for (let i = 1; i <= 3; i++) {
      const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800" width="1600" height="800">
  <defs>
    <linearGradient id="hgrad_${slug}_${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${i === 1 ? darkColor : i === 2 ? '#0f172a' : primaryColor}"/>
      <stop offset="100%" stop-color="${i === 1 ? '#022c22' : i === 2 ? darkColor : '#1e1b4b'}"/>
    </linearGradient>
    <pattern id="grid_${slug}_${i}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.75" opacity="0.07"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#hgrad_${slug}_${i})"/>
  <rect width="100%" height="100%" fill="url(#grid_${slug}_${i})"/>
  
  <!-- Scenic Bangladeshi School Campus Shapes -->
  <g opacity="0.25">
    <circle cx="1400" cy="150" r="180" fill="${accentColor}"/>
    <polygon points="100,750 350,450 600,750" fill="#ffffff" opacity="0.1"/>
    <polygon points="450,750 700,500 950,750" fill="#ffffff" opacity="0.08"/>
    <!-- Building silhouette -->
    <rect x="900" y="420" width="550" height="330" fill="#ffffff" rx="8" opacity="0.12"/>
    <rect x="950" y="460" width="80" height="70" fill="#ffffff" opacity="0.2"/>
    <rect x="1060" y="460" width="80" height="70" fill="#ffffff" opacity="0.2"/>
    <rect x="1170" y="460" width="80" height="70" fill="#ffffff" opacity="0.2"/>
    <rect x="1280" y="460" width="80" height="70" fill="#ffffff" opacity="0.2"/>
    <rect x="950" y="560" width="80" height="70" fill="#ffffff" opacity="0.2"/>
    <rect x="1060" y="560" width="80" height="70" fill="#ffffff" opacity="0.2"/>
    <rect x="1170" y="560" width="80" height="70" fill="#ffffff" opacity="0.2"/>
    <rect x="1280" y="560" width="80" height="70" fill="#ffffff" opacity="0.2"/>
  </g>
  
  <!-- Contextual Badge -->
  <rect x="100" y="100" width="220" height="38" rx="19" fill="#ffffff" opacity="0.15"/>
  <text x="210" y="124" fill="#ffffff" font-family="'Hind Siliguri', sans-serif" font-size="14" font-weight="600" text-anchor="middle">
    ${i === 1 ? '🏫 প্রাতিষ্ঠানিক ক্যাম্পাস' : i === 2 ? '🎓 ডিজিটাল শিক্ষাব্যবস্থা' : '🔬 বিজ্ঞানাগার ও ল্যাব'}
  </text>
  
  <!-- Overlay Content -->
  <text x="100" y="240" fill="#ffffff" font-family="'Hind Siliguri', sans-serif" font-size="44" font-weight="800">
    ${school.name_bn}
  </text>
  <text x="100" y="300" fill="${accentColor}" font-family="'Hind Siliguri', sans-serif" font-size="24" font-weight="600">
    ${i === 1 ? 'নৈতিক শিক্ষা ও আধুনিক প্রযুক্তির সমন্বয়ে ভবিষ্যৎ বিনির্মাণ' : i === 2 ? 'মাল্টিমিডিয়া ক্লাসরুম ও দক্ষ শিক্ষক মণ্ডলী' : 'সহ-শিক্ষা কার্যক্রম ও সমৃদ্ধ ল্যাবরেটরি সুবিধা'}
  </text>
  <text x="100" y="340" fill="#e2e8f0" font-family="sans-serif" font-size="16" opacity="0.8">
    EIIN: ${school.eiin} • Board: ${school.board} • Est: ${school.established} (Sohoj Pathshala Demo)
  </text>
</svg>`;
      fs.writeFileSync(path.join(schoolDir, `hero-${i}.svg`), heroSvg.trim());
    }

    manifest.push({
      school_slug: slug,
      school_name: school.name_bn,
      logo: `/seed-media/${slug}/logo.svg`,
      seal: `/seed-media/${slug}/seal.svg`,
      signature: `/seed-media/${slug}/signature.svg`,
      hero_images: [
        `/seed-media/${slug}/hero-1.svg`,
        `/seed-media/${slug}/hero-2.svg`,
        `/seed-media/${slug}/hero-3.svg`
      ]
    });
  });

  const manifestDir = path.resolve('seed', 'media');
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }
  fs.writeFileSync(path.join(manifestDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`Generated SVG media assets for ${SCHOOL_SPECS.length} schools.`);
}
