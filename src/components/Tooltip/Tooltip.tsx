import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import clsx from 'clsx';
import styles from './Tooltip.module.css';

interface TooltipProps {
  content: string;
  placement?: 'top' | 'bottom';
  children: ReactElement<{ 'aria-describedby'?: string }>;
}

const SHOW_DELAY_MS = 400;

/** Shows on hover (delayed) and keyboard focus (instant); Esc dismisses (WCAG 1.4.13). */
export function Tooltip({ content, placement = 'top', children }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const clear = () => window.clearTimeout(timer.current);
  const hide = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpen(false);
  }, []);
  const showSoon = () => {
    clear();
    timer.current = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
  };
  const showNow = () => {
    clear();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, hide]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <span
      className={styles.wrapper}
      onMouseEnter={showSoon}
      onMouseLeave={hide}
      onFocus={showNow}
      onBlur={hide}
    >
      {cloneElement(children, { 'aria-describedby': id })}
      <span
        id={id}
        role="tooltip"
        className={clsx(styles.tooltip, styles[placement], open && styles.open)}
      >
        {content}
      </span>
    </span>
  );
}