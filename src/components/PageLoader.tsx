import { Spinner } from '@/components/Spinner/Spinner';
import { useT } from '@/i18n';
import styles from './PageLoader.module.css';

/** Suspense fallback for lazy routes. */
export function PageLoader() {
  const t = useT();
  return (
    <div className={styles.loader}>
      <Spinner size="lg" label={t('common.loading')} />
    </div>
  );
}