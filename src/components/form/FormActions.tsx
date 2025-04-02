
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
  children?: ReactNode;
}

export function FormActions({
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onCancel,
  isSubmitting = false,
  className,
  children,
}: FormActionsProps) {
  return (
    <div className={cn('flex items-center justify-end space-x-4', className)}>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {submitLabel}
      </Button>
      {children}
    </div>
  );
}
