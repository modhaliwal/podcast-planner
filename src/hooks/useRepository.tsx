import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/toast/use-toast';

export function useRepository() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const invalidateQueries = (queryKeys: string[]) => {
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  };

  const showSuccessToast = (message: string) => {
    toast({
      title: "Success",
      description: message
    });
  };

  const showErrorToast = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
  };

  return {
    isLoading,
    setIsLoading,
    invalidateQueries,
    showSuccessToast,
    showErrorToast
  };
}
