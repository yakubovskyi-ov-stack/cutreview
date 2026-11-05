import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { IconButton } from '@/components/IconButton/IconButton';
import { useT } from '@/i18n';
import styles from './Toast.module.css';

export type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

export interface ToastApi {
  show: (kind: ToastKind, message: string) => number;
  success: (message: string) => number;
  error: (message: string) => number;
  info: (message: string) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const DURATION_MS: Record<ToastKind, number> = { success: 4000, info: 5000, error: 8000 };
const MAX_VISIBLE = 4;
const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info } as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((item) => item.id !== id));
  }, []);

  const show = useCallback((kind: ToastKind, message: string) => {
    nextId.current += 1;
    const id = nextId.current;
    setToasts((list) => [...list.slice(-(MAX_VISIBLE - 1)), { id, kind, message }]);
    return id;
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      dismiss,
      success: (message) => show('success', message),
      error: (message) => show('error', message),
      info: (message) => show('info', message),
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div className={styles.region} aria-live="polite" aria-relevant="additions">
          {toasts.map((toast) => (
            <ToastView key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

function ToastView({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const t = useT();
  const [paused, setPaused] = useState(false);
  const Icon = ICONS[toast.kind];

  // Auto-dismiss; hovering or focusing the toast pauses the timer.
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => onDismiss(toast.id), DURATION_MS[toast.kind]);
    return () => window.clearTimeout(id);
  }, [paused, toast.id, toast.kind, onDismiss]);

  return (
    <div
      className={clsx(styles.toast, styles[toast.kind])}
      role={toast.kind === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon className={styles.icon} size={20} aria-hidden="true" />
      <p className={styles.message}>{toast.message}</p>
      <IconButton
        label={t('actions.close')}
        icon={<X size={16} aria-hidden="true" />}
        size="sm"
        tooltip={false}
        onClick={() => onDismiss(toast.id)}
      />
    </div>
  );
}

export function useToast(): ToastApi {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast must be used inside <ToastProvider>');
  return value;
}