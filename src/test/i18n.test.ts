import { describe, expect, it } from 'vitest';
import { translate } from '@/i18n';

describe('translate', () => {
  it('interpolates {params}', () => {
    expect(translate('en', 'errors.fileTooLarge', { max: 50 })).toBe(
      'The file is too large. Maximum size: 50 MB.',
    );
  });

  it('keeps unknown placeholders intact', () => {
    expect(translate('uk', 'errors.fileTooLarge')).toContain('{max}');
  });

  it('uses Ukrainian plural forms (one / few / many)', () => {
    const t = (count: number) => translate('uk', 'plurals.comments', { count });
    expect(t(1)).toBe('1 коментар');
    expect(t(2)).toBe('2 коментарі');
    expect(t(5)).toBe('5 коментарів');
    expect(t(11)).toBe('11 коментарів');
    expect(t(21)).toBe('21 коментар');
    expect(t(22)).toBe('22 коментарі');
  });

  it('uses English plural forms', () => {
    expect(translate('en', 'plurals.comments', { count: 1 })).toBe('1 comment');
    expect(translate('en', 'plurals.comments', { count: 3 })).toBe('3 comments');
  });
});