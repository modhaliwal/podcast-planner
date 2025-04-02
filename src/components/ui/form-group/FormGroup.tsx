
import React, { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormGroupContextValue {
  id: string;
  isInvalid: boolean;
}

const FormGroupContext = createContext<FormGroupContextValue | undefined>(undefined);

export function useFormGroup() {
  const context = useContext(FormGroupContext);
  if (!context) {
    throw new Error('Form group components must be used within a FormGroup');
  }
  return context;
}

interface FormGroupProps {
  children: ReactNode;
  id: string;
  isInvalid?: boolean;
  className?: string;
}

export function FormGroup({ children, id, isInvalid = false, className }: FormGroupProps) {
  return (
    <FormGroupContext.Provider value={{ id, isInvalid }}>
      <div className={cn('space-y-2', className)}>
        {children}
      </div>
    </FormGroupContext.Provider>
  );
}

interface FormLabelProps {
  children: ReactNode;
  className?: string;
  required?: boolean;
}

export function FormLabel({ children, className, required }: FormLabelProps) {
  const { id, isInvalid } = useFormGroup();
  
  return (
    <label
      htmlFor={id}
      className={cn(
        'block text-sm font-medium',
        isInvalid ? 'text-destructive' : 'text-foreground',
        className
      )}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function FormInput({ className, ...props }: FormInputProps) {
  const { id, isInvalid } = useFormGroup();
  
  return (
    <input
      id={id}
      className={cn(
        'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        isInvalid 
          ? 'border-destructive focus:ring-destructive' 
          : 'border-input focus:ring-ring',
        className
      )}
      aria-invalid={isInvalid}
      {...props}
    />
  );
}

interface FormErrorProps {
  children?: ReactNode;
  message?: string;
  className?: string;
}

export function FormError({ children, message, className }: FormErrorProps) {
  const { isInvalid } = useFormGroup();
  
  if (!isInvalid || (!children && !message)) {
    return null;
  }
  
  return (
    <div className={cn('text-destructive text-sm', className)}>
      {children || message}
    </div>
  );
}

interface FormHelpProps {
  children: ReactNode;
  className?: string;
}

export function FormHelp({ children, className }: FormHelpProps) {
  return (
    <div className={cn('text-muted-foreground text-sm', className)}>
      {children}
    </div>
  );
}
