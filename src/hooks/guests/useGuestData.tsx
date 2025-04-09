
import { useState, useCallback, useEffect } from "react";
import { Guest } from "@/lib/types";
import { repositories } from "@/repositories";
import { toast } from "@/hooks/use-toast";

export function useGuestData(guestId: string | undefined) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchGuest = useCallback(async () => {
    if (!guestId) {
      setIsLoading(false);
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const guestData = await repositories.guests.getById(guestId);
      setGuest(guestData);
    } catch (error: any) {
      console.error("Error fetching guest:", error);
      setError(error instanceof Error ? error : new Error(error?.message || 'Failed to load guest'));
      toast({
        title: "Error fetching guest",
        description: error.message,
        variant: "destructive"
      });
      setGuest(null);
    } finally {
      setIsLoading(false);
    }
  }, [guestId]);
  
  useEffect(() => {
    fetchGuest();
  }, [fetchGuest]);
  
  return {
    guest,
    isLoading,
    error,
    refreshGuest: fetchGuest
  };
}
