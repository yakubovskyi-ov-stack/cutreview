import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { safeStorage } from '@/lib/safeStorage';
import {
  I18nContext,
  LANG_STORAGE_KEY,
  readStoredLang,
  translate,
  type I18nValue,
  type Lang,
  type TFunction,
} from './index';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    safeStorage.set(LANG_STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback<TFunction>((key, params) => translate(lang, key, params), [lang]);
  const value = useMemo<I18nValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}