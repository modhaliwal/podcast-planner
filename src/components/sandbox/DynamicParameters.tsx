
import { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface DynamicParametersProps {
  generator: {
    parameters?: string;
    title: string;
    prompt_text?: string; // Make prompt_text optional
  };
  form: UseFormReturn<any>;
}

export function DynamicParameters({ generator, form }: DynamicParametersProps) {
  const [parameterFields, setParameterFields] = useState<string[]>([]);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  
  // Parse parameters from the generator
  useEffect(() => {
    try {
      // If parameters exist and are in JSON format, parse them
      if (generator.parameters) {
        const params = JSON.parse(generator.parameters);
        if (Array.isArray(params)) {
          setParameterFields(params);
          
          // Initialize with empty values
          const initialValues: Record<string, string> = {};
          params.forEach(param => {
            initialValues[param] = '';
          });
          setParamValues(initialValues);
          
          // Update the form's parameters field with empty JSON
          form.setValue('parameters', JSON.stringify(initialValues));
        }
      } else if (generator.prompt_text) {
        // Look for parameter placeholders in the prompt text using regex {paramName}
        const regex = /{([a-zA-Z0-9_]+)}/g;
        const matches = Array.from(generator.prompt_text.matchAll(regex));
        const extractedParams = matches.map(match => match[1]);
        
        // Remove duplicates
        const uniqueParams = [...new Set(extractedParams)];
        
        if (uniqueParams.length > 0) {
          setParameterFields(uniqueParams);
          
          // Initialize with empty values
          const initialValues: Record<string, string> = {};
          uniqueParams.forEach(param => {
            initialValues[param] = '';
          });
          setParamValues(initialValues);
          
          // Update the form's parameters field with empty JSON
          form.setValue('parameters', JSON.stringify(initialValues));
        } else {
          setParameterFields([]);
          setParamValues({});
          form.setValue('parameters', '{}');
        }
      } else {
        // No parameters or prompt_text available
        setParameterFields([]);
        setParamValues({});
        form.setValue('parameters', '{}');
      }
    } catch (error) {
      console.error('Error parsing parameters:', error);
      setParameterFields([]);
      setParamValues({});
      form.setValue('parameters', '{}');
    }
  }, [generator, form]);
  
  // Update the form's parameters field when individual parameter values change
  const handleParamChange = (param: string, value: string) => {
    const updatedValues = { ...paramValues, [param]: value };
    setParamValues(updatedValues);
    form.setValue('parameters', JSON.stringify(updatedValues));
  };
  
  // If no parameters are available
  if (parameterFields.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2">
        No parameters required for this generator.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <FormLabel>Parameters</FormLabel>
      <div className="space-y-3 border rounded-md p-4">
        {parameterFields.map((param) => (
          <div key={param} className="space-y-1">
            <FormLabel className="text-sm">{param}</FormLabel>
            <Textarea
              placeholder={`Enter ${param}`}
              className="h-10 resize-none"
              value={paramValues[param] || ''}
              onChange={(e) => handleParamChange(param, e.target.value)}
            />
          </div>
        ))}
      </div>
      
      {/* Hidden field to store the JSON representation of parameters */}
      <FormField
        control={form.control}
        name="parameters"
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />
    </div>
  );
}
