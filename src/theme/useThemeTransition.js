import { useCallback } from 'react';
import { useTheme } from '../hooks/useTheme';

export function useThemeTransition(options = {}) {
  const { mode, theme, toggleMode: baseToggleMode, setMode: baseSetMode, isDark } = useTheme(options);

  const toggleWithTransition = useCallback((event) => {
    // If browser supports startViewTransition and user does not prefer reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!document.startViewTransition || prefersReduced) {
      baseToggleMode();
      return;
    }

    // Get click coordinates to center circular clip-path reveal
    if (event && event.clientX !== undefined && event.clientY !== undefined) {
      document.documentElement.style.setProperty('--tx', `${event.clientX}px`);
      document.documentElement.style.setProperty('--ty', `${event.clientY}px`);
    } else {
      document.documentElement.style.setProperty('--tx', '50%');
      document.documentElement.style.setProperty('--ty', '50%');
    }

    document.startViewTransition(() => {
      baseToggleMode();
    });
  }, [baseToggleMode]);

  return {
    mode,
    theme,
    isDark,
    toggleMode: toggleWithTransition,
    setMode: baseSetMode
  };
}

export default useThemeTransition;
