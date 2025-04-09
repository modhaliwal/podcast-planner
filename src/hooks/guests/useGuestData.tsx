
import { useState, useCallback, useEffect } from "react";
import { Guest } from "@/lib/types";
import { useAuthProxy } from "@/hooks/useAuthProxy";

export function useGuestData(guestId: string | undefined) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthProxy();
  
  const fetchGuest = useCallback(async () => {
    if (!guestId) {
      setIsLoading(false);
      return null;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from your API using the token
      console.log(`Fetching guest with ID: ${guestId}, token: ${token?.substring(0, 10) || 'none'}...`);
      
      // For now, we're using a mock implementation
      // This simulates a network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate fetching guest data from API
      const mockResponse = {
        ok: true,
        json: async () => ({
          id: guestId,
          name: "John Doe",
          title: "Software Engineer",
          company: "Example Corp",
          email: "john@example.com",
          phone: "555-123-4567",
          bio: "A talented software engineer with experience in React.",
          status: "confirmed" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          socialLinks: {} 
        })
      };
      
      if (mockResponse.ok) {
        const data = await mockResponse.json();
        setGuest(data);
      } else {
        console.error("Error fetching guest: Mock error");
        setGuest(null);
      }
    } catch (error) {
      console.error("Error fetching guest:", error);
      setGuest(null);
    } finally {
      setIsLoading(false);
    }
  }, [guestId, token]);
  
  useEffect(() => {
    fetchGuest();
  }, [fetchGuest]);
  
  return {
    guest,
    isLoading,
    refreshGuest: fetchGuest
  };
}
