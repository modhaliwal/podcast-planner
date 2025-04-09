import { ReactNode } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  className?: string;
  children: (field: { value: any; onChange: (...event: any[]) => void; }) => ReactNode;
}

/**
 * Reusable form field component to standardize form layout and behavior
 * Reduces duplication across form implementations
 */
export function FormField({
  name,
  label,
  description,
  className,
  children
}: FormFieldProps) {
  const { control } = useFormContext();
  
  return (
    <FormItem className={cn(className)}>
      {label && <FormLabel>{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl>
            {children(field)}
          </FormControl>
        )}
      />
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
