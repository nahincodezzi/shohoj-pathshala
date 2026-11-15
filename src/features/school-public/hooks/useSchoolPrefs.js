import { useState, useEffect, useCallback } from 'react';

/**
 * Manages school-specific browser preferences stored as {slug}_mode, {slug}_lang, {slug}_fontsize
 * Isolated per tenant so multi-tab viewing never cross-contaminates settings.
 */
export function useSchoolPrefs(slug, defaultTheme = 'emerald', defaultMode = 'dark') {
  // 1. Theme Mode: dark | light
  const [mode, setModeState] = useState(() => {
    if (!slug) return 'dark';
    try {
      // Check legacy migration
      const legacyMode = localStorage.getItem(`${slug}_mode`) || localStorage.getItem('bdhs_mode');
      if (legacyMode && ['dark', 'light'].includes(legacyMode)) {
        localStorage.setItem(`${slug}_mode`, legacyMode);
        return legacyMode;
      }
    } catch (e) {}
    return defaultMode || 'dark';
  });

  // 2. Language: bn | en
  const [lang, setLangState] = useState(() => {
    if (!slug) return 'bn';
    try {
      const savedLang = localStorage.getItem(`${slug}_lang`);
      if (savedLang && ['bn', 'en'].includes(savedLang)) return savedLang;
    } catch (e) {}
    return 'bn';
  });

  // 3. Font Scale: 'sm' (14px) | 'md' (16px) | 'lg' (18px)
  const [fontSize, setFontSizeState] = useState(() => {
    if (!slug) return 'md';
    try {
      const savedSize = localStorage.getItem(`${slug}_fontsize`);
      if (savedSize && ['sm', 'md', 'lg'].includes(savedSize)) return savedSize;
    } catch (e) {}
    return 'md';
  });

  // Apply Mode & School Theme to HTML root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('mode-dark', 'mode-light');
    root.classList.add(mode === 'light' ? 'mode-light' : 'mode-dark');
    root.setAttribute('data-theme', mode);
    root.setAttribute('data-school-theme', defaultTheme || 'emerald');
  }, [mode, defaultTheme]);

  // Apply Font Size to HTML root
  useEffect(() => {
    const root = document.documentElement;
    const sizes = { sm: '14px', md: '16px', lg: '18px' };
    root.style.fontSize = sizes[fontSize] || '16px';
  }, [fontSize]);

  // Apply Lang attribute to HTML
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Circular view-transition toggle
  const toggleMode = useCallback((event) => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const commit = () => {
      setModeState(nextMode);
      if (slug) {
        try { localStorage.setItem(`${slug}_mode`, nextMode); } catch (e) {}
      }
    };

    if (!document.startViewTransition || prefersReduced) {
      commit();
      return;
    }

    if (event && event.clientX !== undefined && event.clientY !== undefined) {
      document.documentElement.style.setProperty('--tx', `${event.clientX}px`);
      document.documentElement.style.setProperty('--ty', `${event.clientY}px`);
    } else {
      document.documentElement.style.setProperty('--tx', '50%');
      document.documentElement.style.setProperty('--ty', '50%');
    }

    document.startViewTransition(() => {
      commit();
    });
  }, [mode, slug]);

  const toggleLang = useCallback(() => {
    const nextLang = lang === 'bn' ? 'en' : 'bn';
    setLangState(nextLang);
    if (slug) {
      try { localStorage.setItem(`${slug}_lang`, nextLang); } catch (e) {}
    }
  }, [lang, slug]);

  const setFontSize = useCallback((size) => {
    if (!['sm', 'md', 'lg'].includes(size)) return;
    setFontSizeState(size);
    if (slug) {
      try { localStorage.setItem(`${slug}_fontsize`, size); } catch (e) {}
    }
  }, [slug]);

  return {
    mode,
    isDark: mode === 'dark',
    toggleMode,
    lang,
    toggleLang,
    fontSize,
    setFontSize
  };
}
