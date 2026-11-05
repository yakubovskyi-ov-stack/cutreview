import { SegmentedControl, type SegmentOption } from '@/components/SegmentedControl/SegmentedControl';
import { THEME_PREFERENCES, useTheme, type ThemePreference } from '@/app/ThemeProvider';
import { useT } from '@/i18n';

export function ThemeSwitcher() {
  const t = useT();
  const { preference, setPreference } = useTheme();
  const options: SegmentOption<ThemePreference>[] = THEME_PREFERENCES.map((value) => ({
    value,
    label: t(`theme.${value}`),
  }));
  return <SegmentedControl label={t('common.theme')} value={preference} options={options} onChange={setPreference} />;
}