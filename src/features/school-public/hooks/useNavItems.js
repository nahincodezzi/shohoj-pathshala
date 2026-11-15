import { useMemo } from 'react';

/**
 * Universal Navigation Items Hook for Desktop Nav, Mobile Drawer,
 * School Footer, and Mobile Bottom Tab Bar.
 * Strictly respects feature gating: if a feature is disabled, it leaves no gap.
 */
export function useNavItems({ features = {}, sections = {}, lang = 'bn' }) {
  return useMemo(() => {
    const isBn = lang === 'bn';

    const items = [
      { id: 'home', label: isBn ? 'হোম' : 'Home', href: '#home', type: 'link' },
      { id: 'about', label: isBn ? 'আমাদের সম্পর্কে' : 'About Us', href: '#about', type: 'link' },
      { id: 'academics', label: isBn ? 'একাডেমিক' : 'Academics', href: '#departments', type: 'link' }
    ];

    // Admission Item (Gated by features.admissionForm or features.admissionTrack)
    if (features.admissionForm || features.admissionTrack) {
      items.push({
        id: 'admission',
        label: isBn ? 'অনলাইন ভর্তি' : 'Admission',
        href: '#admission',
        type: 'admission-pill',
        hasPing: Boolean(features.admissionForm)
      });
    }

    // Results Item (Gated by features.resultSearch)
    if (features.resultSearch) {
      items.push({
        id: 'results',
        label: isBn ? 'রেজাল্ট' : 'Results',
        href: '#results',
        type: 'link'
      });
    }

    // Notices
    if (sections.notices) {
      items.push({
        id: 'notices',
        label: isBn ? 'নোটিশ' : 'Notices',
        href: '#notices',
        type: 'link'
      });
    }

    // Gallery
    if (sections.gallery) {
      items.push({
        id: 'gallery',
        label: isBn ? 'গ্যালারি' : 'Gallery',
        href: '#gallery',
        type: 'link'
      });
    }

    // Contact
    items.push({
      id: 'contact',
      label: isBn ? 'যোগাযোগ' : 'Contact',
      href: '#contact',
      type: 'link'
    });

    // Mobile Bottom Tab items (Max 4 items)
    const bottomTabs = [
      { id: 'home', label: isBn ? 'হোম' : 'Home', href: '#home', icon: 'Home' },
      { id: 'notices', label: isBn ? 'নোটিশ' : 'Notices', href: '#notices', icon: 'Bell' }
    ];

    if (features.admissionForm) {
      bottomTabs.push({ id: 'admission', label: isBn ? 'ভর্তি' : 'Admission', href: '#admission', icon: 'GraduationCap' });
    } else if (features.resultSearch) {
      bottomTabs.push({ id: 'results', label: isBn ? 'রেজাল্ট' : 'Results', href: '#results', icon: 'FileText' });
    }

    bottomTabs.push({ id: 'contact', label: isBn ? 'যোগাযোগ' : 'Contact', href: '#contact', icon: 'Phone' });

    return {
      navItems: items,
      bottomTabs
    };
  }, [features, sections, lang]);
}
