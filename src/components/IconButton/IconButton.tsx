import { forwardRef, type ReactNode } from 'react';
import { Button, type ButtonProps } from '@/components/Button/Button';
import { Tooltip } from '@/components/Tooltip/Tooltip';

interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon' | 'iconOnly' | 'aria-label'> {
  /** Required accessible name (also used as the tooltip text). */
  label: string;
  icon: ReactNode;
  tooltip?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, tooltip = true, variant = 'ghost', ...rest },
  ref,
) {
  const button = (
    <Button ref={ref} variant={variant} iconOnly aria-label={label} {...rest}>
      {icon}
    </Button>
  );
  return tooltip ? <Tooltip content={label}>{button}</Tooltip> : button;
});