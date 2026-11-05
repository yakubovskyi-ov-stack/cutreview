import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { IconButton } from '@/components/IconButton/IconButton';
import { useT } from '@/i18n';
import { lockScroll } from '@/lib/scrollLock';
import styles from './Modal.module.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
const EXIT_MS = 160;

/** Open dialogs, topmost last. Only the topmost one traps focus and handles Esc. */
const stack: HTMLElement[] = [];

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnBackdrop?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}: ModalProps) {
  const t = useT();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Keep rendering during the exit animation.
  const [rendered, setRendered] = useState(open);
  if (open && !rendered) setRendered(true);
  useEffect(() => {
    if (open || !rendered) return;
    const id = window.setTimeout(() => setRendered(false), EXIT_MS);
    return () => window.clearTimeout(id);
  }, [open, rendered]);

  // Focus trap, Esc, scroll lock, focus restore.
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const unlock = lockScroll();
    stack.push(dialog);
    const isTop = () => stack[stack.length - 1] === dialog;

    (dialog.querySelector<HTMLElement>('[data-autofocus]') ?? dialog).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isTop()) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === dialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onFocusIn = (e: FocusEvent) => {
      if (isTop() && e.target instanceof Node && !dialog.contains(e.target)) dialog.focus();
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocusIn);
      stack.splice(stack.indexOf(dialog), 1);
      unlock();
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!rendered) return null;
  const closing = !open;

  return createPortal(
    <div
      className={clsx(styles.backdrop, closing && styles.closing)}
      role="presentation"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={clsx(styles.dialog, styles[size])}
      >
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <IconButton
            label={t('actions.close')}
            icon={<X size={18} aria-hidden="true" />}
            size="sm"
            onClick={onClose}
          />
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}