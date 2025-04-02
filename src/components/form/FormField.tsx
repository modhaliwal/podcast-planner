
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormGroup, FormLabel, FormError, FormHelp } from '../ui/form-group';

interface FormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
}

export function FormField({ name, label, required, helperText, children }: FormFieldProps) {
  const { control, formState } = useFormContext();
  const error = formState.errors[name];
  
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormGroup id={name} isInvalid={!!error}>
          <FormLabel required={required}>{label}</FormLabel>
          {React.isValidElement(children)
            ? React.cloneElement(children as React.ReactElement, {
                ...field,
                id: name,
              })
            : children}
          {error && <FormError message={error.message?.toString()} />}
          {helperText && <FormHelp>{helperText}</FormHelp>}
        </FormGroup>
      )}
    />
  );
}
