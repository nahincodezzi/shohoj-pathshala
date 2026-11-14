import { useState, useEffect, useCallback } from 'react';

/**
 * useTheme Hook for Sohoj Pathshala
 * Supports isolated localStorage keys per tenant: {slug}_mode, {slug}_theme
 * Supports platform owner: owner_mode (theme locked to indigo)
 * Supports landing: platform_mode, platform_theme
 */
export function useTheme(options = {}) {
  const { slug, isOwner = false } = options;

  // Determine storage keys
  const modeKey = isOwner 
    ? 'owner_mode' 
    : (slug ? `${slug}_mode` : 'platform_mode');
    
  const themeKey = isOwner 
    ? 'owner_theme' 
    : (slug ? `${slug}_theme` : 'platform_theme');

  // Initialize state from localStorage or defaults
  const [mode, setModeState] = useState(() => {
    try {
      const saved = localStorage.getItem(modeKey);
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [theme, setThemeState] = useState(() => {
    if (isOwner) return 'indigo';
    try {
      const saved = localStorage.getItem(themeKey);
      return saved === 'indigo' ? 'indigo' : 'emerald';
    } catch {
      return 'emerald';
    }
  });

  // Apply to DOM
  const applyThemeToDOM = useCallback((currentMode, currentTheme) => {
    const root = document.documentElement;
    root.classList.remove('mode-dark', 'mode-light', 'theme-emerald', 'theme-indigo');
    root.classList.add(currentMode === 'light' ? 'mode-light' : 'mode-dark');
    root.classList.add(currentTheme === 'indigo' ? 'theme-indigo' : 'theme-emerald');
  }, []);

  // Sync on mount or when mode/theme changes
  useEffect(() => {
    applyThemeToDOM(mode, theme);
  }, [mode, theme, applyThemeToDOM]);

  // Toggle Mode (dark <-> light)
  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const nextMode = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(modeKey, nextMode);
      } catch (err) {
        console.error('Failed to save mode:', err);
      }
      applyThemeToDOM(nextMode, theme);
      return nextMode;
    });
  }, [modeKey, theme, applyThemeToDOM]);

  // Explicit setMode
  const setMode = useCallback((newMode) => {
    const validMode = newMode === 'light' ? 'light' : 'dark';
    setModeState(validMode);
    try {
      localStorage.setItem(modeKey, validMode);
    } catch (err) {
      console.error('Failed to save mode:', err);
    }
    applyThemeToDOM(validMode, theme);
  }, [modeKey, theme, applyThemeToDOM]);

  // Explicit setTheme (Emerald / Indigo)
  const setTheme = useCallback((newTheme) => {
    if (isOwner) return; // Owner is strictly Indigo
    const validTheme = newTheme === 'indigo' ? 'indigo' : 'emerald';
    setThemeState(validTheme);
    try {
      localStorage.setItem(themeKey, validTheme);
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
    applyThemeToDOM(mode, validTheme);
  }, [isOwner, themeKey, mode, applyThemeToDOM]);

  return {
    mode,
    theme,
    toggleMode,
    setMode,
    setTheme,
    isDark: mode === 'dark'
  };
}
