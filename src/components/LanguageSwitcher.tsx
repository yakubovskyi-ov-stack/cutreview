import { SegmentedControl, type SegmentOption } from '@/components/SegmentedControl/SegmentedControl';
import { LANGS, useLang, useT, type Lang } from '@/i18n';

export function LanguageSwitcher() {
  const t = useT();
  const { lang, setLang } = useLang();
  const options: SegmentOption<Lang>[] = LANGS.map((code) => ({
    value: code,
    label: code.toUpperCase(),
    lang: code,
  }));
  return <SegmentedControl label={t('common.language')} value={lang} options={options} onChange={setLang} />;
}