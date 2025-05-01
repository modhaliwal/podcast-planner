
import { ReactNode } from 'react';
import {
  FormProvider,
  UseFormReturn,
  FieldValues,
} from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  className?: string;
  children: ReactNode;
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  className,
  children,
}: FormProps<T>) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLElement) {
      // Allow Enter on buttons
      if (e.target.tagName === 'BUTTON') return;
      
      // Prevent form submission on inputs
      if (e.target.tagName === 'INPUT') {
        e.preventDefault();
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
        onKeyDown={handleKeyDown}
      >
        {children}
      </form>
    </FormProvider>
  );
}
