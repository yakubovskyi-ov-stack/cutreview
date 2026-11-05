import type { CSSProperties } from 'react';
import clsx from 'clsx';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  circle?: boolean;
  className?: string;
}

/** Decorative placeholder. The surrounding container should set aria-busy. */
export function Skeleton({ width = '100%', height = '1rem', circle = false, className }: SkeletonProps) {
  return (
    <span
      className={clsx(styles.skeleton, circle && styles.circle, className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}