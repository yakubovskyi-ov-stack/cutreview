import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { safeStorage } from '@/lib/safeStorage';

export const THEME_PREFERENCES = ['dark', 'light', 'system'] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type ResolvedTheme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'cutreview.theme';
const LIGHT_QUERY = '(prefers-color-scheme: light)';
const THEME_COLOR: Record<ResolvedTheme, string> = { dark: '#0b0d12', light: '#f6f7fa' };

export function isThemePreference(value: string | null): value is ThemePreference {
  return value !== null && (THEME_PREFERENCES as readonly string[]).includes(value);
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark';
}

interface ThemeValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    const stored = safeStorage.get(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : 'dark'; // dark is the default
  });
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  useEffect(() => {
    const query = window.matchMedia(LIGHT_QUERY);
    const onChange = () => setSystemTheme(query.matches ? 'light' : 'dark');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const resolved: ResolvedTheme = preference === 'system' ? systemTheme : preference;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[resolved]);
  }, [resolved]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    safeStorage.set(THEME_STORAGE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>');
  return value;
}