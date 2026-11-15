import { useEffect } from 'react';

export default function SchoolMeta({ school, settings, mode }) {
  useEffect(() => {
    if (!school) return;

    const schoolName = school.name_bn || school.name || 'সহজ পাঠশালা';
    document.title = `${schoolName} — অফিশিয়াল ওয়েবসাইট`;

    // 1. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = settings?.meta_description || `${schoolName}-এর প্রাতিষ্ঠানিক ডিজিটাল পোর্টাল। ভর্তি, ফলাফল, নোটিশ ও যাবতীয় তথ্য।`;

    // 2. Theme color
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.content = mode === 'light' ? '#FBF9F4' : '#06120E';

    // 3. Favicon from logo if available
    if (school.logo) {
      let iconLink = document.querySelector('link[rel="icon"]');
      if (iconLink) {
        iconLink.href = school.logo;
      }
    }
  }, [school, settings, mode]);

  return null;
}
