
import { UseFormReturn } from "react-hook-form";
import { useContentVersions as useVersions } from "./versions";

interface UseContentVersionsProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: keyof T;
  versionsFieldName: keyof T;
}

/**
 * @deprecated Use imported useContentVersions from ./versions instead
 */
export function useContentVersions<T extends Record<string, any>>(props: UseContentVersionsProps<T>) {
  return useVersions(props);
}
