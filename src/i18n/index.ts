import { createContext, useContext } from 'react';
import { safeStorage } from '@/lib/safeStorage';
import en from './en.json';
import uk from './uk.json';

export const LANGS = ['uk', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'uk';
export const LANG_STORAGE_KEY = 'cutreview.lang';

export function isLang(value: string | null): value is Lang {
  return value !== null && (LANGS as readonly string[]).includes(value);
}

export function readStoredLang(): Lang {
  const stored = safeStorage.get(LANG_STORAGE_KEY);
  return isLang(stored) ? stored : DEFAULT_LANG;
}

/* ---------- Typed keys ----------
   A "leaf" is either a string or a plural object (has an `other` form).
   MessageKey is the union of all dot-paths to leaves, so t('typo.key') fails to compile. */
type PluralObject = { other: string };
type Leaves<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends PluralObject
      ? K
      : `${K}.${Leaves<T[K]>}`;
}[keyof T & string];

export type MessageKey = Leaves<typeof en>;

/** Compile-time guarantee that uk.json and en.json have exactly the same keys. */
export type TranslationParity = [Leaves<typeof uk>] extends [Leaves<typeof en>]
  ? [Leaves<typeof en>] extends [Leaves<typeof uk>]
    ? true
    : never
  : never;
export const translationParity: TranslationParity = true;

type Dict = { [key: string]: string | Dict };
const dictionaries: Record<Lang, Dict> = { uk, en };

export type TranslateParams = Record<string, string | number>;
export type TFunction = (key: MessageKey, params?: TranslateParams) => string;

function lookup(dict: Dict, key: string): string | Dict | undefined {
  let node: string | Dict | undefined = dict;
  for (const part of key.split('.')) {
    if (typeof node !== 'object') return undefined;
    node = node[part];
  }
  return node;
}

const pluralRulesCache = new Map<Lang, Intl.PluralRules>();
function getPluralRules(lang: Lang): Intl.PluralRules {
  let rules = pluralRulesCache.get(lang);
  if (!rules) {
    rules = new Intl.PluralRules(lang);
    pluralRulesCache.set(lang, rules);
  }
  return rules;
}

/** Pure translation function (also used directly in unit tests). */
export function translate(lang: Lang, key: MessageKey, params?: TranslateParams): string {
  const entry = lookup(dictionaries[lang], key);
  let template: string | undefined;

  if (typeof entry === 'string') {
    template = entry;
  } else if (entry) {
    // Plural object: pick the form via Intl.PluralRules (uk: one/few/many/other).
    const count = params?.count;
    const category = typeof count === 'number' ? getPluralRules(lang).select(count) : 'other';
    const form = entry[category] ?? entry.other;
    if (typeof form === 'string') template = form;
  }

  if (template === undefined) return key;

  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params?.[name];
    return value === undefined ? match : String(value);
  });
}

/* ---------- React context (provider lives in I18nProvider.tsx) ---------- */
export interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TFunction;
}

export const I18nContext = createContext<I18nValue | null>(null);

function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useT/useLang must be used inside <I18nProvider>');
  return value;
}

/** Returns the translate function. Re-renders when the language changes. */
export function useT(): TFunction {
  return useI18n().t;
}

export function useLang(): Pick<I18nValue, 'lang' | 'setLang'> {
  const { lang, setLang } = useI18n();
  return { lang, setLang };
}