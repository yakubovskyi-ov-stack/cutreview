import clsx from 'clsx';
import { VisuallyHidden } from '@/components/VisuallyHidden/VisuallyHidden';
import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label. Omit when the spinner is decorative (e.g. inside a button). */
  label?: string;
  className?: string;
}

export function Spinner({ size = 'md', label, className }: SpinnerProps) {
  return (
    <span
      className={clsx(styles.spinner, styles[size], className)}
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
    >
      <svg className={styles.svg} viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <circle className={styles.track} cx="12" cy="12" r="9" />
        <circle className={styles.arc} cx="12" cy="12" r="9" />
      </svg>
      {label && <VisuallyHidden>{label}</VisuallyHidden>}
    </span>
  );
}