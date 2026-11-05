import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { IconButton } from '@/components/IconButton/IconButton';
import { Modal } from '@/components/Modal/Modal';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Spinner } from '@/components/Spinner/Spinner';
import { useToast } from '@/components/Toast/Toast';
import { useT } from '@/i18n';
import styles from './ComponentGallery.module.css';

const PLURAL_SAMPLES = [1, 2, 5, 11, 21] as const;

/** Temporary visual smoke-test of the base components. Deleted once real screens exist. */
export function ComponentGallery() {
  const t = useT();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className={styles.gallery} aria-labelledby="gallery-title">
      <h2 id="gallery-title" className={styles.heading}>
        {t('dev.galleryTitle')}
      </h2>

      <h3 className={styles.sub}>{t('dev.buttons')}</h3>
      <div className={styles.row}>
        <Button>{t('dev.primary')}</Button>
        <Button variant="secondary">{t('dev.secondary')}</Button>
        <Button variant="ghost">{t('dev.ghost')}</Button>
        <Button variant="danger">{t('dev.danger')}</Button>
        <Button disabled>{t('dev.disabled')}</Button>
        <Button loading>{t('dev.loadingButton')}</Button>
        <IconButton label={t('dev.iconButton')} icon={<Settings size={18} aria-hidden="true" />} />
        <Spinner label={t('common.loading')} />
      </div>

      <h3 className={styles.sub}>{t('dev.feedback')}</h3>
      <div className={styles.row}>
        <Button variant="secondary" onClick={() => toast.success(t('dev.toastSuccess'))}>
          {t('dev.showSuccess')}
        </Button>
        <Button variant="secondary" onClick={() => toast.error(t('dev.toastError'))}>
          {t('dev.showError')}
        </Button>
        <Button onClick={() => setModalOpen(true)}>{t('dev.openModal')}</Button>
      </div>

      <div className={styles.skeletons} aria-busy="true">
        <Skeleton width="60%" height="1.25rem" />
        <Skeleton height="0.875rem" />
        <Skeleton width="80%" height="0.875rem" />
      </div>

      <h3 className={styles.sub}>{t('dev.plurals')}</h3>
      <ul className={styles.plurals} role="list">
        {PLURAL_SAMPLES.map((count) => (
          <li key={count}>{t('plurals.comments', { count })}</li>
        ))}
      </ul>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('dev.modalTitle')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              {t('actions.cancel')}
            </Button>
            <Button onClick={() => setModalOpen(false)}>{t('actions.confirm')}</Button>
          </>
        }
      >
        <p>{t('dev.modalText')}</p>
        <label className={styles.field}>
          <span>{t('dev.modalField')}</span>
          <input className={styles.input} type="text" data-autofocus />
        </label>
      </Modal>
    </section>
  );
}