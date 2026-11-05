import type { ElementType, ReactNode } from 'react';

interface VisuallyHiddenProps {
  children: ReactNode;
  as?: ElementType;
}

/** Content for screen readers only. */
export function VisuallyHidden({ children, as: Tag = 'span' }: VisuallyHiddenProps) {
  return <Tag className="visually-hidden">{children}</Tag>;
}