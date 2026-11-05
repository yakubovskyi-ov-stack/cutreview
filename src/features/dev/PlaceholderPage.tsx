import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useT, type MessageKey } from '@/i18n';
import { ComponentGallery } from './ComponentGallery';
import styles from './PlaceholderPage.module.css';

const LINKS: ReadonlyArray<{ to: string; label: MessageKey }> = [
  { to: '/', label: 'pages.landing' },
  { to: '/login', label: 'pages.login' },
  { to: '/dashboard', label: 'pages.dashboard' },
  { to: '/project/demo', label: 'pages.project' },
  { to: '/r/demo-token', label: 'pages.review' },
  { to: '/settings', label: 'pages.settings' },
  { to: '/nope', label: 'pages.notFound' },
];

interface PlaceholderPageProps {
  titleKey: MessageKey;
  param?: string;
}

/** Temporary page used until each feature is built. Removed page by page in later phases. */
export function PlaceholderPage({ titleKey, param }: PlaceholderPageProps) {
  const t = useT();
  const mainRef = useRef<HTMLElement>(null);
  const title = t(titleKey);

  useEffect(() => {
    document.title = `${title} · ${t('app.name')}`;
  }, [title, t]);

  return (
    <div className={styles.page}>
      {/* A button (not href="#main"): a hash link would change the HashRouter route. */}
      <button type="button" className="skip-link" onClick={() => mainRef.current?.focus()}>
        {t('common.skipToContent')}
      </button>

      <header className={styles.header}>
        <nav className={styles.nav} aria-label={t('nav.main')}>
          <ul className={styles.links} role="list">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end
                  className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
                >
                  {t(link.label)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.switchers}>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>

      <main ref={mainRef} id="main" tabIndex={-1} className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        {param !== undefined && <p className={styles.param}>{t('dev.param', { value: param })}</p>}
        {titleKey === 'pages.landing' && <ComponentGallery />}
      </main>
    </div>
  );
}